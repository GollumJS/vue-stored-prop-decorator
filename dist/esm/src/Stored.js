"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stored = void 0;
const Stored = function (store, { subProxy, readOnly, propName, commitName, isMethod, } = {}) {
    return function (target, propertyKey, descriptor) {
        if (!propName) {
            propName = propertyKey;
        }
        if (!commitName) {
            commitName = 'set' + propName.replace(/\b\w/g, l => l.toUpperCase());
        }
        if (isMethod) {
            readOnly = true;
        }
        let recurcive = false;
        let oldValue;
        let proxy;
        const get = function () {
            let origin = null;
            if (typeof store === 'string') {
                origin = this.$store.state[store][propName];
            }
            else {
                origin = store().state[propName];
            }
            if (isMethod) {
                let state = null;
                if (typeof store === 'string') {
                    state = this.$store.state[store];
                }
                else {
                    state = store().state;
                }
                return (...args) => {
                    return origin.apply(state, args);
                };
            }
            if (subProxy && origin instanceof Object) {
                if (origin === oldValue && proxy) {
                    return proxy;
                }
                let copy = null;
                const createProxy = (obj) => {
                    const final = typeof store === 'string' ? store : store();
                    const originObject = obj['__stored_original__'] ? obj['__stored_original__'] : obj;
                    if (!obj['__stored_proxy__']) {
                        obj['__stored_proxy__'] = [];
                    }
                    for (const infos of obj['__stored_proxy__']) {
                        if (infos.store === final &&
                            infos.commitName === commitName) {
                            return infos.proxy;
                        }
                    }
                    if (obj instanceof Object) {
                        const proxy = new Proxy(obj, {
                            get: (obj, prop) => {
                                if (prop === '__stored_original__') {
                                    return obj;
                                }
                                if (obj instanceof Date && typeof obj[prop] === 'function') {
                                    return obj[prop].bind(obj);
                                }
                                if ((typeof prop !== 'string' || prop.indexOf('__') !== 0) && obj[prop] && typeof obj[prop] === 'object') {
                                    return createProxy(obj[prop]);
                                }
                                return obj[prop];
                            },
                            set: (obj, prop, value) => {
                                const diff = obj[prop] !== value;
                                obj[prop] = value;
                                if (!recurcive && diff && (typeof prop !== 'string' || prop.indexOf('__') !== 0)) {
                                    recurcive = true;
                                    if (typeof store === 'string') {
                                        this.$store.commit(store + '/' + commitName, copy);
                                    }
                                    else {
                                        store().commit(commitName, copy);
                                    }
                                    recurcive = false;
                                }
                                return true;
                            }
                        });
                        obj['__stored_proxy__'].push({
                            store: final,
                            commitName: commitName,
                            proxy: proxy
                        });
                        return proxy;
                    }
                    return obj;
                };
                if (Array.isArray(origin)) {
                    copy = [];
                    for (let i = 0; i < origin.length; i++) {
                        copy[i] = origin[i];
                    }
                }
                else if (origin instanceof Date) {
                    copy = new Date(origin);
                }
                else if (typeof origin.clone === 'function') {
                    copy = origin.clone();
                }
                if (copy) {
                    oldValue = origin;
                    proxy = createProxy(copy);
                    return proxy;
                }
            }
            return origin;
        };
        const set = function (value) {
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
exports.Stored = Stored;
//# sourceMappingURL=Stored.js.map