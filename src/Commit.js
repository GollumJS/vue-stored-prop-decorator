"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commit = function (store, commitName) {
    if (commitName === void 0) { commitName = null; }
    return function (target, propertyKey) {
        if (!commitName) {
            commitName = propertyKey;
        }
        Object.defineProperty(target, propertyKey, {
            value: function (value) {
                if (typeof store === 'string') {
                    return this.$store.dispatch(store + '/' + commitName, value);
                }
                return store().commit(commitName, value);
            },
            configurable: true
        });
    };
};
//# sourceMappingURL=Commit.js.map