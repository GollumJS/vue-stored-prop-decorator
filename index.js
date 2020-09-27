"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stored = function (store, propertyName) {
    if (propertyName === void 0) { propertyName = null; }
    return function (target, propertyKey, descriptor) {
        if (propertyKey === void 0) { propertyKey = null; }
        if (descriptor === void 0) { descriptor = null; }
        if (!propertyName) {
            propertyName = propertyKey;
        }
        Object.defineProperty(target, propertyKey, {
            get: function () {
                if (typeof store === 'string') {
                    return this.$store.state[store][propertyName];
                }
                return store().state[propertyName];
            },
            set: function (value) {
                var name = 'set' + propertyName.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
                if (typeof store === 'string') {
                    this.$store.commit(store + '/' + name, value);
                    return;
                }
                store().commit(name, value);
            }
        });
    };
};
//# sourceMappingURL=index.js.map