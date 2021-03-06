"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("../lib");
var lib_2 = require("../lib");
exports.Obj = function (value) {
    return new ObjInvary(value);
};
var copySet = new Set();
var specialized = lib_2.specialize(lib_1.objCopySingle);
exports.objSet = specialized.set;
exports.objSetPatch = specialized.setPatch;
exports.objAll = specialized.all;
exports.objAllPatch = specialized.allPatch;
var mutables = new Array(32);
var mutableCurrent = false;
var mutableDevMode = lib_1.Context.isDevMode;
var mutableIndex = 0;
function ObjInvary(obj, noFreeze) {
    if (obj) {
        lib_1.objCopySingle(obj, this);
    }
    if (true !== noFreeze) {
        lib_1.arrObjFreeze(this);
    }
}
exports.ObjInvary = ObjInvary;
var ObjInvaryProto = function () { };
ObjInvaryProto.prototype = Object.prototype;
ObjInvary.prototype = lib_1.objAssignSingle(new ObjInvaryProto(), {
    constructor: Object.prototype.constructor,
    all: function (a, b, c, d, e, f, g, h) {
        if (arguments.length < 3) {
            return ObjInvary.prototype.set.call(this, a, b);
        }
        var root = this;
        var self;
        var i, j, l, m;
        copySet.clear();
        for (i = 0, l = arguments.length; i < l; i += 2) {
            if (lib_1.anyGetInContext.call(this, arguments[i]) === arguments[i + 1]) {
                continue;
            }
            if (root === this) {
                if (mutableCurrent === true) {
                    self = root = mutableCurrent = new ObjInvary(this, true);
                }
                else {
                    self = root = mutableCurrent || new ObjInvary(this, true);
                }
            }
            else {
                self = root;
            }
            for (j = 0, m = lib_1.Context.getSetKeysCache.length - 1; j < m; j++) {
                var v = self[lib_1.Context.getSetKeysCache[j]];
                if (v && typeof v === "object") {
                    if (false === copySet.has(v)) {
                        self = self[lib_1.Context.getSetKeysCache[j]] = lib_1.arrObjClone(v);
                        copySet.add(self);
                    }
                    else {
                        self = v;
                    }
                }
                else {
                    self = self[lib_1.Context.getSetKeysCache[j]] = {};
                }
            }
            self[lib_1.Context.getSetKeysCache[j]] = arguments[i + 1];
        }
        if (!mutableCurrent) {
            root.freeze();
        }
        lib_1.Context.getSetKeysCache = null;
        return root;
    },
    get: lib_1.anyGetInContext,
    set: function (key, val) {
        if (lib_1.anyGetInContext.call(this, key) === val) {
            return this;
        }
        var root, self;
        var i, l;
        if (mutableCurrent === true) {
            self = root = mutableCurrent = new ObjInvary(this, true);
        }
        else {
            self = root = mutableCurrent || new ObjInvary(this, true);
        }
        for (i = 0, l = lib_1.Context.getSetKeysCache.length - 1; i < l; i++) {
            var v = self[lib_1.Context.getSetKeysCache[i]];
            self = self[lib_1.Context.getSetKeysCache[i]] = (v && typeof v === "object") ? lib_1.arrObjClone(v) : {};
        }
        self[lib_1.Context.getSetKeysCache[i]] = val;
        if (!mutableCurrent) {
            root.freeze();
        }
        lib_1.Context.getSetKeysCache = null;
        return root;
    },
    batch: function (callback) {
        mutables[++mutableIndex] = mutableCurrent;
        mutableCurrent = true;
        mutableDevMode = false;
        var result = callback(this);
        mutableCurrent = mutables[--mutableIndex];
        if (mutableIndex === 0) {
            mutableDevMode = lib_1.Context.isDevMode;
            if (result.freeze) {
                result.freeze();
            }
        }
        return result;
    },
    freeze: function () {
        return lib_1.arrObjFreeze(this);
    },
    isObj: function (val) { return val instanceof ObjInvary; },
});
exports.isObj = ObjInvary.prototype.isObj;
