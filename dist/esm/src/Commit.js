export const Commit = (store, commitName = null) => {
    return (target, propertyKey) => {
        if (!commitName) {
            commitName = propertyKey;
        }
        Object.defineProperty(target, propertyKey, {
            value: function (value) {
                if (typeof store === 'string') {
                    return this.$store.dispatch(store + '/' + commitName, value);
                }
                return store().commit(commitName, value);
            },
            configurable: true
        });
    };
};
//# sourceMappingURL=Commit.js.map