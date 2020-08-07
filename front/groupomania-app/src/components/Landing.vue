<template>
    <div>
        <button @click="logout">Logout</button>
    </div>
</template>
<script>
export default {
    name: 'Landing',
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {

    },
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>