<template>
    <div class="myprofile-component">
        <!-- This section displays the profile informations about the currently connected user -->
        <section class="profile-infos-container">
            <h1 >Informations du profil</h1>
            <p class="profile-infos-element"><span class="profile-infos-span">Nom: </span>{{profileInfos.lastName}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">Prénom: </span>{{profileInfos.firstName}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">Photo de Profil: </span><img v-bind:src="profileInfos.profilePic" alt="" id="myProfileImage"></p>
            <p class="profile-infos-element"><span class="profile-infos-span">Bio: </span>{{profileInfos.bio}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">E-mail: </span>{{profileInfos.email}}</p>
        </section>
        <!-- This section contains a form to modify infos on the profile -->
        <section class="form-container">
            <h1 class="modify-profile-title">Modifications du profil</h1>
            <form @submit.prevent="updateProfile" enctype="multipart/form-data" id="form" class="validate">
                <div class="form-field">
                    <label for="firstName">Nouveau Prénom</label>
                    <input type="text" v-model="firstName" name="firstName" id="firstName">
                </div>
                <div class="form-field">
                    <label for="lastName">Nouveau Nom de famille</label>
                    <input type="text" v-model="lastName" name="lastName" id="lastName">
                </div>
                <div class="form-field">
                    <label for="bio">Nouvelle Bio</label>
                    <textarea v-model="bio" name="bio" id="bio" />
                </div>
                <div class="form-field">
                    <label for="attachement">Nouvelle photo de profil </label>
                    <input type="file" ref="file" @change="selectFile" name="attachement" id="modify-profile-pic">
                </div>
                <div class="form-field" id="post-preview-container">
                    <label v-if="imgPreview" for="preview">Aperçu de l'image:</label>
                    <img id="post-preview" v-if="imgPreview" :src="imgPreview" />
                </div>
                <div class="form-example">
                    <input type="submit" value="Modifier le profil !">
                </div>
                <div class="error-message-container">
                    <p class="modify-profile-error-msg">{{ modifyProfileErrorMsg }}</p>
                </div>
                <!-- This button deletes the profile when clicked -->
                <button class="delete-profile-button" @click="deleteProfile">Supprimer le Profil</button>
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
    color: white;
    border: none;
    border-radius: 10px;
    padding: 2%;
    margin-top: 10%;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bolder;
    cursor: pointer;
}

.profile-infos-container {
    border: solid 0.5px grey;
    background-color: #e5eef7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3%;
    padding-top: 3%;
    padding-bottom: 3%;
}
.profile-infos-element {
    min-width: 30%;
    margin-top: 1%;
    display: flex;
    justify-content: space-between;
}

.profile-infos-span {
    font-weight: bolder;
}

#myProfileImage {
   width:  200px;
   height: auto;
   object-fit: cover;
   border-radius: 2%;
   margin-left: auto;
   margin-right: auto;
}

.modify-profile-title {
    margin-bottom: 3%;
}

#modify-profile-pic {
    border: none;
}

.myprofile-component {
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
    .profile-infos-element {
        width: 80%;
    }

    #myProfileImage {
        width:  150px;
        margin-left: 5%;
    }
}

</style>