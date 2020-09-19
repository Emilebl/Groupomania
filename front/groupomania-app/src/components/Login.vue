<template>
    <div class="form-container">
        <h1 class="form-title">Connexion</h1>
        <form action="" @submit.prevent="login" id="form" class="validate">
            <div class="form-field">
                <label for="email">Email</label>
                <input type="email" v-model="email" name="email" id="email" required>
            </div>
            <div class="form-field">
                <label for="password">Mot de passe</label>
                <input type="password" v-model="password" name="password" id="password" required>
            </div>
            <div class="form-field" id="login-button-container">
                <input type="submit" value="Se connecter !">
            </div>
            <div class="error-message-container">
                <p class="login-error-msg">{{ loginErrorMsg }}</p>
            </div>
        </form>
        <a id="signup-to-login" v-bind:href="signupUrl">Pas encore de compte ?</a>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'Login',
    data () {
        return {
            // Data to catch what the user will write in the form inputs, using v-model
            email: '',
            password: '',
            signupUrl: '/signup',

            loginErrorMsg: '',
            
            // Regex for the inputs
            emailRGX: /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/,
            passwordRGX: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/
        }
    },
    methods: {
        // Function that sends the form infos to the backend to Login the user
        // and that sets the given token to the localstorage
        login() {
            let emailRESULT = this.emailRGX.test(this.email);
            let passwordRESULT = this.passwordRGX.test(this.password);

            if (emailRESULT == false) {
                this.loginErrorMsg = 'Email invalide'
            } else if (passwordRESULT == false) {
                this.loginErrorMsg = 'Mot de passe invalide'
            } else {
                    let user = {
                    email: this.email,
                    password: this.password
                }
                axios.post('http://localhost:3000/api/users/login', user)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.loginErrorMsg = ''
                        localStorage.setItem('token', res.data.token);
                        this.$router.push('/');
                    }
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        }
    }
}
</script>

<style>
#login-button-container {
    display: flex;
    justify-content: center;
}

.error-message-container{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.login-error-msg {
    width: 50%;
}
</style>