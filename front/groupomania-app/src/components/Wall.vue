<template>
    <div>
        <Header />
        <AddPost @newPost="recallWall"
        v-bind:firstName="profileInfos.firstName"
        v-bind:lastName="profileInfos.lastName"
        v-bind:profilePicUrl="profileInfos.profilePic" />
        <section class="post-list-container">
            <div v-for="post in postList" :key="post.UserReacts" class="single-post-container">
                <SingleWallPost @newReaction="recallWall"
                v-bind:title="post.title" 
                v-bind:userFirstName="post.User.firstName"
                v-bind:userLastName="post.User.lastName"
                v-bind:imgUrl="post.attachment"
                v-bind:content="post.content"
                v-bind:comments="post.Comments"
                v-bind:reactions="post.UserReacts"
                v-bind:linkUrl="'/post/'+ post.id"
                v-bind:postId="post.id"/>
            </div>
        <!-- <div v-for="post in postList" :key="post.index" class="post-container">
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
        </div> -->
        </section>
    </div>
</template>
<script>
import axios from 'axios';
import Header from './Header';
import AddPost from './AddPost';
import SingleWallPost from './SingleWallPost';

export default {
    name: 'Wall',
    components: {
        AddPost,
        Header,
        SingleWallPost

    },
    data () {
        return {
            postList : [],

            profileInfos: [],
    
            singlePostUrl: 'http://localhost:3000/api/posts/',
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {
        this.getUserConnectedInfos();
        axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.postList = res.data;
            // this.Reactions = res.data.UserReacts;
            // this.nbOfLikes = this.Reactions.filter(i => i.type === true).length;
            // this.nbOfDislikes = this.Reactions.filter(i => i.type === false).length;
        }, err => {
            console.log(err.response);
            this.$router.push('/login')
            this.error = err.response.data.error;
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
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                this.isAdmin = res.data.isAdmin;
            }, err => {
                console.log(err.response);
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        }
        // displayLikes(reactions) {
        //     this.Reactions = reactions;
        //     let nbOfLikes = this.Reactions.filter(i => i.type === true).length;
        //     return nbOfLikes
        // }
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

.single-post-container {
    border: 3px solid blue;
    max-width: 65%;
}
</style>