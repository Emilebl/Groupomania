<template>
    <div>
        <Header />
        <section class="post-container">
            <h2>{{ post.title }}</h2>
            <h3>Par {{post.User.firstName}} {{post.User.lastName}}</h3>
            <img v-bind:src="post.attachment" alt="" class="post-image">
            <p>{{ post.content }}</p>
            <span>Commentaires ({{ post.Comments.length }})</span>
            <!-- <span>{{ post.UserReacts.true.length }} Likes </span>
            <span>{{ post.UserReacts.false.length }} Dislikes </span> -->
            <button @click="likePost(post.id)" >Like</button>
            <button @click="dislikePost(post.id)" >Dislike</button>
        <form @submit.prevent="updatePost" enctype="multipart/form-data" class="form-example">
            
            <div>
                <label for="title">Titre du post</label>
                <input type="text" v-model="title" name="title" id="title" required>
            </div>
            <div>
                <label for="content">Contenu du post (texte)</label>
                <input type="text" v-model="content" name="title" id="content" required>
            </div>
            <div>
                <label for="attachement">Join your image: </label>
                <input type="file" ref="file" @change="selectFile" name="attachement" id="attachement">
            </div>
            <div id="preview">
                <img v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="form-example">
                <input type="submit" value="Modifier !">
                {{ error }}
            </div>
        </form>
        <button @click="deletePost">Supprimer le post</button>
        {{ error }}
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import Header from './Header';
export default {
    name: 'SinglePost',
    components: {
        Header
    },
    data () {
        return {
            post: [],
            title: '',
            content: '',
            file: '',
            imgPreview: '',
            userIdOrder: '',
            AuthorisationToDelete:'',

            error: '',

            showUpdateForm: true,
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.post = res.data;
            this.userIdOrder = res.data.UserId
        })
    },
    methods: {
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        updatePost() {
            const formData = new FormData();
            formData.append('newTitle', this.title);
            formData.append('newContent', this.content);
            formData.append('inputFile', this.file);
            formData.append('userIdOrder', this.userIdOrder);
            console.log(formData);
            axios.put('http://localhost:3000/api/posts/' +  this.$route.params.id, formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.title = '';
                this.content = '';
                this.file = '';
                this.imgPreview = '';
                this.recallSinglePost()
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        recallSinglePost() {
            axios.get('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.post = res.data;
            this.userIdOrder = res.data.UserId
        })
        },
        deletePost() {
            axios.delete('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: this.userIdOrder}})
            .then(res => {
            console.log(res);
            this.$router.push('/')
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        toggleUpdateForm () {
            if (!this.showUpdateForm) {
                this.showUpdateForm === true
            } else {
                this.showUpdateForm === false
            }
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
.post-container {
    border: 3px solid blue;
    max-width: 65%;
}
</style>