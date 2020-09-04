<template>
    <div class="single-post-page">
        <section class="post-container-singlepost">
            <div class="post-infos-singlepost">
                <div class="user-infos-singlepost">
                    <img v-bind:src="post.User.profilePic" alt="photo-de-profil-du-createur-du-post" class="user-profile-pic-singlepost">
                    <span class="creator-name-singlepost">{{post.User.firstName}} {{post.User.lastName}}</span>
                </div>
                <h2>{{ post.title }}</h2>
                <p class="post-content-singlepost">{{ post.content }}</p>
                <img v-bind:src="post.attachment" alt="" class="post-image-singlepost">
                <div class="reaction-infos-singlepost">
                    <p>
                        <span>{{ post.Comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comments']" /></span>
                    </p>
                    <p>
                        <span>{{ nbOfLikes }} <button class="like-button-singlepost reaction-button-singlepost" @click="likePost(post.id)" ><font-awesome-icon :icon="['fas', 'thumbs-up']" /></button></span>
                        <span>{{ nbOfDislikes }} <button class="dislike-button-singlepost reaction-button-singlepost" @click="dislikePost(post.id)" ><font-awesome-icon :icon="['fas', 'thumbs-down']" /></button></span>
                    </p>
                </div>
                <div class="comment-list" v-for="comment in post.Comments" :key="comment">
                    <Comment @commentDeleted="recallSinglePost"
                    v-bind:profilePic="comment.User.profilePic"
                    v-bind:firstName="comment.User.firstName" 
                    v-bind:lastName="comment.User.lastName"
                    v-bind:content="comment.content"
                    v-bind:commentId="comment.id"
                    v-bind:userId="comment.User.id"
                    v-bind:connectedUserId="connectedId"
                    v-bind:postId="urlPostId"
                    v-bind:isAdmin="isAdmin" />
                    <!-- <p>{{ comment.User.firstName }} {{ comment.User.lastName }} a commenté:</p>
                    <p>{{ comment.content }}</p>
                    <button v-show="AuthorisationToDeleteComment" @click="deleteComment(comment.id, comment.User.id)">Supprimer</button>
                    {{ error }} -->
                </div>
                <form class="modify-post-form" v-show="AuthorisationToDeleteOrModifyPost" @submit.prevent="updatePost" enctype="multipart/form-data">
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
                    <button v-show="AuthorisationToDeleteOrModifyPost" @click="deletePost">Supprimer le post</button>
                        {{ error }}
                </form>
            
                
            </div>
    
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
import Comment from './Comment';
export default {
    name: 'SinglePost',
    components: {
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

            profileInfos: [],
            isAdmin: '',

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
        this.getUserConnectedInfos();
        this.urlPostId = this.$route.params.id;
        axios.get('http://localhost:3000/api/posts/' +  this.urlPostId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.post = res.data.singlePost;
            this.Reactions = res.data.singlePost.UserReacts;
            this.userIdOrder = res.data.singlePost.UserId;
            this.connectedId = res.data.userConnected;
            if (this.userIdOrder === this.connectedId || this.isAdmin === true) {
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
        },
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                this.isAdmin = res.data.isAdmin;
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

.single-post-page {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.post-container-singlepost {
    background-color: #e5eef7;
    border-radius: 10px;
    width: 75%;
    margin-bottom: 3%;
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    font-weight: bolder;
    padding-top: 3%;
    padding-bottom: 3%;
    
}

.user-infos-singlepost {
    display: flex;
    align-items: flex-start;
}

.user-profile-pic-singlepost {
    float: left;
    width:  75px;
    height: 75px;
    object-fit: cover;
    border-radius: 50%;
}

.creator-name-singlepost {
    font-size: 1.3em;
    color: #4287f5;
    margin-left: 4%;
    /* font-style: italic; */
}

.post-infos-singlepost {
    /* border: 1px solid blue; */
    text-align: left;
    width: 75%;
}

h2 {
    text-align: center;
    text-decoration: underline;
    
}

.post-content-singlepost {
    font-size: 1.2em;
    font-weight: lighter;
}

.post-image-singlepost  {
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 3px;
    width: 80%;
    height: auto;
    object-fit: cover;

}

.reaction-infos-singlepost {
    display: flex;
    justify-content: space-around;
    font-size: 1.5em;
    color: #557596;
}

.reaction-button-singlepost {
    background: none;
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.like-button-singlepost {
    color: green;
}

.dislike-button-singlepost {
    color: red;
}

.comment-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.comment-form {
    border: 3px solid red;
}

@media (max-width: 480px) {
    .post-container-singlepost {
        padding-left: 3%;
        padding-right: 3%;
        width: 85%;
    }

    .post-infos-singlepost {
        width: 100%;
    }

    .reaction-infos-singlepost {
        font-size: 1.2em;
    }

    .reaction-button-singlepost {
        border: none;
        font-size: 1em;
        cursor: pointer;
    }
}
</style>