<template>
    <div class="add-post-form">
        <div>
            <img v-bind:src="profilePicUrl" class="add-post-user-pp" alt="user-photo-de-profil-ajout-post">
            <span> Que voulez vous publier, {{ firstName }} {{ lastName }}  ? </span>
        </div>
        <form action="" @submit.prevent="addPost" enctype="multipart/form-data" class="form-example">
            <div class="form-example">
                <label for="title">Titre du post</label>
                <input type="text" v-model="title" name="title" id="title" required>
            </div>
            <div class="form-example">
                <label for="content">Contenu du post (texte)</label>
                <input type="text" v-model="content" name="title" id="content" required>
            </div>
            <div class="form-example">
                <label for="attachement">Join your image: </label>
                <input type="file" ref="file" @change="selectFile" name="attachement" id="attachement">
            </div>
            <div id="preview">
                <img v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="form-example">
                <input type="submit" value="Publier !">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddPost',
    props: {
        firstName: String,
        lastName: String,
        profilePicUrl: String
    },
    data () {
        return {
            title: '',
            content: '',
            file: '',
            imgPreview: '',

            error: ''
        }
    },
    methods: {
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        addPost() {
            const formData = new FormData();
            formData.append('title', this.title);
            formData.append('content', this.content);
            formData.append('inputFile', this.file);
            console.log(formData);
            axios.post('http://localhost:3000/api/posts/new', formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.title = '';
                this.content = '';
                this.file = '';
                this.imgPreview = '';
                this.$emit('newPost');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>
.add-post-user-pp {
    width: 10%;
    height: auto;
}

.add-post-form {
    width: 70%;
    height: 250px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
}

#preview {
    height: 50px;
    width: 50px;
}
</style>