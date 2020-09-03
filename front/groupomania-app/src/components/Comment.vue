<template>
    <div class="comment-container">
        <div class="comment-user-infos">
            <img v-bind:src="profilePic" alt="photo-de-profil-du-commenteur" class="comment-user-profile-pic">
            <div class="comment-text-area">
                <span class="comment-creator-name" >{{ firstName }} {{ lastName }}</span> a commenté:
                <p class="comment-content">{{ content }}</p>
            </div>
        </div>
        
        <button class="delete-comment-button" v-show="AuthorisationToDeleteComment" @click="deleteComment(commentId, userId)"><font-awesome-icon :icon="['fas', 'trash']" /></button>
        {{ error }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    Name: 'Comment',
    props: {
        profilePic: String,
        firstName: String,
        lastName: String,
        content: String,
        commentId: Number,
        userId: Number,
        connectedUserId: Number,
        postId: String,
        isAdmin: Boolean
    },
    data() {
        return {
            AuthorisationToDeleteComment: '',
            error: ''
        }
    },
    mounted() {
        if (this.userId === this.connectedUserId || this.isAdmin === true) {
            this.AuthorisationToDeleteComment = true
        }
    },
    methods: {
        deleteComment(commentId, commentUserId) {
            axios.delete('http://localhost:3000/api/posts/' +  this.postId + '/comment/' + commentId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: commentUserId}})
            .then(res => {
            console.log(res);
            this.$emit('commentDeleted')
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>

.comment-container {
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    width: 90%;
    margin: 1%;
}

.comment-user-infos {
    display: flex;
    align-items: flex-start;
    min-width: auto;
}

.comment-user-profile-pic {
    float: left;
    width:  50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    margin: 2%;
}

.comment-text-area {
    background: #bbdeff;
    border-radius: 10px;
    padding: 3%;
    margin: 2%;
    min-width: auto;
}

.comment-creator-name {
    font-style: italic;
}

.comment-content {
    font-size: 1.2em;
    font-weight: lighter;
}

.delete-comment-button {
    margin-top: 1%;
    height: 30%;
    border: none;
    background: none;
    color: #8c1c00;
    font-size: 1.2em;
    cursor: pointer;
}

.delete-comment-button:focus {
  outline: none;
  box-shadow: none;
}


</style>