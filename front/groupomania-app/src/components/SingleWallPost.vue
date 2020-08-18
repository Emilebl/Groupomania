<template>
    <div>
        <h2>{{ title }}</h2>
        <h3>Par {{userFirstName}} {{userLastName}}</h3>
        <img v-bind:src="imgUrl" alt="" class="post-image">
        <p>{{ content }}</p>
        <span>Commentaires ({{ comments.length }})</span>
        <span>{{ nbOfLikes }} Likes </span>
        <span>{{ nbOfDislikes }} Dislikes </span>
        <button @click="likePost(postId)" >Like</button>
        <button @click="dislikePost(postId)" >Dislike</button>
        <a v-bind:href="linkUrl">Voir le post</a>
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
                this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
                this.nbOfDislikes = this.reactions.filter(i => i.type === false).length;
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
    }
}
</script>