import { Store } from 'vuex';

export const Dispatch = (store: (() => Store<any>)|string, dispatchName: string|null = null): any => {
	return (target: any, propertyKey: string) => {
		
		if (!dispatchName) {
			dispatchName = propertyKey;
		}
		
		Object.defineProperty(target, propertyKey, {
			value: function(value: any): any {
				if (typeof store === 'string') {
					return this.$store.dispatch((<string>store) + '/' + dispatchName, value);
				}
				return (<() => Store<any>> store)().dispatch(dispatchName as string, value);
			},
			configurable: true
		});
	};
};
