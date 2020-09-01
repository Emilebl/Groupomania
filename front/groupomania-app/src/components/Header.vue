<template>
    <header>
        <h1><router-link to="/"><img id="groupomania_logo" src="@/assets/icon-left-font-monochrome-white.svg" alt="groupomania-logo"></router-link></h1>
        <nav>
            <button class="header-button" id="mon_profil_button" @click="goToProfile"><font-awesome-icon :icon="['fas', 'user']" /> Mon Profil</button>
            <button class="header-button" id="logout_button" @click="logout"><font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Logout</button>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'Header',
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push('/login');
        },
        goToProfile() {
            this.$router.push('/me');
        }
    }
}
</script>

<style>
header {
    background-color: #4287f5;
    width: 100%;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
}

#groupomania_logo {
    width: 80%;
}

/* #mon_profil_button {
    text-decoration: none;
    color: white;
    padding: 10px;
    border: 2px solid white;
    border-radius: 10px;
} */

.header-button {
  background-color: #42f5b0; /* Green */
  color: #7842f5;
  border: none;
  border-radius: 10px;
  padding: 15px 32px;
  margin-right: 10px;
  height: 100%;
  font-size: 1.5em;
  cursor: pointer;
  

  text-align: center;
  text-decoration: none;
  display: inline-block;

}



</style>