<template>
    <div>
        <p>{{ firstName }} {{ lastName }} a commenté:</p>
        <p>{{ content }}</p>
        <button v-show="AuthorisationToDeleteComment" @click="deleteComment(commentId, userId)">Supprimer</button>
        {{ error }}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    Name: 'Comment',
    props: {
        firstName: String,
        lastName: String,
        content: String,
        commentId: Number,
        userId: Number,
        connectedUserId: Number,
        postId: String
    },
    data() {
        return {
            AuthorisationToDeleteComment: '',
            error: ''
        }
    },
    mounted() {
        if (this.userId === this.connectedUserId) {
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