<template>
    <!-- This component will display the informations of ONE single post -->
    <div class="single-post-page">
        <section class="post-container-singlepost">
            <div class="post-infos-singlepost">
                <div class="user-infos-singlepost singlepost-elements">
                    <img v-bind:src="post.User.profilePic" alt="photo-de-profil-du-createur-du-post" class="user-profile-pic-singlepost">
                    <span class="creator-name-singlepost">{{post.User.firstName}} {{post.User.lastName}}</span>
                </div>
                <h1 class="singlepost-elements">{{ post.title }}</h1>
                <p class="post-content-singlepost singlepost-elements">{{ post.content }}</p>
                <img v-bind:src="post.attachment" alt="" class="post-image-singlepost singlepost-elements">
                <div class="reaction-infos-singlepost singlepost-elements">
                    <p class="singlepost-elements">
                        <!-- Here we display the number of comments -->
                        <span>{{ post.Comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comments']" /></span>
                    </p>
                    <p class="like-dislike-buttons singlepost-elements">
                        <!-- Here we display the number of likes and dislikes on the post,
                        and the buttons that will add/remove likes/dislikes when clicked -->
                        <span class="like-span-singlepost">{{ nbOfLikes }} <button class="like-button-singlepost reaction-button-singlepost" @click="likePost(post.id)" ><font-awesome-icon :icon="['fas', 'thumbs-up']" /></button> </span>
                        <span class="dislike-span-singlepost">{{ nbOfDislikes }} <button class="dislike-button-singlepost reaction-button-singlepost" @click="dislikePost(post.id)" ><font-awesome-icon :icon="['fas', 'thumbs-down']" /></button></span>
                    </p>
                </div>
                <!-- We use the "v-for" to create a <div> for each element from the array "Comments" -->
                <div class="comment-list" v-for="comment in post.Comments" :key="comment.id">
                    <!-- Each time this <div> is created it will insert the component "Comment" 
                    which displays all the comments of ONE post
                    we will also pass it informations to update the component's props -->
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
                </div>
                <!-- This div contains the form to add a new comment -->
                <div class="form-container">
                    <form @submit.prevent="commentPost(post.id)" id="form" class="validate">
                        <div class="form-title"> 
                            <h2 class="comment-form-title">Ajouter un commentaire:</h2>
                        </div>
                        <div class="form-field">
                            <label for="comment">Contenu</label>
                            <textarea v-model="comment" name="comment" id="comment" required />
                        </div>
                        <div class="comment-button-container">
                            <input class="comment-button" type="submit" value="Commenter !">
                            <div>{{ commentError }}</div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        <!-- This section contains a form to modify the post, and a button to delete the post
        It will only appear if "AuthorisationToDeleteOrModifyPost" returns true -->
        <section v-show="AuthorisationToDeleteOrModifyPost" class="form-container">
            <div class="form-title"> 
                <h1>Modifier le post</h1>
            </div>
            <form id="form" class="validate" @submit.prevent="updatePost" enctype="multipart/form-data">
                <div class="form-field">
                    <label for="title">Titre du post</label>
                    <input type="text" v-model="title" name="title" id="title">
                </div>
                <div class="form-field">
                    <label for="content">Contenu du post (texte)</label>
                    <input type="text" v-model="content" name="content" id="content">
                </div>
                <div class="form-field">
                    <label for="attachement">Image: </label>
                    <input type="file" ref="file" @change="selectFile" name="attachement" id="modify-post-pic">
                </div>
                <div class="form-field" id="post-preview-container">
                    <label v-if="imgPreview" for="preview">Aperçu de l'image:</label>
                    <img id="post-preview" v-if="imgPreview" :src="imgPreview" />
                </div>
                <div>
                    <input type="submit" value="Modifier !">
                    {{ error }}
                </div>
                <button class="delete-post-button" v-show="AuthorisationToDeleteOrModifyPost" @click="deletePost">Supprimer le post</button>
                    <div>{{ deleteError }}</div>
            </form>
        </section>
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
            // Here we declare the post informations as empty strings, they will be filled
            // with the data received from the calls to the backend
            post: {
                User: {
                    firstName: '',
                    lastName: '',
                    profilePic: '',
                    id: '',
                },
                Comments: []
            },
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

            // This will be returning 'true' or 'false' depending on the connected user's rights on the post
            AuthorisationToDeleteOrModifyPost:'',
            
            // Storing data that contains the value sent in the body of the like/dislike request
            like : 1,
            dislike : -1,

            commentError: '',
            deleteError: '',
            // REGEX for the post title, content, and the comment content
            TitleRGX: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,50})?$/,
            ContentRGX: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,300})?$/,
            CommentRGX: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,100}$/

            // showUpdateForm: true,
        }
    },
    // When this component is created, the app will redirect to the /login page if the localstorage has no token
    // if else, this will call the backend to get informations about the currently connected user
    // it will also call the backend to get the data of a specific post (specified in the url)
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        } else {
            this.getUserConnectedInfos();
            this.urlPostId = this.$route.params.id;
            axios.get('http://localhost:3000/api/posts/' +  this.urlPostId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.post = res.data.singlePost;
                this.Reactions = res.data.singlePost.UserReacts;
                this.userIdOrder = res.data.singlePost.UserId;
                this.connectedId = res.data.userConnected;
                // If the user connected is also the creator of the post on the current page
                // OR if the user connected is and Admin
                // "AuthorisationToDeleteOrModifyPost" will return true and the modify/delete section will appear
                if (this.userIdOrder === this.connectedId || this.isAdmin === true) {
                    this.AuthorisationToDeleteOrModifyPost = true
                }
                // Here we filter the Reactions array to differenciate the ones that are likes OR dislikes
                // and store their respective number in the data
                this.nbOfLikes = this.Reactions.filter(i => i.type === true).length;
                this.nbOfDislikes = this.Reactions.filter(i => i.type === false).length;
            })
        }
    },
    methods: {
        // Method that shows a preview image when a file is selected
        selectFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Method that sends the form informations to the backend to modify a specific post
        updatePost() {
            let titleRESULT = this.TitleRGX.test(this.title);
            let contentRESULT = this.ContentRGX.test(this.content);

            if (titleRESULT == false) {
                this.error = 'Titre non valide ! 50 Caractères maximum et évitez les caractères spéciaux'
            } else if (contentRESULT == false) {
                this.error = 'Texte non valide ! 300 Caractères maximum et évitez les caractères spéciaux'
            } else {
                const formData = new FormData();
                formData.append('newTitle', this.title);
                formData.append('newContent', this.content);
                formData.append('inputFile', this.file);
                formData.append('userIdOrder', this.userIdOrder);
                console.log(formData);
                axios.put('http://localhost:3000/api/posts/' +  this.$route.params.id, formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    window.scrollTo(0,0);
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
            }
        },
        // Method that makes a new axios call to get data from a specific post
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
        // Method that request to the backend to delete a specific post
        deletePost() {
            axios.delete('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: this.userIdOrder}})
            .then(res => {
            console.log(res);
            this.$router.push('/')
            }, err => {
                console.log(err.response);
                this.deleteError = err.response.data.error;
            })
        },
        // Method that makes an axios call to the backend to create a new LIKE on the post
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallSinglePost()
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        // Method that makes an axios call to the backend to create a new DISLIKE on the post
        dislikePost(postId) {
            let reaction = {
                like: this.dislike
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallSinglePost()
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        // Method that send the comment form infos to create a new comment
        commentPost(postId) {
            let commentRESULT = this.CommentRGX.test(this.comment);

            if (commentRESULT == false) {
                this.commentError = 'Texte non valide ! 100 Caractères maximum et évitez les caractères spéciaux'
            } else {
                let comment = {
                    content: this.comment
                }
                axios.post('http://localhost:3000/api/posts/'+ postId + '/comment', comment, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    console.log(res);
                    this.comment = '';
                    this.commentError = '';
                    this.recallSinglePost()
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        },
        // Method that will execute an axios call to get informations about the currently connected user
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                this.isAdmin = res.data.isAdmin;
            }, err => {
                console.log(err.response);
                // if the response is an error (token expired), we are redirected to the login page
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>

.singlepost-elements {
    margin-bottom: 4%;
}

.delete-post-button {
    background-color: #c00000;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 2%;
    margin-top: 10%;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bolder;
    cursor: pointer;
}

#modify-post-pic {
    border: none;
}

.single-post-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
}

.post-container-singlepost {
    background-color: #e5eef7;
    border-radius: 10px;
    width: 90%;
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
}

.post-infos-singlepost {
    text-align: left;
    width: 75%;
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

.like-span-singlepost {
    color: green;
}

.dislike-span-singlepost {
    color: red;
}

.like-dislike-buttons {
    display: flex;
    min-width: 20%;
    justify-content: space-between;
}

.reaction-button-singlepost {
    background: none;
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.reaction-button-singlepost:focus {
  outline: none;
  box-shadow: none;
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

.comment-button-container {
    text-align: center;
}

.comment-form-title {
    font-size: 1.2em;
}



@media (max-width: 768px) {
    .reaction-infos-singlepost {
        font-size: 1.2em;
        flex-direction: column-reverse;
        align-items: center;
    }

    .like-dislike-buttons {
        display: flex;
        width: 40%;
        justify-content: space-between;
    }
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
    
    .reaction-button-singlepost {
        border: none;
        font-size: 1em;
        cursor: pointer;
    }
}
</style>