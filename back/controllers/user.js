//Import
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');
let utils = require('../utils/jwtUtils');
let verifyInput = require('../utils/verifyInput')

// Signup / User Creation
exports.signup = (req, res) => {
    // Recuperation of the request body
    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let password = req.body.password;
    let bio = req.body.bio;
    let attachmentURL;
    // We allow the file attachment to be null
    if (req.file != undefined) {
        attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    else {
        attachmentURL == null
    };
    
    if (email == null || firstName == null || lastName == null || password == null) {
        res.status(400).json({ error: 'il manque un paramètre' })
    }

    // Verification of the email and password input using the verifyInput utils
    let emailOk = verifyInput.validEmail(email);
    let mdpOK = verifyInput.validPassword(password);
    
    
    if (emailOk == true && mdpOK == true) {
        // Verify if the user exists or not
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(user => {
                // If none was found then we create it
                if (!user) {
                    // The password is crypted with hash + salt
                    bcrypt.hash(password, 10, function (err, bcryptPassword) {
                        const newUser = models.User.create({
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            password: bcryptPassword,
                            profilePic: attachmentURL,
                            bio: bio,
                            isAdmin: false
                        })
                            .then(newUser => { res.status(201).json({ 'id': newUser.id }) })
                            .catch(err => {
                                res.status(500).json({ err })
                            })
                    })
                }
                // if the user already exists we send this error message
                else {
                    res.status(409).json({ error: 'Cet utilisateur existe déjà' })
                }
            })
            .catch(err => { res.status(500).json({ err }) })
    } else {
        console.log('oups une erreur est survenue')
    }
};

// User login
exports.login = (req, res) => {
    // Recuperation of the request body
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
        res.status(400).json({ error: 'Il manque un paramètre' })
    }
    //Verify if the user exists
    models.User.findOne({
        where: { email: email }
    })
        .then(user => {
            // if user found, we verify the password
            if (user) {
                bcrypt.compare(password, user.password, (errComparePassword, resComparePassword) => {
                    // if password is correct, we generate a session token with the util generateToken
                    if (resComparePassword) {
                        res.status(200).json({
                            userId: user.id,
                            token: utils.generateToken(user),
                            isAdmin: user.isAdmin
                        })
                    // if password is incorrect, we send this error message
                    } else {
                        res.status(403).json({ error: 'Mot de passe non valide' });
                    };
                })
            //  if the user is not found, we send this error message
            } else {
                res.status(404).json({ 'erreur': 'Cet utilisateur n\'existe pas' })
            }
        })
        .catch(err => { res.status(500).json({ err }) })
};

// Get informations from the User profile
exports.getUserProfile = (req, res) => {
    // Recuperation of the request body
    let id = utils.getUserId(req.headers.authorization)
    // Find the user that has the same id as the one from the current token (in the request header)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'profilePic', 'bio', 'isAdmin'],
        where: { id: id }
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json(error))
};

//Modification of the user profile
exports.updateProfile = (req, res) => {
    
    // We take the id from the current token (in the request header)
    let userId = utils.getUserId(req.headers.authorization);
    // Recuperation of the request body
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const bio = req.body.bio;
    let attachmentURL;
    // We allow the file attachment to be null
    if (req.file != undefined) {
        attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    else {
        attachmentURL == null
    };
    // Find the user profile that has the id retrieved from the token
    models.User.findOne({
        attributes: ['id','bio'],
        where: { id: userId }
    })
    // If user found, we modify it with the new informations. If a field was not filled in the request it will stay the same as before
    .then(user => {
    user.update({
        firstName:(firstName ? firstName : user.firstName),
        lastName:(lastName ? lastName : user.lastName),
        profilePic:(attachmentURL ? attachmentURL : user.profilePic),
        bio: (bio ? bio : user.bio)
    })
    .then(() => res.status(201).json({ confirmation: 'bio modifiée avec succès'}))
    .catch(err => res.status(500).json(err))

    })
    .catch(err => json(err))
};

// Delete a user
exports.deleteProfile = (req, res) => {
    // We take the id from the current token (in the request header)
    let userId = utils.getUserId(req.headers.authorization);
    if (userId != null) {
        // We find the user with the same id
        models.User.findOne({
            where: { id: userId }
        })
            .then(user => {
                if (user != null) {
                    // if user found we delete every post that were created by this user
                    models.Post
                        .destroy({
                            where: { userId: user.id }
                        })
                        .then(() => {
                            console.log('Tous les posts de cet user ont été supprimé');
                            // Then we delete the user
                            models.User
                                .destroy({
                                    where: { id: user.id }
                                })
                                .then(() => res.end())
                                .catch(err => console.log(err))
                        })
                        .catch(err => res.status(500).json(err))
                }
                // If user not found we send this error message
                else {
                    res.status(401).json({ error: 'Cet user n\'existe pas' })
                }
            })
    } else {
        res.status(500).json({ error: 'Impossible de supprimer ce compte, contacter un administrateur' })
    }
}
