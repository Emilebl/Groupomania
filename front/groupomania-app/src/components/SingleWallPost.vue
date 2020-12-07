<template>
    <!-- This component will display the informations of a single post inside the list of the wall component -->
    <div class="single-post-wallsinglepost">
        <div class="post-infos-wallsinglepost">
            <div class="user-infos-wallsinglepost wallsinglepost-elements">
                <img v-bind:src="userProfilePic" alt="photo-de-profil-du-createur-du-post" class="user-profile-pic-wallsinglepost">
                <span class="creator-name-wallsinglepost">{{userFirstName}} {{userLastName}}</span>
            </div>
            <h2 class="wallsinglepost-elements">{{ title }}</h2>
            <p class="post-content-wallsinglepost wallsinglepost-elements">{{ content }}</p>
            <img @click="goToSinglePost" v-show="imgUrl" v-bind:src="imgUrl" alt="image-du-post" class="post-image wallsinglepost-elements">
            <div class="reaction-infos-wallsinglepost wallsinglepost-elements">
                <p>
                    <!-- Here we display the number of comments -->
                    <span @click="goToSinglePost" id="commentaires-link">{{ comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comments']" /></span>
                </p>
                <p class="like-dislike-buttons-wall wallsinglepost-elements">
                    <!-- Here we display the number of likes and dislikes on the post,
                    and the buttons that will add/remove likes/dislikes when clicked -->
                    <span class="like-span-wallsinglepost"><button class="like-button-singlewallpost reaction-button-singlewallpost" @click="likePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-up']" /></button> {{ nbOfLikes }}</span>
                    <span class="dislike-span-wallsinglepost"><button class="dislike-button-singlewallpost reaction-button-singlewallpost" @click="dislikePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-down']" /></button> {{ nbOfDislikes }}</span>
                </p>
            </div>
        </div>
        <!-- This button redirects to the page of a specific post, where the comments are displayed and can be created -->
        <button class="go-to-singlepost-button" @click="goToSinglePost">Détails du post</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SingleWallPost',
    // These are the props whose values have been transmitted by the parent component
    props: {
        title: String,
        userFirstName: String,
        userLastName: String,
        userProfilePic: String,
        imgUrl: String,
        content: String,
        comments: Array,
        reactions: Array,
        linkUrl: String,
        postId: Number
    },
    data() {
        return {
            // Declaring empty strings that will be filled with the number of likes and dislikes on the post
            nbOfLikes: '',
            nbOfDislikes: '',
            // Storing data that contains the value sent in the body of the like/dislike request
            like : 1,
            dislike : -1,
        }
    },
    // When mounted, the component will filter the array of reactions on the post
    // To differenciate the ones that are likes OR dislikes, and store their respective number in the data
    mounted() {
        this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
        this.nbOfDislikes = this.reactions.filter(i => i.type === false).length;
        if (this.userProfilePic === null) {
            this.userProfilePic = require("@/assets/default-profile-pic.png")
        }
    },
    methods: {
        // Method that makes an axios call to the backend to create a new LIKE on the post
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                // When the like creation has succeed, it will emit a new event to the parent component
                this.$emit('newReaction');
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
                // When the dislike creation has succeed, it will emit a new event to the parent component
                this.$emit('newReaction');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        // Method that redirects to the single post page, where you can see the post comments and add some
        goToSinglePost() {
            this.$router.push(this.linkUrl);
        }
    }
}
</script>

<style>

.wallsinglepost-elements {
    margin-bottom: 2%;
}
.single-post-wallsinglepost {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    font-weight: bolder;
    padding-top: 3%;
    padding-bottom: 3%;
    
}

.user-infos-wallsinglepost {
    display: flex;
    align-items: center;
}

.user-profile-pic-wallsinglepost {
    float: left;
    width:  45px;
    height: 45px;
    object-fit: cover;
    border-radius: 50%;
}

.creator-name-wallsinglepost {
    font-size: 1.3em;
    color: #0846AA;
    margin-left: 4%;
    
}

.post-infos-wallsinglepost {
    text-align: left;
    width: 75%;
}



.post-content-wallsinglepost {
    font-size: 1.2em;
    font-weight: lighter;
}

.post-image  {
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 3px;
    width: 100%;
    height: auto;
    object-fit: cover;
    cursor: pointer;
}

.reaction-infos-wallsinglepost {
    display: flex;
    justify-content: space-between;
    font-size: 1.1em;
    color: #354C5F;
}

#commentaires-link {
    cursor: pointer;
}

.reaction-button-singlewallpost {
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.like-span-wallsinglepost {
    color: #354C5F;
}

.dislike-span-wallsinglepost {
    color: #354C5F;
}

.like-button-singlewallpost {
    color: #354C5F;
    background: none;
}
.like-button-singlewallpost:focus {
    outline: none;
    box-shadow: none;
}

.dislike-button-singlewallpost {
    color: #354C5F;
    background: none;
}
.dislike-button-singlewallpost:focus {
    outline: none;
    box-shadow: none;
}

.like-dislike-buttons-wall {
    display: flex;
    text-align: right;
    justify-content: space-between;
    width: 15%;
    background: none;
}


.go-to-singlepost-button {
  background-color: #4287f5;
  color: #FFFFFF;
  border: none;
  border-radius: 3px;
  padding: 1%;
  width: auto;
  height: 1%;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 1.5px 1px 3px grey;

  transition: all 0.1s ease;
}
.go-to-singlepost-button:hover {
    transform: scale(1.05);
}
.go-to-singlepost-button:focus {
    outline: none;
    box-shadow: none;
}


@media (max-width: 768px) {
    .reaction-infos-wallsinglepost {
        font-size: 0.95em;
    }

    .like-dislike-buttons-wall {
        width: 27%;
    }

    .go-to-singlepost-button {
        padding: 2%;
        margin-top: 1%;
    }
    .wallsinglepost-elements {
        margin-bottom: 4%;
    }
    .post-content-wallsinglepost {
        font-size: 1em;
    }
}
</style>