import {Store} from 'vuex';

export const Stored = function (store: (() => Store<any>)|string, propertyName: string = null) {
	return function(target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) {
		
		if (!propertyName) {
			propertyName = propertyKey;
		}
		const name = 'set' + propertyName.replace(/\b\w/g, l => l.toUpperCase());
		
		let recurcive = false;
		let oldValue: any;
		let proxy: any;
			
			
		Object.defineProperty(target, propertyKey, {
			get: function () {
				let origin: any = null;
				if (typeof store === 'string') {
					origin = this.$store.state[(<string>store)][propertyName];
				} else {
					origin = (<() => Store<any>> store)().state[propertyName];
				}
				
				if (origin instanceof Object) {
					if (origin === oldValue && proxy) {
						return proxy;
					}

					let copy: any = null;

					const createProxy = (obj) => {
						if (obj instanceof Object) {
							return new Proxy(obj, {
								get: (obj: any, prop: any) => {
									if (obj instanceof Date && typeof obj[prop] === 'function') {
										return obj[prop].bind(obj);
									}
									if ((typeof prop !== 'string' || prop.indexOf('__') !== 0) && obj[prop] && typeof obj[prop] === 'object') {
										return createProxy(obj[prop]);
									}
									return obj[prop];
								},
								set: (obj: any, prop: any, value: any): boolean => {
									const diff = obj[prop] !== value;
									obj[prop] = value;
                                    if (!recurcive && diff && (typeof prop !== 'string' || prop.indexOf('__') !== 0)) {
										recurcive = true;
										if (typeof store === 'string') {
											this.$store.commit((<string>store) + '/' + name, copy);
										} else {
											(<() => Store<any>> store)().commit(name, copy);	
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
			},
			set: function (value: any) {
				if (!recurcive) {
					recurcive = true;
					if (typeof store === 'string') {
						this.$store.commit((<string>store) + '/' + name, value);
						recurcive = false;
						return;
					}
					(<() => Store<any>> store)().commit(name, value);
					recurcive = false;
				}
			}
		});
		
	}
};