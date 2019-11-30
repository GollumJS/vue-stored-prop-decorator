import {Store} from 'vuex';

export const Stored = function (store: () => Store<any>, propertyName: string = null) {
	return function(target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) {
		
		if (!propertyName) {
			propertyName = propertyKey;
		}
		
		Object.defineProperty(target, propertyKey, {
			get: function () {
				return store().state[propertyName];
			},
			set: function (value: any) {
				const name = 'set' + propertyName.replace(/\b\w/g, l => l.toUpperCase())
				store().commit(name, value);
			}
		});
		
	}
};