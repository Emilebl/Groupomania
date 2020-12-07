<template>
    <div id="footer">
        <p>
            Emile Bailay - Groupomania App {{year}}
        </p>
    </div>
</template>

<script>
export default {
    Name: 'Footer',
    data() {
        return {
            year: ''
        }
    },
    // When the component is mounted, this function will get the current year and store its value in "year"
    mounted() {
        this.year = new Date().getFullYear();
    }
}
</script>

<style>
#footer {
    position: absolute;
    background-color: #354C5F;
    color: white;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
}
</style>