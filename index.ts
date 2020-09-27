import {Store} from 'vuex';

export const Stored = function (store: (() => Store<any>)|string, propertyName: string = null) {
	return function(target: any, propertyKey: string = null, descriptor: PropertyDescriptor = null) {
		
		if (!propertyName) {
			propertyName = propertyKey;
		}
		
		Object.defineProperty(target, propertyKey, {
			get: function () {
				if (typeof store === 'string') {
					this.$store.state[(<string>store)][propertyName];
				}
				return (<() => Store<any>> store)().state[propertyName];
			},
			set: function (value: any) {
				const name = 'set' + propertyName.replace(/\b\w/g, l => l.toUpperCase());
				
				if (typeof store === 'string') {
					this.$store.commit((<string>store) + '/' + name, value);
				}
				(<() => Store<any>> store)().commit(name, value);
			}
		});
		
	}
};