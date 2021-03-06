"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var obj_1 = require("../src/invary/obj");
var obj_dev_mode_1 = require("../src/invary/obj_dev_mode");
function test(isObj, Obj, ObjInvary) {
    describe('ObjInvary', function () {
        it('should be created by factory from array then be instance of ObjInvary', function () {
            var obj = Obj([1]);
            expect(isObj(obj)).toBeTruthy();
            expect(isObj([])).toBeFalsy();
            expect(obj instanceof ObjInvary).toBeTruthy();
            expect(obj instanceof Array).toBeFalsy();
            expect(obj instanceof Object).toBeTruthy();
        });
        it('should be constructed', function () {
            expect(new ObjInvary() instanceof ObjInvary).toBeTruthy();
            expect(new ObjInvary([1]) instanceof ObjInvary).toBeTruthy();
        });
        it('should get value by existing path', function () {
            var obj = Obj([1, { a: 2 }]);
            expect(obj.get('0', 2)).toBe(1);
            expect(obj.get('1.a')).toBe(2);
        });
        it('should get value by not existing path then return default', function () {
            var obj = Obj([1, { a: 2 }]);
            expect(obj.get('2', 2)).toBe(2);
            expect(obj.get('1.b', 2)).toBe(2);
        });
        it('should not set same value by existing path then return same instance of ObjInvary', function () {
            var obj = Obj([1, { a: 2 }]);
            var ob2 = obj.set('0', 1);
            var ob3 = obj.set('1.a', 2);
            expect(ob2).toBe(obj);
            expect(ob3).toBe(obj);
        });
        it('should set new value by existing path then return new instance of ObjInvary', function () {
            var obj = Obj([1, { a: 2 }]);
            var ob2 = obj.set('0', 2);
            var ob3 = obj.set('1.a', 3);
            expect(ob2).not.toBe(obj);
            expect(ob3).not.toBe(obj);
            expect(obj[0]).toBe(1);
            expect(ob2[0]).toBe(2);
            expect(obj[1]).toBe(ob2[1]);
            expect(obj[1]).not.toBe(ob3[1]);
        });
        it('should not set all same values by existing path then return same instance of ObjInvary', function () {
            var obj = Obj([1, { a: 2 }]);
            var ob2 = obj.all('0', 1, '1.a', 2);
            expect(ob2).toBe(obj);
        });
        it('should set all new values by existing path then return new instance of ObjInvary', function () {
            var obj = Obj([1, { a: 2, b: 2 }]);
            var ob2 = obj.all('0', 2, '1.a', 3, '1.b', 3);
            expect(obj).toEqual(Obj([1, { a: 2, b: 2 }]));
            expect(ob2).not.toBe(obj);
            expect(ob2.length).toBe(undefined);
            expect(ob2).toEqual(Obj([2, { a: 3, b: 3 }]));
            var ob3 = obj.all('0', 2);
            expect(obj).toEqual(Obj([1, { a: 2, b: 2 }]));
            expect(ob3).not.toBe(obj);
            expect(ob3.length).toBe(undefined);
            expect(ob3).toEqual(Obj([2, { a: 2, b: 2 }]));
        });
        it('should set all new values by not existing path then return new instance of ObjInvary', function () {
            var obj = Obj([1, { a: 2, b: 2 }]);
            var ob2 = obj.all('0', 2, '1.a', 3, '1.b.c', 3);
            expect(obj).toEqual(Obj([1, { a: 2, b: 2 }]));
            expect(ob2).not.toBe(obj);
            expect(ob2.length).toBe(undefined);
            expect(ob2).toEqual(Obj([2, { a: 3, b: { c: 3 } }]));
            var ob3 = obj.all('1.b.c', 3);
            expect(obj).toEqual(Obj([1, { a: 2, b: 2 }]));
            expect(ob3).not.toBe(obj);
            expect(ob3.length).toBe(undefined);
            expect(ob3).toEqual(Obj([1, { a: 2, b: { c: 3 } }]));
        });
        it('should process nested batch operations', function () {
            var obj = Obj([1, { a: 2 }, 3, 4]);
            var ob2 = obj.batch(function (mutable1) {
                var ob3 = mutable1.batch(function (mutable2) {
                    mutable2 = mutable2.set([0], 3);
                    expect(mutable2).not.toBe(obj);
                    expect(mutable2).not.toBe(ob2);
                    return mutable2;
                });
                mutable1 = mutable1.set([0], 2);
                expect(mutable1).not.toBe(obj);
                expect(mutable1).not.toBe(ob3);
                return mutable1;
            });
            expect(ob2).not.toBe(obj);
            var ob3 = obj.batch(function (mutable1) {
                mutable1 = mutable1.all([0], 2, [1, 'a', 3]);
                return mutable1;
            });
            expect(ob3).not.toBe(obj);
        });
        it('should freeze deeply', function () {
            var obj = Obj([1, { a: 2 }, 3, 4]);
            obj.freeze();
            function x() {
                obj[1].a = 3;
            }
            expect(x).toThrow();
        });
    });
}
test(obj_1.isObj, obj_1.Obj, obj_1.ObjInvary);
test(obj_dev_mode_1.isObj, obj_dev_mode_1.Obj, obj_dev_mode_1.ObjInvary);
