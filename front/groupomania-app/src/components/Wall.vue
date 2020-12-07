<template>
        <div class="wall-container">
            <!-- Here we insert the "AddPost" component, 
            and we specify its props values with infos of the user currently connected -->
            <AddPost @newPost="recallWall"
            v-bind:firstName="profileInfos.firstName"
            v-bind:lastName="profileInfos.lastName"
            v-bind:profilePicUrl="profileInfos.profilePic" />
            <!-- This section will contain the list of posts created by the users -->
            <section class="post-list-container">
                <h1 class="post-list-title">Mur des publications</h1>
                <!-- We use the "v-for" to create a <div> for each element from the array called "postList" -->
                <div v-for="post in postList" :key="`${post.id}-${post.UserReacts.filter(i => i.type === true).length}-${post.UserReacts.filter(i => i.type === false).length}`" class="single-post-container">
                    <!-- Each time this <div> is created it will insert the component "SingleWallPost" 
                    which displays all the elements of ONE post
                    we will also pass it informations to update the component's props -->
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
            // We declare empty arrays/strings before they are filled with the data we will receive from the axios calls
            postList : [],

            profileInfos: [],

            userProfilePic: '',

            // Storing the URL we use to make our post related axios calls
            singlePostUrl: 'http://localhost:3000/api/posts/',
        }
    },
    // When this component is created, the app will redirect to the /login page if the localstorage has no token
    // if else, this will call a method to get informations about the currently connected user
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        } else {
            this.getUserConnectedInfos();
        }
    },
    // When this component is mounted, it will call the backend to get the list of posts existing in the database
    mounted() {
        axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            const resData = res.data;
            this.postList = resData;
        
        }, err => {
            console.log(err.response);
            this.error = err.response.data.error;
        })
    },
    methods: {
        // Method that will execute a new axios call to get the postlist from the database
        recallWall() {
            axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.postList = res.data;

            })
        },
        // Method that will execute an axios call to get informations about the currently connected user
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                if (this.profileInfos.profilePic === null) {
                    this.profileInfos.profilePic = require("@/assets/default-profile-pic.png")
                }
                this.isAdmin = res.data.isAdmin;
            }, err => {
                console.log(err.response);
                // if the response is an error (token expired), we are redirected to the login page
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>

.wall-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3%;
}

.post-list-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.post-list-title {
    margin-bottom: 5%;
}

.single-post-container {
    background-color: #ffffff;
    border-radius: 10px;
    width: 65%;
    margin-bottom: 3%;
    position: relative;
}

@media (max-width: 480px) {

    .single-post-container {
        width: 80%;
    }
}
</style>