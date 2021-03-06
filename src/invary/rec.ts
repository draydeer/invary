import {
    Context,
    anyGetInContext
} from "../lib";
import {
    TKey,
    TRecInvary
} from "../types";
import {objCopySingle, specialize} from "../lib";

const specialized = specialize(objCopySingle);
const setByGetSetKeysCache = specialized.setByGetSetKeysCache;

export function Rec<T>(props: T): TRecInvary<T> {
    class RecInvary {
        constructor(props?: Partial<T>) {
            if (props) {
                objCopySingle(props, this);
            }
        }

        public set(key: TKey, val: any) {
            if (anyGetInContext.call(this, key) === val) {
                return this;
            }

            if (false === Context.getSetKeysCache[0] in props) {
                throw new Error(`Key was not defined in props: ${Context.getSetKeysCache[0]}`);
            }

            return new RecInvary(setByGetSetKeysCache(this, val));
        };
    }

    objCopySingle(props, RecInvary.prototype);

    return <TRecInvary<T>>RecInvary;
}
