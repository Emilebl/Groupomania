//Import
let models = require('../models');
let utils = require('../utils/jwtUtils');
const fs = require('fs');

//Création d'un message
exports.createPost = (req, res) => {
    //Declaration de l'url de l'image
    let attachmentURL
    //identifier qui créé le message
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
        .then(user => {
            if (user !== null) {
                //Récupération du corps du post
                let title = req.body.title;
                let content = req.body.content;
                if (req.file != undefined) {
                    attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                }
                else {
                    attachmentURL == null
                };
                if ((title == 'null' && content == 'null' && attachmentURL == null)) {
                    res.status(400).json({ error: 'Rien à publier' })
                } else {
                    console.log(attachmentURL)
                    console.log(user.id)
                    models.Post.create({
                        title: title,
                        content: content,
                        attachment: attachmentURL,
                        UserId: user.id
                    })
                        .then((newPost) => {
                            res.status(201).json(newPost)
                        })
                        .catch((err) => {
                            res.status(500).json(err)
                            console.log('ici')
                        })
                };
            } else {
                res.status(400).json(error);
            }
        })
        .catch(error => res.status(500).json(error));
}
