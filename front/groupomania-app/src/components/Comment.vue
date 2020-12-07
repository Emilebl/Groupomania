<template>
    <!-- This element displays a single comment inside the comment list -->
    <!-- <div class="comment-container"> -->
        <div class="comment-user-infos">
            <img v-bind:src="profilePic" alt="photo-de-profil-du-créateur-du-commentaire" class="comment-user-profile-pic">
            <div class="comment-text-area">
                <span class="comment-creator-name" >{{ firstName }} {{ lastName }}</span>:
                <p class="comment-content">{{ content }}</p>
            </div>
            <!-- This button to delete the comment is only shown if "AuthorisationToDeleteComment" returns 'true' -->
            <button class="delete-comment-button" v-show="AuthorisationToDeleteComment" @click="deleteComment(commentId, userId)"><font-awesome-icon :icon="['fas', 'minus-circle']" /></button>
            {{ error }}
        </div>
    <!-- </div> -->
</template>

<script>
import axios from 'axios';

export default {
    Name: 'Comment',
    // These are the props whose values have been transmitted by the parent component
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
            // This will be returning 'true' or 'false' depending on the connected user's rights on the comment
            AuthorisationToDeleteComment: '',
            error: ''
        }
    },
    mounted() {
        // If the user connected is also the creator of the comment
        // OR if the user connected is and Admin
        // "AuthorisationToDeleteComment" will return true and the delete button will appear
        if (this.userId === this.connectedUserId || this.isAdmin === true) {
            this.AuthorisationToDeleteComment = true
        }
        if (this.profilePic === null) {
            this.profilePic = require("@/assets/default-profile-pic.png")
        }
    },
    methods: {
        // Method that sends to the backend a request to delete a specific comment
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
    border: solid black 1px;
    border-radius: 4px;
    display: flex;
    width: 100%;
}

.comment-user-infos {
    display: flex;
    justify-content: flex start;
    width: 100%;
}

.comment-user-profile-pic {
    float: left;
    width:  30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0.7%;
}

.comment-text-area {
    background: #e8f4ff;
    border-radius: 10px;
    padding: 1.2%;
    margin: 0.7%;
    width: auto;
}

.comment-creator-name {
    font-style: italic;
}

.comment-content {
    font-size: 1.2em;
    font-weight: lighter;
}

.delete-comment-button {
    border: none;
    background: none;
    color: #521919;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.1s ease;
}
.delete-comment-button:hover {
  transform: scale(1.1);
}

.delete-comment-button:focus {
  outline: none;
  box-shadow: none;
}

@media (max-width: 768px) {
    .comment-user-profile-pic {
        margin: 2%;
    }
    .comment-content {
    font-size: 1em;
    }
    .comment-text-area {
        padding: 3%;
        margin: 2%;
    }
    .delete-comment-button {
        font-size: 1em;
    }
}

</style>