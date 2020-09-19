// This file contains verification functions of the user inputs
module.exports = {
    validEmail: function (value) {
        const regexEmail = /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/;
        return regexEmail.test(value)
    },
    validPassword: function (value) {
        //Entre 6 et 20 caractères dont au minimum une majuscule, une minuscule et un caractère numérique
        const regexPassword = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/
        return regexPassword.test(value)
    },
    validName: function (value) {
        // Lettre, accents et espaces authorisés
        const regexName = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ- ']{1,30}$/
        return regexName.test(value)
    },
    validBio: function (value) {
        // Lettres, Chiffres et quelques caractères spéciaux + retour à la ligne autorisés, 100 caractères maximum
        const regexBio = /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100}$/
        return regexBio.test(value)
    },
    validPostTitle: function (value) {
        // Lettres, Chiffres et quelques caractères spéciaux autorisés, 50 caractères maximum
        const regexPostTitle = /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,50}$/
        return regexPostTitle.test(value)
    },
    validPostContent: function (value) {
        // Lettres, Chiffres et quelques caractères spéciaux + retour à la ligne autorisés, 300 caractères maximum
        const regexPostContent = /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,300}$/
        return regexPostContent.test(value)
    },
    validComment: function (value) {
        // Lettres, Chiffres et quelques caractères spéciaux autorisés, 100 caractères maximum
        const regexComment = /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,100}$/
        return regexComment.test(value)
    },
}