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
        var name = 'set' + propertyName.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
        var recurcive = false;
        var oldValue;
        var proxy;
        Object.defineProperty(target, propertyKey, {
            get: function () {
                var _this = this;
                var origin = null;
                if (typeof store === 'string') {
                    origin = this.$store.state[store][propertyName];
                }
                else {
                    origin = store().state[propertyName];
                }
                if (origin instanceof Object) {
                    if (origin === oldValue && proxy) {
                        return proxy;
                    }
                    var copy_1 = null;
                    var createProxy_1 = function (obj) {
                        if (obj instanceof Object) {
                            return new Proxy(obj, {
                                get: function (obj, prop) {
                                    if (obj instanceof Date && typeof obj[prop] === 'function') {
                                        return obj[prop].bind(obj);
                                    }
                                    if ((typeof prop !== 'string' || prop.indexOf('__') !== 0) && obj[prop] && typeof obj[prop] === 'object') {
                                        return createProxy_1(obj[prop]);
                                    }
                                    return obj[prop];
                                },
                                set: function (obj, prop, value) {
                                    var diff = obj[prop] !== value;
                                    obj[prop] = value;
                                    if (!recurcive && diff && (typeof prop !== 'string' || prop.indexOf('__') !== 0)) {
                                        recurcive = true;
                                        if (typeof store === 'string') {
                                            _this.$store.commit(store + '/' + name, copy_1);
                                        }
                                        else {
                                            store().commit(name, copy_1);
                                        }
                                        recurcive = false;
                                    }
                                    return true;
                                }
                            });
                        }
                        return obj;
                    };
                    if (Array.isArray(origin)) {
                        copy_1 = [];
                        for (var i = 0; i < origin.length; i++) {
                            copy_1[i] = origin[i];
                        }
                    }
                    else if (origin instanceof Date) {
                        copy_1 = new Date(origin);
                    }
                    else if (typeof origin.clone === 'function') {
                        copy_1 = origin.clone();
                    }
                    if (copy_1) {
                        oldValue = origin;
                        proxy = createProxy_1(copy_1);
                        return proxy;
                    }
                }
                return origin;
            },
            set: function (value) {
                if (!recurcive) {
                    recurcive = true;
                    if (typeof store === 'string') {
                        this.$store.commit(store + '/' + name, value);
                        recurcive = false;
                        return;
                    }
                    store().commit(name, value);
                    recurcive = false;
                }
            }
        });
    };
};
//# sourceMappingURL=index.js.map