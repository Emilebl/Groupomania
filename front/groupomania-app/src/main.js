import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Wall from './components/Wall.vue';
import Signup from './components/Signup.vue';
import Login from './components/Login.vue';
import MyProfile from './components/MyProfile.vue';
import SinglePost from './components/SinglePost.vue'

Vue.config.productionTip = false

Vue.use(VueRouter);

const routes = [
  {path: '/', component: Wall},
  {path: '/signup', component: Signup},
  {path: '/login', component: Login},
  {path: '/me', component: MyProfile},
  {path: '/post/:id', component: SinglePost},

]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
