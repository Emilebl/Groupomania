<template>
    <div>
        <Header />
        <div>
            <h1>{{profileInfos.firstName}} {{profileInfos.lastName}}</h1>
            <img v-bind:src="profileInfos.profilePic" alt="" id="myProfileImage">
            <p>{{profileInfos.bio}}</p>
            <p>{{profileInfos.email}}</p>
        </div>
        <div>
            <form @submit.prevent="updateProfile" enctype="multipart/form-data" class="form-example">
                <div>
                    <label for="firstName">Nouveau Prénom</label>
                    <input type="text" v-model="firstName" name="firstName" id="firstName">
                </div>
                <div>
                    <label for="lastName">Nouveau Nom de famille</label>
                    <input type="text" v-model="lastName" name="lastName" id="lastName">
                </div>
                <div>
                    <label for="bio">Nouvelle Bio</label>
                    <input type="text" v-model="bio" name="bio" id="bio">
                </div>
                <div>
                    <label for="attachement">Nouvelle photo de profil </label>
                    <input type="file" ref="file" @change="selectFile" name="attachement" id="attachement">
                </div>
                <div id="preview">
                    <img v-if="imgPreview" :src="imgPreview" />
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
import Header from './Header';
export default {
    name: 'MyProfile',
    components : {
        Header
    },
    data () {
        return {
            profileInfos: '',
            firstName: '',
            lastName: '',
            bio: '',
            file: '',
            imgPreview: '',

            error: ''
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
.post-image {
    max-width: 500px;
}

#preview {
    height: 50px;
    width: 50px;
}

</style>