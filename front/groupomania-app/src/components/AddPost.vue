<template>
    <!-- This section contains the form to create a new post -->
    <section class="form-container">
        <div class="form-title-addpost">
            <img v-bind:src="profilePicUrl" class="add-post-user-pp" alt="user-photo-de-profil-ajout-post"> 
            <h1>Quoi de neuf ?</h1>
        </div>
        <form action="" @submit.prevent="addPost" enctype="multipart/form-data" id="form" class="validate">
            <div class="form-field">
                <label for="titre">Titre</label>
                <input type="text" v-model="title" name="titre" id="title" required>
            </div>
            <div class="form-field">
                <label for="contenu">Contenu</label>
                <textarea v-model="content" name="contenu" id="content" required  />
            </div>
            <div class="form-field">
                <label for="image">Image</label>
                <input type="file" ref="file" @change="selectFile" name="image" id="add-post-pic">
            </div>
            <div class="form-field" id="post-preview-container">
                <label v-if="imgPreview" for="preview">Aperçu de l'image:</label>
                <img id="post-preview" v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="submit-button-container">
                <input type="submit" class="submit-button" value="Publier !">
            </div>
            <div class="error-message-container">
                <p class="add-post-error-msg">{{ addPostErrorMsg }}</p>
            </div>
        </form>
    </section>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddPost',
    // These are the props whose values have been transmitted by the parent component
    props: {
        firstName: String,
        lastName: String,
        profilePicUrl: String
    },
    data () {
        return {
            // These data will reflect what is written in the form inputs, using v-model
            title: '',
            content: '',
            file: '',
            imgPreview: '',

            addPostErrorMsg: '',

            // Regex for the post title, and post content
            TitleRGX: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,50}$/,
            ContentRGX: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,300}$/
        }
    },
    methods: {
        // Method that shows a preview image when a file is selected
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Method that will send the form infos to the backend to create a new post
        addPost() {
            let titleRESULT = this.TitleRGX.test(this.title);
            let contentRESULT = this.ContentRGX.test(this.content);

            if (titleRESULT == false) {
                this.addPostErrorMsg = 'Titre non valide ! 50 Caractères max et évitez les caractères spéciaux'
            } else if (contentRESULT == false) {
                this.addPostErrorMsg = 'Texte non valide ! 300 Caractères max et évitez les caractères spéciaux'
            } else {
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
                    // When post creation has succeed, it will emit a new event to the parent component
                    this.$emit('newPost');
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        }
    }
}
</script>

<style>

.form-title-addpost {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.add-post-user-pp {
    float: left;
    width:  45px;
    height: 45px;
    margin: 3%;
    object-fit: cover;
    border-radius: 50%;
}

#add-post-pic {
    border: none;
    color: transparent;
}

#post-preview {
   width:  40%;
   height: auto;
   object-fit: cover;
   border-radius: 2%;
   margin-left: auto;
   margin-right: auto;
}

.error-message-container{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.add-post-error-msg {
    margin-top: 5%;
    width: 50%;
}

.submit-button-container {
    display: flex;
}

.submit-button {
    background-color: #00bd3f;
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

    transition: all 0.1s ease;
}
.submit-button:hover {
    transform: scale(1.05);
}
.submit-button:focus {
    outline: none;
    box-shadow: none;
}

</style>