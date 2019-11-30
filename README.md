# Stored typescript decorator for vuex component 

[![Build Status](https://travis-ci.org/GollumJS/vue-stored-prop-decorator.svg?branch=master)](https://travis-ci.org/GollumJS/vue-stored-prop-decorator)
[![Licence](https://img.shields.io/npm/l/vue-stored-prop-decorator.svg?colorB=4B9081)](https://github.com/GollumJS/vue-stored-prop-decorator/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/vue-stored-prop-decorator.svg)](https://www.npmjs.com/package/vue-stored-prop-decorator)

Add @Stored property annotation for vuex in Typscript mode.
Replace property by setter and getter on store.

## Install:

```
npm install --save vue-stored-prop-decorator
```

## Exemple:

```typescript
	import {Component, Vue} from 'vue-property-decorator';
	import {Stored} from 'vue-stored-prop-decorator';
	import {User} from './models/user';
	import userStore from './stores/user';
	
	@Component
	export default class MyComponent extends Vue {
		
		
		@Stored(() => userStore)
		me: User;
		
		// Property `me` become after decorator : 
		// get me(): User {
		// 	return userStore.state.me;	
		// }
		// set me(value: User) {
		// 	userStore.commit('setMe', value);	
		// }
		
		@Stored(() => userStore, 'me')
		customPropName: User;
		
		// Property `customPropName` become after decorator : 
		// get customPropName(): User {
		// 	return userStore.state.me;	
		// }
		// set customPropName(value: User) {
		// 	userStore.commit('setMe', value);	
		// }
	}

```
