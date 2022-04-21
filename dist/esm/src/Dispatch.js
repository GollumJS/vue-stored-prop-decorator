export const Dispatch = (store, dispatchName = null) => {
    return (target, propertyKey) => {
        if (!dispatchName) {
            dispatchName = propertyKey;
        }
        Object.defineProperty(target, propertyKey, {
            value: function (value) {
                if (typeof store === 'string') {
                    return this.$store.dispatch(store + '/' + dispatchName, value);
                }
                return store().dispatch(dispatchName, value);
            },
            configurable: true
        });
    };
};
//# sourceMappingURL=Dispatch.js.map