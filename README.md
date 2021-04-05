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

## Stored Example:

```typescript
	import {Component, Vue} from 'vue-property-decorator';
	import {Stored} from 'vue-stored-prop-decorator';
	import {User} from './models/user';
	import userStore from './stores/user';
	
	@Component
	export default class MyComponent extends Vue {
		
		
		@Stored(() => userStore)
		me: User;
		
		// Property `me` become after decoration : 
		// get me(): User {
		// 	return userStore.state.me;	
		// }
		// set me(value: User) {
		// 	userStore.commit('setMe', value);	
		// }
		
		@Stored(() => userStore, { propName: 'me' })
		customPropName: User;
		
		// Property `customPropName` become after decoration : 
		// get customPropName(): User {
		// 	return userStore.state.me;	
		// }
		// set customPropName(value: User) {
		// 	userStore.commit('setMe', value);	
		// }
		
		@Stored(() => userStore, {
			propName: 'me',
			commitName: 'setMyMe',
		})
		customPropName2: User;
		
		// Property `customPropName` become after decoration : 
		// get customPropName(): User {
		// 	return userStore.state.me;	
		// }
		// set customPropName(value: User) {
		// 	userStore.commit('setMyMe', value);	
		// }
		
		@Stored('user', { propName: 'me' })
		meString: User;
		
		// Property `meString` become after decoration : 
		// get me(): User {
		// 	return this.$store.state.user.me;	
		// }
		// set me(value: User) {
		// 	userStore.commit('user/setMe', value);	
		// }

		@Stored('user', {
			propName: 'me',
			proxy: true
		})
		meProxy: User;

		
		public editUser() {
			
			this.meString = new User();
			
			// So real execute is:
			// this.$store.commit('user/setMe', new User());

			 
			this.meProxy.firstName = 'Bender';
			
			// So real execute is:
			// If User object has clone method 
			// and if you edit property of user
			//
			// const copy = user.clone()
			// copy.firstName = 'Bender';
			// this.$store.commit('user/setMe', copy);
		}
	}

```

## Commit and Dispatch Example:

```typescript
	import {Component, Vue} from 'vue-property-decorator';
	import {Commit, Dispatch} from 'vue-stored-prop-decorator';
	import {User} from './models/user';
	import userStore from './stores/user';
	
	@Component
	export default class MyComponent extends Vue {
		
		@Commit(() => userStore)
		setUser: (user: User) => void;
		
		// Property `setUser` become after decoration :
		// setUser(user: User): void {
		//	 return userStore.commit('setUser', user);
		// }


		@Commit('user', 'setUser')
		setUserString: (user: User) => void;
		
		// Property `setUserString` become after decoration :
		// setUser(user: User): void {
		//	 return this.$store.commit('user/setUser', user);
		// }
		
		@Dispatch(() => userStore)
		findById: (id: number) => Promise<User>;
		
		// Property `findById` become after decoration :
		// findById(id: number): void {
		//	 return userStore.dispatch('findById', user);
		// }

		@Dispatch('user', 'findById')
		findByIdString: (id: number) => Promise<User>;
		
		// Property `findByIdString` become after decoration :
		// findByIdString(id: number): void {
		//	 return this.$store.dispatch('user/findByIdString', id);
		// }
		
	}
```
