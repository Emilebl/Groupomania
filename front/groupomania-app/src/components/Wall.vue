<template>
    <div>
        <AddPost @newPost="remountWall" />
        <div v-for="post in postList" :key="post.index">
            <h2>{{ post.title }}</h2>
            <h3>Par {{post.User.firstName}} {{post.User.lastName}}</h3>
            <img v-bind:src="post.attachment" alt="" id="postImage">
            <p>{{ post.content }}</p>
            <span>Commentaires ({{ post.Comments.length }})</span>
            <!-- <span>{{ post.UserReacts.true.length }} Likes </span>
            <span>{{ post.UserReacts.false.length }} Dislikes </span> -->
            <button @click="likePost(post.id)" >Like</button>
            <button @click="dislikePost(post.id)" >Dislike</button>
        </div>

        <button @click="logout">Logout</button>
    </div>
</template>
<script>
import axios from 'axios';
import AddPost from './AddPost';

export default {
    name: 'Wall',
    components: {
        AddPost
    },
    data () {
        return {
            postList : [],
            like : 1,
            dislike : -1
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.postList = res.data;
        })
    },
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push('/login');
        },
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
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
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        remountWall() {
            axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.postList = res.data;
        })
        }
    }
}
</script>

<style>
#postImage {
    max-width: 500px;
}
</style>