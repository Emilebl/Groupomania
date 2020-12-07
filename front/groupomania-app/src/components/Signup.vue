<template>
    <div class="form-container">
        <h1 class="form-title">Inscription</h1>
        <form @submit.prevent="register" enctype="multipart/form-data" action="" id="form" class="validate">
            <div class="form-field">
                <label for="Prenom">Prénom</label>
                <input type="text" v-model="firstName" name="Prenom" id="prenom-signup" required />
            </div>
            <div class="form-field">
                <label for="Nom">Nom</label>
                <input type="text" v-model="lastName" name="Nom" id="nom-signup" required />
            </div>
            <div class="form-field">
                <label for="email">Email</label>
                <input type="email" v-model="email" name="email" id="email-signup" required />
            </div>
            <div class="form-field">
                <label for="mot-de-passe">Mot de passe</label>
                <input type="password" v-model="password" name="mot-de-passe" id="password-signup" placeholder="6-20 Car, au moins 1 maj, 1 min et 1 num" required />
            </div>
            <div class="form-field">
                <label for="mot-de-passe">Confirmation mot de passe</label>
                <input type="password" v-model="passwordConf" name="mot-de-passe-confirmation" id="passwordConf-signup" placeholder="6-20 Car, au moins 1 maj, 1 min et 1 num" required />
            </div>
            <div class="form-field">
                <label for="bio">Bio (facultatif)</label>
                <textarea v-model="bio" name="bio" id="bio-signup"/>
            </div>
            <div class="form-field">
                <label for="photo-de-profil">Photo (facultatif)</label>
                <input type="file" ref="file" @change="selectFile" name="photo-de-profil" id="profilePic">
            </div>
            <div class="form-field" id="signup-preview-container">
                <label v-if="imgPreview" for="aperçu-photo">Aperçu de votre photo:</label>
                <img id="signup-preview" v-if="imgPreview" :src="imgPreview" alt="aperçu-de-la-photo-de-profil" />
            </div>
            <div class="submit-button-container">
                <input type="submit" class="submit-button" value="S'inscrire !" />
            </div>
           <div class="error-message-container">
            <p class="signup-error-msg">{{ signupErrorMsg }}</p>
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
            passwordConf: '',
            bio: '',
            file: '',
            imgPreview: '',

            loginUrl: '/login',

            signupErrorMsg: '',

            // Regex for the inputs
            nameRGX: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ- ']{1,30}$/,
            emailRGX: /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/,
            passwordRGX: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/,
            bioRGX: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100})?$/
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
            // let passwordConfRESULT = this.passwordRGX.test(this.passwordConf);
            let bioRESULT = this.bioRGX.test(this.bio);

            if (firstNameRESULT == false || lastNameRESULT == false) {
                this.signupErrorMsg = 'Veuillez rentrer un nom/prénom valide'
            } else if (emailRESULT == false) {
                this.signupErrorMsg = 'Veuillez rentrer un mail valide'
            } else if (passwordRESULT == false) {
                this.signupErrorMsg = 'Veuillez rentrer un mot de passe valide: entre 6 et 20 caractères, au moins 1 majuscule, 1 minuscule et 1 chiffre'
            // } else if (passwordConfRESULT == false) {
            //     this.signupErrorMsg = 'Veuillez rentrer un mot de passe valide: entre 6 et 20 caractères, au moins 1 majuscule, 1 minuscule et 1 chiffre'
            } else if (this.passwordConf != this.password) {
                this.signupErrorMsg = 'Veuillez confirmer correctement le mot de passe'
            } else if (bioRESULT == false) {
                this.signupErrorMsg = 'Veuillez rentrer une bio valide (100 charactères maximum, certains caractères spéciaux sont interdits)'
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
                    this.signupErrorMsg= '';
                    this.$router.push('/login');
                }, err => {
                    console.log(err.response);
                    this.signupErrorMsg = err.response.data.error;
                })
            }
        }
    }
}
</script>

<style>
#profilePic {
    border: none;
    cursor: pointer;
    color: transparent;
}
#profilePic:focus {
    outline: none;
    box-shadow: none;
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

.error-message-container{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.signup-error-msg {
    width: 50%;
}


#signup-to-login {
    background-color: #4287f5;
    color: #FFFFFF;
    border: none;
    border-radius: 3px;
    padding: 3%;
    margin-top: 5%;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 1.5px 1px 3px grey;
    text-decoration: none;
    margin-bottom: 5%;

    transition: all 0.1s ease;
}

#signup-to-login:hover {
    transform: scale(1.05);
}

</style>