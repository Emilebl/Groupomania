<template>
    <div class="form-container">
        <h1 class="form-title">Inscription</h1>
        <form @submit.prevent="register" enctype="multipart/form-data" action="" id="form" class="validate">
            <div class="form-field">
                <label for="Prenom">Prénom</label>
                <input type="text" v-model="firstName" name="Prenom" id="prenom-signup" placeholder="votre prénom..." required />
            </div>
            <div class="form-field">
                <label for="Nom">Nom</label>
                <input type="text" v-model="lastName" name="Nom" id="nom-signup" placeholder="votre nom..." required />
            </div>
            <div class="form-field">
                <label for="email-input">Email</label>
                <input type="email" v-model="email" name="email-input" id="email-signup" placeholder="example@domain.com" required />
            </div>
            <div class="form-field">
                <label for="password-input">Password</label>
                <input type="password" v-model="password" name="password-input" id="password-signup" required />
            </div>
            <div class="form-field">
                <label for="bio">Bio</label>
                <textarea v-model="bio" name="bio" id="bio-signup" placeholder="votre bio..." />
            </div>
            <div class="form-field">
                <label for="profilePic">Photo</label>
                <input type="file" ref="file" @change="selectFile" name="profilePic" id="profilePic" required>
            </div>
            <div class="form-field" id="signup-preview-container">
                <label v-if="imgPreview" for="preview">Aperçu de votre photo:</label>
                <img id="signup-preview" v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="form-field" id="signup-button-container">
                <input type="submit" value="S'inscrire !" />
                {{ error }}
            </div>
        </form>
        <a id="signup-to-login" v-bind:href="loginUrl">Déjà un compte ?</a>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Signup',
    data () {
        return {
            // Data to catch what the user will write in the form inputs, using v-model
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            bio: '',
            file: '',
            imgPreview: '',

            loginUrl: '/login',

            error: '',

            // Regex for the inputs
            nameRGX: /^[a-zA-ZÀ-ÿ ]+$/,
            emailRGX: /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/,
            passwordRGX: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/,
            TextareaRGX: /^[\s\S]{0,100}$/
        }
    },
    methods:{
        // Method that shows a preview image when a file is selected
        selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
        },
        // Method that sends the form infos to the backend to create a new user, and redirects to /login page
        register() {
            let firstNameRESULT = this.nameRGX.test(this.firstName);
            let lastNameRESULT = this.nameRGX.test(this.lastName);
            let emailRESULT = this.emailRGX.test(this.email);
            let passwordRESULT = this.passwordRGX.test(this.password);
            let bioRESULT = this.TextareaRGX.test(this.bio);

            if (firstNameRESULT == false || lastNameRESULT == false) {
                this.error = 'Veuillez rentrer un nom/prénom valide'
            } else if (emailRESULT == false) {
                this.error = 'Veuillez rentrer un mail valide'
            } else if (passwordRESULT == false) {
                this.error = 'Veuillez rentrer un mot de passe valide: entre 6 et 20 caractères, au moins 1 majuscule, 1 minuscule et 1 chiffre'
            } else if (bioRESULT == false) {
                this.error = 'Veuillez rentrer une bio valide (100 charactères maximum)'
            } else {
                const userInfos = new FormData();
                userInfos.append('email', this.email);
                userInfos.append('firstName', this.firstName);
                userInfos.append('lastName', this.lastName);
                userInfos.append('password', this.password);
                userInfos.append('bio', this.bio);
                userInfos.append('inputFile', this.file);
                console.log(userInfos)
                axios.post('http://localhost:3000/api/users/signup', userInfos, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    console.log(res);
                    this.error= '';
                    this.$router.push('/login');
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
#profilePic {
    border: none;
}

#signup-preview {
   width:  200px;
   height: 200px;
   object-fit: cover;
   border-radius: 50%;
   margin-left: auto;
   margin-right: auto;
}

#signup-button-container {
    display: flex;
    justify-content: center;
}


#signup-to-login {
    background-color: #42f5b0; /* Green */
    color: #7842f5;
    border: none;
    text-decoration: none;
    font-weight: bolder;
    border-radius: 10px;
    padding: 15px 32px;
    margin-top: 3%;
}
</style>