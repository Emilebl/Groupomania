import Vue from 'vue';
import App from './App.vue';

// Import Fort Awesome icons library
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faSignOutAlt, faUserEdit, faComment, faComments, faPlusCircle, faSignInAlt, faUserPlus, faMinusCircle, faTrash, faTrashAlt, faPenSquare, faEdit, faThumbsUp, faThumbsDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import vue router
import VueRouter from 'vue-router';

// Import components
import Wall from './components/Wall.vue';
import Signup from './components/Signup.vue';
import Login from './components/Login.vue';
import MyProfile from './components/MyProfile.vue';
import SinglePost from './components/SinglePost.vue'

// Add chosen icons to the library
library.add(faUser, faSignOutAlt, faUserEdit, faComment, faComments, faPlusCircle, faSignInAlt, faUserPlus, faMinusCircle, faTrash, faTrashAlt, faPenSquare, faEdit, faThumbsUp, faThumbsDown )

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(VueRouter);

// Define routes for each component
const routes = [
  {path: '/', component: Wall},
  {path: '/signup', component: Signup},
  {path: '/login', component: Login},
  {path: '/me', component: MyProfile},
  {path: '/post/:id', component: SinglePost},

]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return {x: 0, y: 0}
  }
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
