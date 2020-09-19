//Import
let models = require('../models');
let utils = require('../utils/jwtUtils');
let verifyInput = require('../utils/verifyInput');
const fs = require('fs');
const post = require('../models/post');

// Create a post
exports.createPost = (req, res) => {
    // Declaration of the imageURl variable
    let attachmentURL
    // Identify the post creator by finding the user that has the same id as the one from the token
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
    .then(user => {
        // if user found
        if (user !== null) {
            // Recuperation of the request body
            let title = req.body.title;
            let content = req.body.content;
            // The attachment can be null
            if (req.file != undefined) {
                attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }
            else {
                attachmentURL == null
            };

            let titleOk = verifyInput.validPostTitle(title);
            let contentOk = verifyInput.validPostContent(content);

            // If the request contains only empty fields, we send this error message
            if ((title == 'null' && content == 'null' && attachmentURL == null)) {
                res.status(400).json({ error: 'Rien à publier' })
            // Else we create the post
            } else if (titleOk == true && contentOk == true) {
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
                })
            } else {
                console.log('invalid inputs')
            };
        } else {
            // If user not found we send an error
            res.status(400).json(error);
        }
    })
    .catch(error => res.status(500).json(error));
},

// Get all posts
exports.getAllPosts = (req, res) => {
    // Get every post from the data base
    // Including specific informations of the post creator, the post reactions and the post comments
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
    // If the number of posts is not null, we send the list in the response
    .then(posts => {
        if (posts.length > null) {
            res.status(200).json(posts)
            // else, we send this error message
        } else {
            res.status(404).json({ error: 'Pas de post à afficher' })
        }
    })
    .catch(err => res.status(500).json(err))
},

// Get one specific post
exports.getOnePost = (req, res) => {
    // We find the post that has the same id as the one in the request parameters
    // Including specific informations of the post creator, the post reactions and the post comments
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
    // We send 2 objects in the response: 
    // the infos of the connected user
    // and the found post infos
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

// Modify one post
exports.updatePost = (req, res) => {
    // We retrieve the id of the post creator
    let userOrder = req.body.userIdOrder;
    // Declaration of the image url variable
    let attachmentURL
    // We find the user that is currently connected
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // If the user is also the creator of the post we want to modify
        // OR if the user is set as an admin in the database
        // We modify the post
        if (user && (user.isAdmin == true || user.id == userOrder)) {
             // Recuperation of the request body
            let title = req.body.newTitle;
            let content = req.body.newContent;
            // We allow the attachment to be null
            if (req.file != undefined) {
                attachmentURL = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                console.log(attachmentURL)
                
            }
            else {
                attachmentURL == null
            };
            let titleOk = verifyInput.validPostTitleModif(title);
            let contentOk = verifyInput.validPostContentModif(content);

            if (titleOk == true && contentOk == true) {
                // We modify the post with the new informations. If a field was not filled in the request it will stay the same as before
                models.Post.update({
                    title: (title ? title : post.title),
                    content: (content ? content : post.content),
                    attachment: (attachmentURL ? attachmentURL : post.attachment)
                },
                { where: { id: req.params.id }}
                )
                .then(() => {res.status(201).json({confirmation: 'Post modifié avec succès'})})
                .catch((err) => {res.status(500).json(err)})
            } else {
                console.log('invalid inputs')
            }
        // If the connected user is neither the post creator or an admin
        // The modification is not allowed and we send this error message
        } else {
            res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce post' })
        }
    })
    .catch(() => res.status(500).json(error));
},
    
// Delete a post
exports.deletePost = (req, res) => {
    //  Recuperation of the request body
    let userOrder = req.body.userIdOrder;
    // Identification of the user currently connected
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // If the user is also the creator of the post we want to delete
        // OR if the user is set as an admin in the database
        // We delete the post
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression du post id :', req.params.id);
            models.Post
            .findOne({
                where: { id: req.params.id }
            })
            .then((postFind) => {
                if (postFind.attachment) {
                    const filename = postFind.attachment.split('/images/')[1];
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
        // If the connected user is neither the post creator or an admin
        // The deletion is not allowed and we send this error message
        } else {
        res.status(403).json('Utilisateur non autorisé à supprimer ce post') }
    })
    .catch(error => res.status(500).json(console.log(error)));
},

// React to a post (Like or Dislike)
exports.reactToPost = (req, res, next) => {
    
    // We identify the currently connected user

    let userId = utils.getUserId(req.headers.authorization)

    models.UserReact.findOne({where: {PostId: req.params.id, UserId: userId}})

    // If a reaction exists with the connected user id AND the id of the post being reacted to
    // We toggle the reaction
    // If not we create a new reaction
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
    // Identify the currently connected user
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'firstName', 'lastName'],
        where: { id: id }
    })
    .then(user => {
        if (user !== null) {
            // Recuperation of the request body
            let content = req.body.content;
            let postId = req.params.id;

            let commentOk = verifyInput.validComment(content)
            // if the field is empty, we send this error message
            if (content == 'null' ) {
                res.status(400).json({ error: 'Rien à commenter' })
            // if not we create the comment
            } else if (commentOk == true) {
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
                    })
            } else {
                console.log('invalid inputs')
            };
        } else {
            res.status(400).json(error);
        }
    })
    .catch(error => res.status(500).json(error));
},

exports.deleteComment = (req, res) => {
    // We recuperate the request body
    let userOrder = req.body.userIdOrder;
    
    // Identification of the currently connected user
    let id = utils.getUserId(req.headers.authorization)
    models.User.findOne({
        attributes: ['id', 'email', 'firstName','lastName', 'isAdmin'],
        where: { id: id }
    })
    .then(user => {
        // If the user is also the creator of the comment we want to delete
        // OR if the user is set as an admin in the database
        // We delete the comment
        if (user && (user.isAdmin == true || user.id == userOrder)) {
            console.log('Suppression du comment id :', req.params.comid);
            models.Comment
            .findOne({
                where: { id: req.params.comid }
            })
            .then((commentFind) => {
                models.Comment
                .destroy({
                    where: { id: commentFind.id }
                })
                .then(() => res.end())
                .catch(err => res.status(500).json(err))
            })
            .catch(err => res.status(500).json(err))
        // If the connected user is neither the comment creator or an admin
        // The deletion is not allowed and we send this error message
        } else {
        res.status(403).json('Utilisateur non autorisé à supprimer ce commentaire') }
    })
    .catch(error => res.status(500).json(console.log(error)));
}
        