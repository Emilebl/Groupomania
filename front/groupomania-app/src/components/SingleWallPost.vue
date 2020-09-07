<template>
    <div class="single-post-wallsinglepost">
        <div class="post-infos-wallsinglepost">
            <div class="user-infos-wallsinglepost wallsinglepost-elements">
                <img v-bind:src="userProfilePic" alt="photo-de-profil-du-createur-du-post" class="user-profile-pic-wallsinglepost">
                <span class="creator-name-wallsinglepost">{{userFirstName}} {{userLastName}}</span>
            </div>
            <h3 class="wallsinglepost-elements">{{ title }}</h3>
            <p class="post-content-wallsinglepost wallsinglepost-elements">{{ content }}</p>
            <img v-bind:src="imgUrl" alt="" class="post-image wallsinglepost-elements">
            <div class="reaction-infos-wallsinglepost wallsinglepost-elements">
                <p>
                    <span>{{ comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comments']" /></span>
                </p>
                <p class="like-dislike-buttons wallsinglepost-elements">
                    <span class="like-span-wallsinglepost">{{ nbOfLikes }} <button class="like-button-singlewallpost reaction-button-singlewallpost" @click="likePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-up']" /></button></span>
                    <span class="dislike-span-wallsinglepost">{{ nbOfDislikes }} <button class="dislike-button-singlewallpost reaction-button-singlewallpost" @click="dislikePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-down']" /></button></span>
                </p>
            </div>
        </div>
        <button class="go-to-singlepost-button" @click="goToSinglePost">Détails du post</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'SingleWallPost',
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
            nbOfLikes: '',
            nbOfDislikes: '',
            like : 1,
            dislike : -1,
        }
    },
    mounted() {
        this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
        this.nbOfDislikes = this.reactions.filter(i => i.type === false).length;
    },
    methods: {
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.$emit('newReaction');
                // this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
                // this.nbOfDislikes = this.reactions.filter(i => i.type === false).length;
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
                this.$emit('newReaction');
                // this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
                // this.nbOfDislikes = this.reactions.filter(i => i.type === false).length;
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        goToSinglePost() {
            this.$router.push(this.linkUrl);
        }
    }
}
</script>

<style>

.wallsinglepost-elements {
    margin-bottom: 4%;
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
    align-items: flex-start;
}

.user-profile-pic-wallsinglepost {
    float: left;
    width:  75px;
    height: 75px;
    object-fit: cover;
    border-radius: 50%;
}

.creator-name-wallsinglepost {
    font-size: 1.3em;
    color: #4287f5;
    margin-left: 4%;
    /* font-style: italic; */
}

.post-infos-wallsinglepost {
    /* border: 1px solid blue; */
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
    width: 80%;
    height: auto;
    object-fit: cover;

}

.reaction-infos-wallsinglepost {
    display: flex;
    justify-content: space-around;
    font-size: 1.5em;
    color: #557596;
}

.reaction-button-singlewallpost {
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.like-span-wallsinglepost {
    color: green;
}

.dislike-span-wallsinglepost {
    color: red;
}

.like-button-singlewallpost {
    color: green;
}

.dislike-button-singlewallpost {
    color: red;
}


.go-to-singlepost-button {
  background-color: #42f5b0; /* Green */
  color: #7842f5;
  border: none;
  border-radius: 10px;
  padding: 2%;
  margin-right: 10px;
  width: auto;
  height: 1%;
  font-size: 1em;
  font-weight: bolder;
  cursor: pointer;
  /* position: absolute;
  bottom: 5%;
  right: 1%; */
  
}
@media (max-width: 768px) {
    .reaction-infos-wallsinglepost {
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
    .single-post-wallsinglepost {
        padding-left: 3%;
        padding-right: 3%;
    }

    .post-infos-wallsinglepost {
        width: 100%;
    }

    .go-to-singlepost-button {
        height: 5%;
        width: auto;
    }
    .reaction-infos-wallsinglepost {
        font-size: 1.2em;
        color: #557596;
    }

    .reaction-button-singlewallpost {
        border: none;
        font-size: 1em;
        cursor: pointer;
    }
}

</style>