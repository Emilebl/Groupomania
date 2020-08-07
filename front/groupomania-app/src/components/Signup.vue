<template>
    <div>
        <form action="" @submit.prevent="register" class="form-example">
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
                <input type="file" @change="uploadImage" name="profilePic" id="profilePic">
            </div>
            <div class="form-example">
                <input type="submit" value="S'inscrire !">
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
            inputFile: null
        }
    },
    methods:{
        register() {
            let newUser = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                bio: this.bio,
                inputFile: this.inputFile
            }
            console.log(newUser)
            axios.post('http://localhost:3000/api/users/signup', newUser)
            .then(res => {
                console.log(res)
            }, err => {
                console.log(err.response)
            })
        },
        uploadImage(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e =>{
                this.inputFile = e.target.result;
                console.log(this.inputFile);
            };
        }
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