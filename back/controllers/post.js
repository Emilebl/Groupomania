//Import
let models = require('../models');
let utils = require('../utils/jwtUtils');
const fs = require('fs');
const post = require('../models/post');

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
},

//Afficher les posts sur le mur
exports.getAllPosts = (req, res) => {
    models.Post.findAll({
        include: [{
            model: models.User,
            attributes: ['lastName' , 'firstName' , 'profilePic']
        },{
            model: models.UserReact,
            required: false,
            attributes: ['userId', 'type']
            
        },{
            model: models.Comment,
            required: false,
            attributes: ['content'],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName', 'profilePic']
            }]
            
        }],
        order: [['createdAt', 'DESC']]
    })
    .then(posts => {
        if (posts.length > null) {
            res.status(200).json(posts)
        } else {
            res.status(404).json({ error: 'Pas de post à afficher' })
        }
    })
    .catch(err => res.status(500).json(err))
},

//Afficher un post spécifique
exports.getOnePost = (req, res) => {
    models.Post.findOne({
        where: { id: req.params.id},
        include: [{
            model: models.User,
            attributes: ['firstName', 'lastName', 'profilePic', 'id']
        },{
            model: models.UserReact,
            required: false,
            attributes: ['userId', 'type']
            
        },{
            model: models.Comment,
            required: false,
            attributes: ['content', 'id'],
            include: [{
                model: models.User,
                attributes: ['firstName', 'lastName', 'profilePic', 'id']
            }]  
        }]
    })
    .then(post => {
        let userConnectedId = utils.getUserId(req.headers.authorization);
        let postAndUserInfo = {
            singlePost : post,
            userConnected : userConnectedId
        };
        res.status(200).json(postAndUserInfo)
    })
    .catch(err => res.status(500).json(err))
},

//Modification d'un post
exports.updatePost = (req, res) => {
    //récupération de l'id du demandeur pour vérification
    let userOrder = req.body.userIdOrder;
    //Declaration de l'url de l'image
    let attachmentURL
    //identifier qui créé le message
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        console.log(user)
        if (user && (user.isAdmin == true || user.id == userOrder)) {
             //Récupération du corps du post
            let title = req.body.newTitle;
            let content = req.body.newContent;
            if (req.file != undefined) {
                attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                console.log(attachmentURL)
                
            }
            else {
                attachmentURL == null
            };
            models.Post.update({
                title: (title ? title : post.title),
                content: (content ? content : post.content),
                attachment: (attachmentURL ? attachmentURL : post.attachment)
            },
            { where: { id: req.params.id }}
            )
            .then(() => {res.status(201).json({confirmation: 'post modifié avec succès'})})
            .catch((err) => {res.status(500).json(err)})
         } else {
            res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce post' })
         }
    })
    .catch(() => res.status(500).json(error));
},
    
//Suppression d'un post
exports.deletePost = (req, res) => {
//req => userId, postId, user.isAdmin
    let userOrder = req.body.userIdOrder;
    console.log(userOrder);
    //identification du demandeur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression du post id :', req.params.id);
            models.Post
            .findOne({
                where: { id: req.params.id }
            })
            .then((postFind) => {
                console.log(postFind)
                if (postFind.attachment) {
                    const filename = postFind.attachment.split('/images/')[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, () => {
                        models.Post
                        .destroy({
                            where: { id: postFind.id }
                        })
                        .then(() => res.end())
                        .catch(err => res.status(500).json(err))
                    })
                }
                else {
                    models.Post
                    .destroy({
                        where: { id: postFind.id }
                    })
                    .then(() => res.end())
                    .catch(err => res.status(500).json(err))
                }
            })
            .catch(err => res.status(500).json(err))
        } else { console.log(userOrder); console.log(user.id);
            res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
    })
    .catch(error => res.status(500).json(console.log(error)));
},
        
