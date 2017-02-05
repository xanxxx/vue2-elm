// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Goods from './components/goods/goods';
import Ratings from './components/ratings/ratings';
import Seller from './components/seller/seller';

import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

let router = new VueRouter({
	linkActiveClass: 'active',
	mode: 'history',
	routes: [
		{ path: '/', redirect: { name: 'goods' } },
		{ name: 'goods', path: '/goods', component: Goods },
		{ name: 'ratings', path: '/ratings', component: Ratings },
		{ name: 'seller', path: '/seller', component: Seller }
	]
});
// router.beforeEach((to, from, next) => {
//     console.log(from.path);
//     window.history.replaceState({}, '', 'goods');
//     next();
// });

// router.push({ name: 'goods' });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
});
