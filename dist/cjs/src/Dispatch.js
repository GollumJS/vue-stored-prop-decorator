"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatch = void 0;
var Dispatch = function (store, dispatchName) {
    if (dispatchName === void 0) { dispatchName = null; }
    return function (target, propertyKey) {
        if (!dispatchName) {
            dispatchName = propertyKey;
        }
        Object.defineProperty(target, propertyKey, {
            value: function (value) {
                if (typeof store === 'string') {
                    return this.$store.dispatch(store + '/' + dispatchName, value);
                }
                return store().dispatch(dispatchName, value);
            },
            configurable: true
        });
    };
};
exports.Dispatch = Dispatch;
//# sourceMappingURL=Dispatch.js.map