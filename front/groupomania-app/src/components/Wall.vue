<template>
    <div>
        <div class="wall-container">
            <AddPost @newPost="recallWall"
            v-bind:firstName="profileInfos.firstName"
            v-bind:lastName="profileInfos.lastName"
            v-bind:profilePicUrl="profileInfos.profilePic" />
            <section class="post-list-container">
                <h1 class="post-list-title">Mur de publications</h1>
                <div v-for="post in postList" :key="`${post.id}-${post.UserReacts.filter(i => i.type === true).length}-${post.UserReacts.filter(i => i.type === false).length}`" class="single-post-container">
                    <SingleWallPost @newReaction="recallWall"
                    v-bind:title="post.title" 
                    v-bind:userFirstName="post.User.firstName"
                    v-bind:userLastName="post.User.lastName"
                    v-bind:userProfilePic="post.User.profilePic"
                    v-bind:imgUrl="post.attachment"
                    v-bind:content="post.content"
                    v-bind:comments="post.Comments"
                    v-bind:reactions="post.UserReacts"
                    v-bind:linkUrl="'/post/'+ post.id"
                    v-bind:postId="post.id"/>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import AddPost from './AddPost';
import SingleWallPost from './SingleWallPost';

export default {
    name: 'Wall',
    components: {
        AddPost,
        SingleWallPost

    },
    data () {
        return {
            postList : [],

            profileInfos: [],

            userProfilePic: '',
    
            singlePostUrl: 'http://localhost:3000/api/posts/',
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        } else {
            this.getUserConnectedInfos();
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            const resData = res.data;
            this.postList = resData;
        
        }, err => {
            console.log(err.response);
            // this.$router.push('/login')
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
                // if (res.data.profilePic == null) {
                //     this.userProfilePic = '../assets/default-profile-pics.png'
                // } else {
                //     this.userProfilePic = res.data.profilePic
                // }
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

.wall-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.post-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.post-list-title {
    margin-bottom: 5%;
}

.single-post-container {
    border: solid 0.5px grey;
    background-color: #e5eef7;
    border-radius: 10px;
    width: 75%;
    margin-bottom: 3%;
    position: relative;
}

@media (max-width: 480px) {

    .single-post-container {
        width: 95%;
    }
}
</style>