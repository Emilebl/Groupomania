<template>
    <div>
        <form action="" @submit.prevent="register" enctype="multipart/form-data" class="form-example">
            <div class="form-example">
                <label for="firstName">Enter your first name: </label>
                <input type="text" v-model="firstName" name="firstName" id="firstName" required>
            </div>
            <div class="form-example">
                <label for="lastName">Enter your last name: </label>
                <input type="text" v-model="lastName" name="lastName" id="lastName" required>
            </div>
            <div class="form-example">
                <label for="email">Enter your email: </label>
                <input type="email" v-model="email" name="email" id="email" required>
            </div>
            <div class="form-example">
                <label for="password">Enter your password: </label>
                <input type="text" v-model="password" name="password" id="password" required>
            </div>
            <div class="form-example">
                <label for="bio">Enter your bio: </label>
                <input type="text" v-model="bio" name="bio" id="bio">
            </div>
            <div class="form-example">
                <label for="profilePic">Join your profile picture: </label>
                <input type="file" ref="file" @change="selectFile" name="profilePic" id="profilePic">
            </div>
            <div id="preview">
                <img v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="form-example">
                <input type="submit" value="S'inscrire !">
                {{ error }}
            </div>
        </form>
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

            error: ''
        }
    },
    methods:{
        selectFile() {
        this.file = this.$refs.file.files[0];
        this.imgPreview = URL.createObjectURL(this.file);
        },
        register() {
            const formData = new FormData();
            formData.append('email', this.email);
            formData.append('firstname', this.firstname);
            formData.append('lastname', this.lastname);
            formData.append('password', this.password);
            formData.append('bio', this.bio);
            formData.append('inputFile', this.file);
            console.log(formData)
            axios.post('http://localhost:3000/api/users/signup', formData, {headers: {'Content-Type': 'multipart/form-data'}})
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
form.form-example {
    display: table;
}

div.form-example {
    display: table-row;
}

label, input {
    display: table-cell;
    margin-bottom: 10px;
}

label {
    padding-right: 10px;
}
</style>