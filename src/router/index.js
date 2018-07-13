import Vue from 'vue';
import Router from 'vue-router';
import Index from '../page/Index';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/visualizations.fractal',
      name: 'Index',
      component: Index,
    },
  ],
});
