<template>
    <div class="form-container">
        <div class="form-title">
            <img v-bind:src="profilePicUrl" class="add-post-user-pp" alt="user-photo-de-profil-ajout-post"> 
            <h2 >Créer un post</h2>
        </div>
        <form action="" @submit.prevent="addPost" enctype="multipart/form-data" id="form" class="validate">
            <div class="form-field">
                <label for="title">Titre</label>
                <input type="text" v-model="title" name="title" id="title" required>
            </div>
            <div class="form-field">
                <label for="content">Contenu (texte)</label>
                <textarea v-model="content" name="title" id="content" required  />
            </div>
            <div class="form-field">
                <label for="attachement">Image</label>
                <input type="file" ref="file" @change="selectFile" name="attachement" id="add-post-pic">
            </div>
            <div class="form-field" id="post-preview-container">
                <label v-if="imgPreview" for="preview">Aperçu de l'image:</label>
                <img id="post-preview" v-if="imgPreview" :src="imgPreview" />
            </div>
            <div>
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
    float: left;
    width:  75px;
    height: 75px;
    object-fit: cover;
    border-radius: 50%;
}

#add-post-pic {
    border: none;
}

#post-preview {
   width:  40%;
   height: auto;
   object-fit: cover;
   border-radius: 2%;
   margin-left: auto;
   margin-right: auto;
}

.add-post-form {
    width: 70%;
    height: 250px;
    margin: 2%;
    padding: 1%;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
}

</style>