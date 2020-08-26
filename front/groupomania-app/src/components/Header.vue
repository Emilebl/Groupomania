<template>
    <header>
        <h1><router-link to="/"><img id="groupomania_logo" src="@/assets/icon-left-font-monochrome-white.svg" alt="groupomania-logo"></router-link></h1>
        <h2><router-link to="/me" id="mon_profil_link">Mon Profil</router-link></h2>
        <button id="logout_button" @click="logout">Logout</button>
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

#mon_profil_link {
    text-decoration: none;
}

#logout_button {
  background-color: #42f5b0; /* Green */
  border: none;
  border-radius: 5px;
  color: #7842f5;
  padding: 15px 32px;
  margin-right: 10px;
  height: 100%;

  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

</style>