import { Store } from 'vuex';

export const Commit = (store: (() => Store<any>)|string, commitName: string = null): any => {
	return (target: any, propertyKey: string) => {

		if (!commitName) {
			commitName = propertyKey;
		}
		
		Object.defineProperty(target, propertyKey, {
			value: function(value: any): any {
				if (typeof store === 'string') {
					return this.$store.dispatch((<string>store) + '/' + commitName, value);
				}
				return (<() => Store<any>> store)().commit(commitName, value);
			},
			configurable: true
		});
	};
};
