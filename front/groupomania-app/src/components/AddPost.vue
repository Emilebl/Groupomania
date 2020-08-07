<template>
    <div>
        <form action="" @submit.prevent="addPost" class="form-example">
            <div class="form-example">
                <label for="title">Titre du post</label>
                <input type="text" v-model="title" name="title" id="title" required>
            </div>
            <div class="form-example">
                <label for="content">Contenu du post (texte)</label>
                <input type="text" v-model="content" name="title" id="content" required>
            </div>
            <div class="form-example">
                <input type="submit" value="Publier !">
                {{ error }}
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddPost',
    data () {
        return {
            title: '',
            content: '',

            error: ''
        }
    },
    methods: {
        addPost() {
            let post = {
                title: this.title,
                content: this.content
            }
            axios.post('http://localhost:3000/api/posts/new', post, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.title = '';
                this.content = '';
                // this.$router.push('/');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>