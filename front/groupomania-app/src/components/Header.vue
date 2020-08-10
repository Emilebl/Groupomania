<template>
    <header>
        <h1><router-link to="/">GROUPOMANIA</router-link></h1>
        <h2><router-link to="/me">Mon Profil</router-link></h2>
        <button @click="logout">Logout</button>
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
    border: 3px solid red;
    display: flex;
    justify-content: space-between;
}

</style>