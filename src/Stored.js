"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stored = function (store, _a) {
    var _b = _a === void 0 ? {} : _a, subProxy = _b.subProxy, readOnly = _b.readOnly, propName = _b.propName, commitName = _b.commitName;
    return function (target, propertyKey, descriptor) {
        if (propertyKey === void 0) { propertyKey = null; }
        if (descriptor === void 0) { descriptor = null; }
        if (!propName) {
            propName = propertyKey;
        }
        if (!commitName) {
            commitName = 'set' + propName.replace(/\b\w/g, function (l) { return l.toUpperCase(); });
        }
        var recurcive = false;
        var oldValue;
        var proxy;
        var get = function () {
            var _this = this;
            var origin = null;
            if (typeof store === 'string') {
                origin = this.$store.state[store][propName];
            }
            else {
                origin = store().state[propName];
            }
            if (subProxy && origin instanceof Object) {
                if (origin === oldValue && proxy) {
                    return proxy;
                }
                var copy_1 = null;
                var createProxy_1 = function (obj) {
                    var final = typeof store === 'string' ? store : store();
                    var originObject = obj['__stored_original__'] ? obj['__stored_original__'] : obj;
                    if (!obj['__stored_proxy__']) {
                        obj['__stored_proxy__'] = [];
                    }
                    for (var _i = 0, _a = obj['__stored_proxy__']; _i < _a.length; _i++) {
                        var infos = _a[_i];
                        if (infos.store === final &&
                            infos.commitName === commitName) {
                            return infos.proxy;
                        }
                    }
                    if (obj instanceof Object) {
                        var proxy_1 = new Proxy(obj, {
                            get: function (obj, prop) {
                                if (prop === '__stored_original__') {
                                    return obj;
                                }
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
                                        _this.$store.commit(store + '/' + commitName, copy_1);
                                    }
                                    else {
                                        store().commit(commitName, copy_1);
                                    }
                                    recurcive = false;
                                }
                                return true;
                            }
                        });
                        obj['__stored_proxy__'].push({
                            store: final,
                            commitName: commitName,
                            proxy: proxy_1
                        });
                        return proxy_1;
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
        };
        var set = function (value) {
            if (!recurcive) {
                recurcive = true;
                if (typeof store === 'string') {
                    this.$store.commit(store + '/' + commitName, value);
                    recurcive = false;
                    return;
                }
                store().commit(commitName, value);
                recurcive = false;
            }
        };
        Object.defineProperty(target, propertyKey, readOnly ? {
            get: get,
            configurable: true
        } : {
            get: get,
            set: set,
            configurable: true
        });
    };
};
//# sourceMappingURL=Stored.js.map