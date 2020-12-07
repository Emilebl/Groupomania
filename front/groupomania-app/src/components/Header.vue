<template>
    <header>
        <router-link to="/" @click="scrollToTop"><img id="groupomania_logo" src="@/assets/icon-left-font-monochrome-white.svg" alt="groupomania-logo"></router-link>
        <nav v-show="alreadyConnected">
            <button class="header-button" id="mon_profil_button" @click="goToProfile"><font-awesome-icon :icon="['fas', 'user']" /></button>
            <button class="header-button" id="logout_button" @click="logout"><font-awesome-icon :icon="['fas', 'sign-out-alt']" /></button>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'Header',
    computed: {
      // Computed property that returns 'true' or 'false' depending on which page the app is on
      // if the url is "/signup" of "/login", it will return 'false' and the <nav> will not show
      // if the url is something else, it will return true and the <nav> will show
      // (see "v-show" on the <nav> tag in html)
      alreadyConnected() {
        if(this.$route.path == "/signup" || this.$route.path == "/login" ) {
        return false
        } else {
        return true
        }
      }
    },
    methods: {
        // Function that logs out the user by clearing the localstorage
        // and redirecting the user to the /login page
        logout() {
          localStorage.clear();
          this.$router.push('/login');
        },
        // Redirects the user to the /me page
        goToProfile() {
          this.$router.push('/me');
        },
        scrollToTop() {
          window.scrollTo(0,0);
        }
    }
}
</script>

<style>
header {
  position: sticky;
  top: 0;
  z-index:200;
  background-color: #4287f5;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
}

#groupomania_logo {
  margin-left: 5%;
  width: 55%;
  transition: all 0.2s ease;
  margin-top: 1%;
  margin-bottom: 1%;
}
#groupomania_logo:hover {
transform: scale(1.05);
}
nav {
  width: 10%;
  height: auto;
  padding: 1%;
  display: flex;
  justify-content: space-between;
}

.header-button {
  background-color: #4287f5;
  color:#FFFFFF;
  border: none;
  border-radius: 10%;
  padding: 5%;
  width: auto;
  height: auto;
  font-size: 1.3em;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;

  transition: all 0.2s ease;
}
.header-button:focus {
  outline: none;
  box-shadow: none;
}
.header-button:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  header {
    padding: 1%;
  }
  nav {
  width: 15%;
  }
} 

@media (max-width: 480px) {

  nav {
  width: 26%;
  }

  #groupomania_logo {
  width: 65%;
  }
} 

</style>