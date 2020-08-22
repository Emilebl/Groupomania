<template>
    <div>
        <Header />
        <div>
            <h1>{{profileInfos.firstName}} {{profileInfos.lastName}}</h1>
            <img v-bind:src="profileInfos.profilePic" alt="" id="myProfileImage">
            <p>{{profileInfos.bio}}</p>
            <p>{{profileInfos.email}}</p>
            
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from './Header';
export default {
    name: 'MyProfile',
    components : {
        Header
    },
    data () {
        return {
            profileInfos: '',
        }
    },
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    mounted() {
        axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.profileInfos = res.data;
        }, err => {
            console.log(err.response);
            this.$router.push('/login')
            this.error = err.response.data.error;
        })
    }
}
</script>