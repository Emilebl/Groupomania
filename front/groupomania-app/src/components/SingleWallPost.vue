<template>
    <div class="single-post-wallsinglepost">
        <div class="user-infos-wallsinglepost">
            <img v-bind:src="userProfilePic" alt="photo-de-profil-du-createur-du-post" class="user-profile-pic-wallsinglepost">
            <span class="creator-name-wallsinglepost">{{userFirstName}} {{userLastName}}</span>
        </div>
        <div class="post-infos-wallsinglepost">
            <h2>{{ title }}</h2>
            <p>{{ content }}</p>
            <img v-bind:src="imgUrl" alt="" class="post-image">
            <div class="reaction-infos-wallsinglepost">
                <p><span>{{ comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comments']" /></span></p>
                <span>{{ nbOfLikes }} <button class="like-button-singlewallpost" @click="likePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-up']" /></button> </span>
                <span>{{ nbOfDislikes }} <button class="dislike-button-singlewallpost" @click="dislikePost(postId)" ><font-awesome-icon :icon="['fas', 'thumbs-down']" /></button> </span>
                
                
            </div>
        </div>
        <button class="go-to-singlepost-button" @click="goToSinglePost"> Voir le post</button>
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
.single-post-wallsinglepost {
    display: flex;
}

.user-infos-wallsinglepost {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid black; */
    width: 15%;
    height: 100%;
    padding: 2%;
    
}

.post-infos-wallsinglepost {
    padding-left: 15%;
}

.creator-name-wallsinglepost {
    font-size: 1.3em;
    font-style: italic;
}

.user-profile-pic-wallsinglepost {
    width: 70%;
    height: auto;
    border-radius: 50%;
}

.go-to-singlepost-button {
  background-color: #42f5b0; /* Green */
  color: #7842f5;
  border: none;
  border-radius: 10px;
  padding: 15px 32px;
  margin-right: 10px;
  height: 100%;
  font-size: 1em;
  cursor: pointer;
  
/* 
  text-align: center;
  text-decoration: none;
  display: inline-block; */
}

</style>