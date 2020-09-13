<template>
    <header>
        <router-link to="/"><img id="groupomania_logo" src="@/assets/icon-left-font-monochrome-white.svg" alt="groupomania-logo"></router-link>
        <nav v-show="alreadyConnected">
            <button class="header-button" id="mon_profil_button" @click="goToProfile"><font-awesome-icon :icon="['fas', 'user']" /> Mon Profil</button>
            <button class="header-button" id="logout_button" @click="logout"><font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Deconnexion</button>
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
        }
    }
}
</script>

<style>
header {
    background-color: #4287f5;
    width: 98%;
    padding: 1%;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
}

#groupomania_logo {
    width: 82%;
}

nav {
    width: 40%;
    height: auto;
    padding: 1%;
    display: flex;
    justify-content: space-between;
}

.header-button {
  background-color: #42f5b0;
  color: #7842f5;
  border: none;
  border-radius: 10px;
  padding: 15px 32px;
  width: 46%;
  height: 50%;
  font-size: 1.4em;
  cursor: pointer;
  
  text-align: center;
  text-decoration: none;
  display: inline-block;

}

@media (max-width: 1200px) {
  
  .header-button {
    font-size: 1.35em;
    padding: none;
  }
}


@media (max-width: 1024px) {
  nav {
    width: 50%;
    justify-content: flex-start
  }
    
  .header-button {
    font-size: 1.2em;
    padding: none;
  }

  #mon_profil_button {
      margin-right: 6%;
  }
}


@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: center;
    padding: none;
  }
  .header-button {
    font-size: 1.05em;
    width: 100%;
    height: 100%;
    padding: none;
  }

  #mon_profil_button {
      margin-bottom: 8px;
      margin-right: 0%;
  }

  #logout_button {
      margin-top: 8px;
  }
}

@media (max-width: 480px) {

    nav {
    width: 60%;
    }
    #groupomania_logo {
        width: 82%;
        margin-left: -12%;
    }
    .header-button {
    font-size: 0.8em;
    width: 100%;
    height: 100%;
    padding: 5px 15px;
    margin-top: 5px;
    }
}

</style>