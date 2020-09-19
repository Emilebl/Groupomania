<template>
    <!-- This section contains the form to create a new post -->
    <section class="form-container">
        <div class="form-title">
            <img v-bind:src="profilePicUrl" class="add-post-user-pp" alt="user-photo-de-profil-ajout-post"> 
            <h1>Créer un post</h1>
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

            error: '',

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
                this.error = 'Titre non valide ! 50 Caractères maximum et évitez les caractères spéciaux'
            } else if (contentRESULT == false) {
                this.error = 'Texte non valide ! 300 Caractères maximum et évitez les caractères spéciaux'
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