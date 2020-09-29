import {Store} from 'vuex';

export const Stored = function (store: (() => Store<any>)|string, propertyName: string = null) {
	return function(target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) {
		
		if (!propertyName) {
			propertyName = propertyKey;
		}
        const name = 'set' + propertyName.replace(/\b\w/g, l => l.toUpperCase());
		
		Object.defineProperty(target, propertyKey, {
			get: function () {
				let origin: any = null;
				if (typeof store === 'string') {
					origin = this.$store.state[(<string>store)][propertyName];
				} else {
					origin = (<() => Store<any>> store)().state[propertyName];
				}
				
                if (origin instanceof Object) {

                    let copy: any = null;

                    const createProxy = (obj) => {
                        if (obj instanceof Object) {
                            return new Proxy(obj, {
                                get: (obj: any, prop: any) => {
                                    return createProxy(obj[prop]);
                                },
                                set: (obj: any, prop: any, value: any): boolean => {
                                    obj[prop] = value;
                                    if (typeof store === 'string') {
										this.$store.commit((<string>store) + '/' + name, copy);
									} else {
										(<() => Store<any>> store)().commit(name, copy);	
									}
                                    return true;
                                }
                            });
                        }
                        return obj;
                    };

                    if (Array.isArray(origin)) {
                        copy = [];
                        for (let i = 0; i < origin.length; i++) {
                        	copy[i] = origin[i];
                        }
                    } else if (typeof origin.clone === 'function') {
                        copy = origin.clone();
                    }

                    if (copy) {
                        return createProxy(copy);
                    }
                }
                return origin;
			},
			set: function (value: any) {
				if (typeof store === 'string') {
					this.$store.commit((<string>store) + '/' + name, value);
					return;
				}
				(<() => Store<any>> store)().commit(name, value);
			}
		});
		
	}
};