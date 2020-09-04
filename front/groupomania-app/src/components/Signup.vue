<template>
    <div class="form-container">
        <h2 class="form-title">Inscription</h2>
        <form @submit.prevent="register" enctype="multipart/form-data" action="" id="form" class="validate">
            <div class="form-field">
                <label for="Prenom">Prénom</label>
                <input type="text" v-model="firstName" name="Prenom" id="Prenom" placeholder="votre prénom..." required />
            </div>
            <div class="form-field">
                <label for="Nom">Nom</label>
                <input type="text" v-model="lastName" name="Nom" id="Nom" placeholder="votre nom..." required />
            </div>
            <div class="form-field">
                <label for="email-input">Email</label>
                <input type="email" v-model="email" name="email-input" id="email-input" placeholder="example@domain.com" required />
            </div>
            <div class="form-field">
                <label for="password-input">Password</label>
                <input type="password" v-model="password" name="password-input" id="password-input" required />
            </div>
            <div class="form-field">
                <label for="bio">Bio</label>
                <textarea v-model="bio" name="bio" id="bio" placeholder="votre bio..." />
            </div>
            <div class="form-field">
                <label for="profilePic">Photo</label>
                <input type="file" ref="file" @change="selectFile" name="profilePic" id="profilePic">
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
        <!-- <form action="" @submit.prevent="register" enctype="multipart/form-data" class="form-class">
            <div class="form-class">
                <label for="Prénom"></label>
                <input type="text" v-model="firstName" name="Prénom" id="firstName" placeholder="Prénom" required>
            </div>
            <div class="form-class">
                <label for="Nom">Enter your last name: </label>
                <input type="text" v-model="lastName" name="Nom" id="lastName" placeholder="Nom" required>
            </div>
            <div class="form-class">
                <label for="email">Enter your email: </label>
                <input type="email" v-model="email" name="email" id="email" placeholder="Email" required>
            </div>
            <div class="form-class">
                <label for="password">Enter your password: </label>
                <input type="password" v-model="password" name="password" id="password" placeholder="Mot de Passe" required>
            </div>
            <div class="form-class">
                <label for="bio">Enter your bio: </label>
                <input type="text" v-model="bio" name="bio" placeholder="Bio" id="bio">
            </div>
            <div class="form-class">
                <label for="profilePic">Join your profile picture: </label>
                <input type="file" ref="file" @change="selectFile" name="profilePic" id="profilePic">
            </div>
            <div id="preview">
                <img v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="form-class">
                <input type="submit" value="S'inscrire !">
                {{ error }}
            </div>
        </form> -->
        <a id="signup-to-login" v-bind:href="loginUrl">Déjà un compte ?</a>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Signup',
    data () {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            bio: '',
            file: '',
            imgPreview: '',

            loginUrl: '/login',

            error: ''
        }
    },
    methods:{
        selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
        },
        register() {
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
        },
        // uploadImage(e){
        //     const image = e.target.files[0];
        //     const reader = new FileReader();
        //     reader.readAsDataURL(image);
        //     reader.onload = e =>{
        //         this.inputFile = e.target.result;
        //         console.log(this.inputFile);
        //     };
        // }
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