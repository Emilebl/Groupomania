<template>
    <div class="myprofile-component">
        <!-- <Header /> -->
        <div class="profile-infos-container">
            <h2 >Informations du profil</h2>
            <p class="profile-infos-element"><span class="profile-infos-span">Nom: </span>{{profileInfos.lastName}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">Prénom: </span>{{profileInfos.firstName}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">Photo de Profil: </span><img v-bind:src="profileInfos.profilePic" alt="" id="myProfileImage"></p>
            <p class="profile-infos-element"><span class="profile-infos-span">Bio: </span>{{profileInfos.bio}}</p>
            <p class="profile-infos-element"><span class="profile-infos-span">E-mail: </span>{{profileInfos.email}}</p>
        </div>
        <div class="form-container">
            <h2>Modifications du profil</h2>
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
                    {{ error }}
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// import Header from './Header';
export default {
    name: 'MyProfile',
    // components : {
    //     Header
    // },
    data () {
        return {
            profileInfos: '',
            firstName: '',
            lastName: '',
            bio: '',
            file: '',
            imgPreview: '',

            error: '',

            nameRGX: /^[a-zA-Z ]+$/,
            TextareaRGX: /^[\s\S]{0,100}$/
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.profileInfos = res.data;
        }, err => {
            console.log(err.response);
            this.$router.push('/login')
            this.error = err.response.data.error;
        })
    },
    methods: {
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        updateProfile() {
            let firstNameRESULT = this.nameRGX.test(this.firstName);
            let lastNameRESULT = this.nameRGX.test(this.lastName);
            let bioRESULT = this.TextareaRGX.test(this.bio);

            if (firstNameRESULT == false || lastNameRESULT == false) {
                this.error = 'Veuillez rentrer un nom/prénom valide'
            } else if (bioRESULT == false) {
                this.error = 'Veuillez rentrer une bio valide (100 charactères maximum)'
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
                    this.lastName = '';
                    this.firstName = '';
                    this.bio = '';
                    this.file = '';
                    this.imgPreview = '';
                    this.recallProfile()
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
                }
        },
        recallProfile() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
            }, err => {
                console.log(err.response);
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        }

    }
}
</script>

<style>

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
    /* border: green solid 1px; */
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

#modify-profile-pic {
    border: none;
}

.myprofile-component {
    width: 95%;
}
@media (max-width: 768px) {
    .profile-infos-element {
    /* border: green solid 1px; */
        width: 80%;
    }

    #myProfileImage {
        width:  150px;
        margin-left: 5%;
    }
}

</style>