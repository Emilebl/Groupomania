let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');
let utils = require('../utils/jwtUtils');
let verifyInput = require('../utils/verifyInput')

//Création d'un user
exports.signup = (req, res) => {
    // Valider les paramètres de la requète
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let bio = req.body.bio;

    if (email == null || firstName == null || lastName == null || password == null) {
        res.status(400).json({ error: 'il manque un paramètre' })
    }

    // On fait la Vérification des saisies des inputs de l'user
    let emailOk = verifyInput.validEmail(email);
    console.log(emailOk)
    let mdpOK = verifyInput.validPassword(password);
    console.log(mdpOK)
    // let usernameOk = verifInput.validUsername(username);
    // console.log(usernameOk)
    if (emailOk == true && mdpOK == true) {
        //Vérification si user n'existe pas déjà
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(user => {
                if (!user) {
                    bcrypt.hash(password, 10, function (err, bcryptPassword) {
                        // Création de l'user
                        const newUser = models.User.create({
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            password: bcryptPassword,
                            bio: bio,
                            isAdmin: false
                        })
                            .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                            .catch(err => {
                                res.status(500).json({ err })
                            })
                    })
                }
                else {
                    res.status(409).json({ error: 'Cet utilisateur existe déjà' })
                }
            })
            .catch(err => { res.status(500).json({ err }) })
    } else {
        console.log('oups une erreur est survenue')
    }
};

//Login d'un user
exports.login = (req, res) => {
    //Récupération et validation des paramètres
    let email = req.body.email;
    let password = req.body.password;
    if (email == null || password == null) {
        res.status(400).json({ error: 'Il manque un paramètre' })
    }
    //Vérification si l'user existe
    models.User.findOne({
        where: { email: email }
    })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (errComparePassword, resComparePassword) => {
                    if (resComparePassword) {
                        res.status(200).json({
                            userId: user.id,
                            token: utils.generateToken(user),
                            isAdmin: user.isAdmin
                        })
                    } else {
                        res.status(403).json({ error: 'invalid password' });
                    };
                })
            } else {
                res.status(404).json({ 'erreur': 'Cet utilisateur n\'existe pas' })
            }
        })
        .catch(err => { res.status(500).json({ err }) })
};

//Profil d'un user
exports.getUserProfile = (req, res) => {
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'bio', 'isAdmin'],
        where: { id: id }
    })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json(error))
};

//modification d'un profil
exports.updateProfile = (req, res) => {
    
    //Récupère l'id de l'user et le nouveau password
    let userId = utils.getUserId(req.headers.authorization);
    const bio = req.body.bio;
    //Vérification regex du nouveau mot de passe

    models.User.findOne({
        attributes: ['id','bio'],
        where: { id: userId }
    })
    .then(user => {
    console.log('user trouvé', user)
                    
    user.update({
        bio: (bio ? bio : user.bio)
    })
    .then(() => res.status(201).json({ confirmation: 'bio modifiée avec succès'}))
    .catch(err => res.status(500).json(err))

    })
    .catch(err => json(err))
};

//Suppression d'un compte
exports.deleteProfile = (req, res) => {
    //récupération de l'id de l'user
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
        //Recherche sécurité si user existe bien
        models.User.findOne({
            where: { id: userId }
        })
            .then(user => {
                if (user != null) {
                    //Delete de tous les posts de l'user même s'il y en a pas
                    models.Post
                        .destroy({
                            where: { userId: user.id }
                        })
                        .then(() => {
                            console.log('Tous les posts de cet user ont été supprimé');
                            //Suppression de l'utilisateur
                            models.User
                                .destroy({
                                    where: { id: user.id }
                                })
                                .then(() => res.end())
                                .catch(err => console.log(err))
                        })
                        .catch(err => res.status(500).json(err))
                }
                else {
                    res.status(401).json({ error: 'Cet user n\'existe pas' })
                }
            })
    } else {
        res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
    }
}
