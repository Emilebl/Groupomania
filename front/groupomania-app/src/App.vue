<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header';

export default {
  name: 'App',
  components: {
    Header
  }
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

body {
  background-color: #eee;
  color: #222;
}

.form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 3%;
    padding: 3%;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Styling for forms  */

#form {
  max-width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background: rgb(223, 223, 223);
  border-radius: 5px;
}

.form-title {
  margin-bottom: 3%;
}

.form-field {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 1rem 0;
}
label, input {
  width: 62%;
  padding: 0.5rem;
  box-sizing: border-box;
  justify-content: space-between;
  font-size: 1.1rem;
}
label {
  text-align: right;
  width: 38%;
}
input {
  border: 2px solid #aaa;
  border-radius: 2px;
}

#post-preview {
   width:  300px;
   height: auto;
   object-fit: cover;
   border-radius: 2%;
   margin-left: auto;
   margin-right: auto;
}

.error-message {
    flex: 0 0 100%;
    margin-left: 30%;
    color: red;
}
</style>
