import Vue from 'vue';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faSignOutAlt, faUserEdit, faComment, faComments, faPlusCircle, faSignInAlt, faUserPlus, faMinusCircle, faTrash, faTrashAlt, faPenSquare, faEdit, faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueRouter from 'vue-router';
import Wall from './components/Wall.vue';
import Signup from './components/Signup.vue';
import Login from './components/Login.vue';
import MyProfile from './components/MyProfile.vue';
import SinglePost from './components/SinglePost.vue'

library.add(faUser, faSignOutAlt, faUserEdit, faComment, faComments, faPlusCircle, faSignInAlt, faUserPlus, faMinusCircle, faTrash, faTrashAlt, faPenSquare, faEdit, faThumbsUp, faThumbsDown )

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
