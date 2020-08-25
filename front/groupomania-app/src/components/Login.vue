<template>
    <div>
        <form action="" @submit.prevent="login" class="form-example">
            <div class="form-example">
                <label for="email">Enter your email: </label>
                <input type="email" v-model="email" name="email" id="email" required>
            </div>
            <div class="form-example">
                <label for="password">Enter your password: </label>
                <input type="text" v-model="password" name="password" id="password" required>
            </div>
            <div class="form-example">
                <input type="submit" value="Se connecter !">
                {{ error }}
            </div>
        </form>
        <a v-bind:href="signupUrl">Pas encore de compte ?</a>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'Login',
    data () {
        return {
            email: '',
            password: '',
            signupUrl: '/signup',

            error: ''
        }
    },
    methods: {
        login() {
            let user = {
                email: this.email,
                password: this.password
            }
            axios.post('http://localhost:3000/api/users/login', user)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    localStorage.setItem('token', res.data.token);
                    this.$router.push('/');
                }
                // this.error= '';
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>