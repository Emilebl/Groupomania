<template>
    <div class="myprofile-component">
        <!-- This section displays the profile informations about the currently connected user -->
        <section class="profile-infos-container">
            <h1 >Informations du profil</h1>
            <div class="profile-infos-div">
                <p class="profile-infos-element"><span class="profile-infos-span">Prénom: </span>{{profileInfos.firstName}}</p>
                <p class="profile-infos-element"><span class="profile-infos-span">Nom: </span>{{profileInfos.lastName}}</p>
                <p class="profile-infos-element"><span class="profile-infos-span">Bio: </span>{{profileInfos.bio}}</p>
                <p class="profile-infos-element"><span class="profile-infos-span">E-mail: </span>{{profileInfos.email}}</p>
                <p class="profile-infos-element" id="myprofile-pic-element"><span class="profile-infos-span">Photo de Profil: </span>
                <img v-bind:src="profileInfos.profilePic" alt="" id="myProfileImage"></p>
            </div>
        </section>
        <!-- This section contains a form to modify infos on the profile -->
        <section class="form-container">
            <h1 class="modify-profile-title">Modifications du profil</h1>
            <form @submit.prevent="updateProfile" enctype="multipart/form-data" id="form" class="validate">
                <div class="form-field">
                    <label for="Prenom">Prénom</label>
                    <input type="text" v-model="firstName" name="Prenom" id="firstName">
                </div>
                <div class="form-field">
                    <label for="Nom">Nom</label>
                    <input type="text" v-model="lastName" name="Nom" id="lastName">
                </div>
                <div class="form-field">
                    <label for="bio">Bio</label>
                    <textarea v-model="bio" name="bio" id="bio" />
                </div>
                <div class="form-field">
                    <label for="photo-de-profil">Photo</label>
                    <input type="file" ref="file" @change="selectFile" name="photo-de-profil" id="modify-profile-pic">
                </div>
                <div class="form-field" id="post-preview-container">
                    <label v-if="imgPreview" for="aperçu-photo">Aperçu de l'image:</label>
                    <img id="post-preview" v-if="imgPreview" :src="imgPreview" alt="aperçu-de-la-photo-de-profil" />
                </div>
                <div class="submit-button-container">
                    <input type="submit" class="submit-button" value="Modifier !">
                    <!-- This button deletes the profile when clicked -->
                    <button class="delete-profile-button" @click="deleteProfile">Supprimer</button>
                </div>
                <div class="error-message-container">
                    <p class="modify-profile-error-msg">{{ modifyProfileErrorMsg }}</p>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'MyProfile',
    data () {
        return {
            // These datas will reflect what is written in the form inputs, using v-model
            profileInfos: '',
            firstName: '',
            lastName: '',
            bio: '',
            file: '',
            imgPreview: '',

            modifyProfileErrorMsg: '',
            deleteProfileErrorMsg: '',

            // REGEX for the name inputs, and the bio input
            nameRGX: /^([a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ- ']{1,30})?$/,
            TextareaRGX: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100})?$/
        }
    },
    // When this component is created, the app will redirect to the /login page if the localstorage has no token
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    // When mounted, it will call the backend to get the profile informations of the connected user
    mounted() {
        axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.profileInfos = res.data;
            if (this.profileInfos.profilePic === null) {
                this.profileInfos.profilePic = require("@/assets/default-profile-pic.png")
            }
        }, err => {
            console.log(err.response);
            // if the response is an error (token expired), we are redirected to the login page
            this.$router.push('/login')
            this.error = err.response.data.error;
        })
    },
    methods: {
        // Method that shows a preview image when a file is selected
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Method that sends the form informations to the backend to modify the profile
        updateProfile() {
            let firstNameRESULT = this.nameRGX.test(this.firstName);
            let lastNameRESULT = this.nameRGX.test(this.lastName);
            let bioRESULT = this.TextareaRGX.test(this.bio);

            if (firstNameRESULT == false || lastNameRESULT == false) {
                this.modifyProfileErrorMsg = 'Veuillez rentrer un nom/prénom valide (30 caractères max)'
            } else if (bioRESULT == false) {
                this.modifyProfileErrorMsg = 'Veuillez rentrer une bio valide (100 charactères maximum, certains caractères spéciaux sont interdits)'
            } else {
                const formData = new FormData();
                formData.append('lastName', this.lastName);
                formData.append('firstName', this.firstName);
                formData.append('bio', this.bio);
                formData.append('inputFile', this.file);
                console.log(formData);
                axios.put('http://localhost:3000/api/users/update', formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    console.log(res);
                    this.modifyProfileErrorMsg = '',
                    this.lastName = '';
                    this.firstName = '';
                    this.bio = '';
                    this.file = '';
                    this.imgPreview = '';
                    this.recallProfile()
                }, err => {
                    console.log(err.response);
                    this.modifyProfileErrorMsg = err.response.data.error;
                })
                }
        },
        // Method that makes a new axios call to get the profile infos
        recallProfile() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                window.scrollTo(0,0);
                console.log(res);
                this.profileInfos = res.data;
                if (this.profileInfos.profilePic === null) {
                    this.profileInfos.profilePic = require("@/assets/default-profile-pic.png")
                }
            }, err => {
                console.log(err.response);
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        },
        // Method that makes a axios request to delete the profile
        deleteProfile() {
            axios.delete('http://localhost:3000/api/users/delete', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            localStorage.clear();
            this.$router.push('/signup')
            }, err => {
                console.log(err.response);
                this.deleteProfileErrorMsg = err.response.data.error;
            })
        }
    }
}
</script>

<style>
.delete-profile-button {
    background-color: #c00000;
    color: #FFFFFF;
    border: none;
    border-radius: 3px;
    padding: 2%;
    margin: auto;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 1.5px 1px 3px grey;
}

.profile-infos-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3%;
}

.profile-infos-container h1 {
    margin-bottom: 3%;
}

.profile-infos-div {
    background-color: #FFFFFF;
    border-radius: 2%;
    width: 100%;
    height: auto;
    padding: 5%;
}


.profile-infos-element {
    min-width: 30%;
    margin-top: 3%;
}

.profile-infos-span {
    font-weight: bolder;
}

#myProfileImage {
   width:  200px;
   height: 200px;
   object-fit: cover;
   border-radius: 50%;
   margin-top: 3%;
   margin-left: auto;
   margin-right: auto;
}

#myprofile-pic-element {
    display: flex;
    flex-direction: column;
}

.modify-profile-title {
    margin-bottom: 3%;
}

#modify-profile-pic {
    border: none;
    color: transparent;
}

.myprofile-component {
    display: flex;
    justify-content: space-around;
    width: 95%;
}

.error-message-container{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.modify-profile-error-msg {
    margin-top: 5%;
    width: 50%;
}

@media (max-width: 768px) {
    .myprofile-component {
        flex-direction: column;
        margin-bottom: 4%;
    }

    .profile-infos-div {
        width: 80%;
        margin-bottom: 5%;
    }

    #myProfileImage {
        width:  150px;
        height: 150px;
    }
}

</style>