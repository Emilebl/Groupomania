<template>
    <div>
        <div v-for="post in postList" :key="post.id">
            <h2>{{ post.title }}</h2>
            <h3>Par {{post.User.firstName}} {{post.User.lastName}}</h3>
            <img src="" alt="">
            <p>{{ post.content }}</p>
            <span>Commentaires ({{ post.Comments.length }})</span>
            <!-- <span>{{ post.UserReacts.true.length }} Likes </span>
            <span>{{ post.UserReacts.false.length }} Dislikes </span> -->
        </div>

        <button @click="logout">Logout</button>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'Landing',
    data () {
        return {
            postList : []
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
        }
    }
}
</script>