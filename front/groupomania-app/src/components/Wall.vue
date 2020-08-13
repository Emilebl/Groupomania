<template>
    <div>
        <Header />
        <AddPost @newPost="recallWall" />
        <section class="post-list-container">
        <div v-for="post in postList" :key="post.index" class="post-container">
            <a v-bind:href="'/post/'+ post.id">
                <h2>{{ post.title }}</h2>
                <h3>Par {{post.User.firstName}} {{post.User.lastName}}</h3>
                <img v-bind:src="post.attachment" alt="" class="post-image">
                <p>{{ post.content }}</p>
                <span>Commentaires ({{ post.Comments.length }})</span>
                <span>{{ displayLikes(post.UserReacts) }} Likes </span>
                <span>{{ }} Dislikes </span>
                <button @click="likePost(post.id)" >Like</button>
                <button @click="dislikePost(post.id)" >Dislike</button>
            </a>
        </div>
        </section>
    </div>
</template>
<script>
import axios from 'axios';
import Header from './Header';
import AddPost from './AddPost';

export default {
    name: 'Wall',
    components: {
        AddPost,
        Header

    },
    data () {
        return {
            postList : [],
            Reactions: [],
            nbOfLikes: '',
            nbOfDislikes: '',
            like : 1,
            dislike : -1,
            singlePostUrl: 'http://localhost:3000/api/posts/',
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
            // this.Reactions = res.data.UserReacts;
            this.nbOfLikes = this.Reactions.filter(i => i.type === true).length;
            this.nbOfDislikes = this.Reactions.filter(i => i.type === false).length;
        })
    },
    methods: {
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.recallWall();
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
                this.recallWall();
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        recallWall() {
            axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.postList = res.data;
            })
        },
        displayLikes(reactions) {
            this.Reactions = reactions;
            let nbOfLikes = this.Reactions.filter(i => i.type === true).length;
            return nbOfLikes
        }
    }
}
</script>

<style>
.post-image {
    max-width: 500px;
}

.post-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.post-container {
    border: 3px solid blue;
    max-width: 65%;
}
</style>