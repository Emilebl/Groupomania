<template>
    <div>
        <Header />
        <section class="post-container">
            <h2>{{ post.title }}</h2>
            <h3>Par {{post.User.firstName}} {{post.User.lastName}}</h3>
            <img v-bind:src="post.attachment" alt="" class="post-image">
            <p>{{ post.content }}</p>
            <span>Commentaires ({{ post.Comments.length }})</span>
            <div>
                <div v-for="comment in post.Comments" :key="comment">
                    <Comment @commentDeleted="recallSinglePost"
                    v-bind:firstName="comment.User.firstName" 
                    v-bind:lastName="comment.User.lastName"
                    v-bind:content="comment.content"
                    v-bind:commentId="comment.id"
                    v-bind:userId="comment.User.id"
                    v-bind:connectedUserId="connectedId"
                    v-bind:postId="urlPostId" />
                    <!-- <p>{{ comment.User.firstName }} {{ comment.User.lastName }} a commenté:</p>
                    <p>{{ comment.content }}</p>
                    <button v-show="AuthorisationToDeleteComment" @click="deleteComment(comment.id, comment.User.id)">Supprimer</button>
                    {{ error }} -->
                </div>
            </div>
            <span>{{ nbOfLikes }} Likes </span>
            <span>{{ nbOfDislikes }} Dislikes </span>
            <button @click="likePost(post.id)" >Like</button>
            <button @click="dislikePost(post.id)" >Dislike</button>
        <form v-show="AuthorisationToDeleteOrModifyPost" @submit.prevent="updatePost" enctype="multipart/form-data" class="form-example">
            
            <div>
                <label for="title">Titre du post</label>
                <input type="text" v-model="title" name="title" id="title" required>
            </div>
            <div>
                <label for="content">Contenu du post (texte)</label>
                <input type="text" v-model="content" name="content" id="content" required>
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
        <button v-show="AuthorisationToDeleteOrModifyPost" @click="deletePost">Supprimer le post</button>
        {{ error }}
        </section>
        <div class="comment-form">
        <form @submit.prevent="commentPost(post.id)">
            <div>
                <label for="comment">Contenu du commentaire</label>
                <input type="text" v-model="comment" name="comment" id="comment" required>
            </div>
            <div>
                <input type="submit" value="Poster le commentaire">
                {{ error }}
            </div>
        </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from './Header';
import Comment from './Comment';
export default {
    name: 'SinglePost',
    components: {
        Header,
        Comment
    },
    data () {
        return {
            post: [],
            Reactions: [],
            title: '',
            content: '',
            file: '',
            imgPreview: '',
            userIdOrder: '',
            nbOfLikes: '',
            nbOfDislikes: '',
            comment: '',
            connectedId: '',
            urlPostId: '',

            AuthorisationToDeleteOrModifyPost:'',
            

            like : 1,
            dislike : -1,

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
        this.urlPostId = this.$route.params.id;
        axios.get('http://localhost:3000/api/posts/' +  this.urlPostId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.post = res.data.singlePost;
            this.Reactions = res.data.singlePost.UserReacts;
            this.userIdOrder = res.data.singlePost.UserId;
            this.connectedId = res.data.userConnected;
            if (this.userIdOrder === this.connectedId) {
                this.AuthorisationToDeleteOrModifyPost = true
            }

            this.nbOfLikes = this.Reactions.filter(i => i.type === true).length;
            this.nbOfDislikes = this.Reactions.filter(i => i.type === false).length;
            
        // }, err => {
        //     console.log(err.response);
        //     this.$router.push('/login')
        //     this.error = err.response.data.error;
        })
    },
    computed: {
        // toggleUpdateForm () {
        //     if (!this.showUpdateForm) {
        //         this.showUpdateForm === true
        //     } else {
        //         this.showUpdateForm === false
        //     }
        // }
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
            this.post = res.data.singlePost;
            this.Reactions = res.data.singlePost.UserReacts;
            this.userIdOrder = res.data.singlePost.UserId;
            this.nbOfLikes = this.Reactions.filter(i => i.type === true).length;
            this.nbOfDislikes = this.Reactions.filter(i => i.type === false).length;
            
            
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
        deleteComment(commentId, commentUserId) {
            axios.delete('http://localhost:3000/api/posts/' +  this.$route.params.id + '/comment/' + commentId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: commentUserId}})
            .then(res => {
            console.log(res);
            this.recallSinglePost();
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallSinglePost()
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })

        },
        dislikePost(postId) {
            let reaction = {
                like: this.dislike
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallSinglePost()
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        commentPost(postId) {
            let comment = {
                content: this.comment
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/comment', comment, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallSinglePost()
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
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
.post-container {
    border: 3px solid blue;
    max-width: 65%;
}
.comment-form {
    border: 3px solid red;
}
</style>