exports.reactToPost = (req, res, next) => {
    
    console.log(req.body.like)

    let userId = utils.getUserId(req.headers.authorization)

    models.UserReact.findOne({where: {PostId: req.params.id, UserId: userId}})
    .then(userAlreadyReacted => {
        if (userAlreadyReacted) return toggleReact();
        addReact();
        // Declarations of functions

    // Function that modifies the already existing reaction
    function toggleReact() {
        if (req.body.like == 1) return toggleLike(); // if the request is to Like, we toggle the Like
        toggleDislike(); // if not, we toggle the Dislike
    };
    // Function that toggles like to none, or dislike to like
    function toggleLike() {
        if (userAlreadyReacted.type === true) return removeLike(); // if the reaction was already on "like", we remove it
        convertDislikeToLike(); // if not, we convert it from Dislike to Like
    };
    // Function that removes the like
    function removeLike() {
        userAlreadyReacted.destroy()
        .then(() => res.status(201).json({ message: 'Like supprimé !' }))
        .catch(() => res.status(500).json(console.log('impossible de supprimer le Like')))
    };
    // Function that converts the Dislike to a Like
    function convertDislikeToLike() {
        userAlreadyReacted.update({
            type: true
        })
        .then(() => res.status(201).json({ message: 'Dislike converti en Like !' }))
        .catch(() => res.status(500).json(console.log('Impossible de convertir le Dislike')))
    };
    // Function that toggles dislike to none, or like to dislike
    function toggleDislike() {
        if (userAlreadyReacted.type === false) return removeDislike(); // if the reaction was already on "dislike", we remove it
        convertLikeToDisike(); // if not, we convert it from like to dislike
    };
    // Function that removes the dislike
    function removeDislike() {
        userAlreadyReacted.destroy()
        .then(() => res.status(201).json({ message: 'Dislike supprimé !' }))
        .catch(() => res.status(500).json(console.log('impossible de supprimer le Disike')))
    };
    // Function that converts the like to a dislike
    function convertLikeToDisike() {
        userAlreadyReacted.update({
            type: false
        })
        .then(() => res.status(201).json({ message: 'Like converti en Dislike !' }))
        .catch(() => res.status(500).json(console.log('Impossible de convertir le Like')))
    };
    // Function that creates a new reaction
    function addReact() {
        if (req.body.like == 1) return addLike(); // if the request is to Like, we create a like
        addDislike(); // if not, we create a Dislike
    };
    // Function that creates a new Like
    function addLike() {
        models.UserReact.create({
            PostId: req.params.id,
            UserId: userId,
            type: true
        })
        .then(() => res.status(201).json({ message: 'Like ajouté !' }))
        .catch(() => res.status(500).json(console.log('Impossible d ajouter le Like')))
    };
    // Function that creates a new Dislike
    function addDislike() {
        models.UserReact.create({
            PostId: req.params.id,
            UserId: userId,
            type: false
        })
        .then(() => res.status(201).json({ message: 'Dislike ajouté !' }))
        .catch(() => res.status(500).json(console.log('Impossible d ajouter le DisLike')))
    };
    })
    .catch(error => res.status(500).json(console.log(error)))
},

exports.commentPost = (req, res) => {
    //identify who creates the comment
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
    .then(user => {
        if (user !== null) {
            //Récupération du corps du post
            let content = req.body.content;
            let postId = req.params.id;
            if (content == 'null' ) {
                res.status(400).json({ error: 'Rien à commenter' })
            } else {
            models.Comment.create({
                content: content,
                PostId: postId,
                UserId: user.id
            })
                .then((newComment) => {
                    res.status(201).json(newComment)
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
},

exports.deleteComment = (req, res) => {
    //req => userId, postId, user.isAdmin
    let userOrder = req.body.userIdOrder;
    console.log(userOrder);
    //identification du demandeur
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        //Vérification que le demandeur est soit l'admin soit le posteur (vérif aussi sur le front)
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression du comment id :', req.params.comid);
            models.Comment
            .findOne({
                where: { id: req.params.comid }
            })
            .then((commentFind) => {
                console.log(commentFind)
                models.Comment
                .destroy({
                    where: { id: commentFind.id }
                })
                .then(() => res.end())
                .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json(err))
        } else { console.log(userOrder); console.log(user.id);
        res.status(403).json('Utilisateur non autorisé à supprimer ce commentaire') }
    })
    .catch(error => res.status(500).json(console.log(error)));
}
        