<template>
    <footer>
        <p>
            Emile Bailay - Groupomania App {{year}}
        </p>
    </footer>
</template>

<script>
export default {
    Name: 'Footer',
    data() {
        return {
            year: ''
        }
    },
    mounted() {
        this.year = new Date().getFullYear();
    }
}
</script>

<style>
footer {
    width: 100%;
    padding: 3%;
    border-top: black solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
}

</style>