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
},

//Afficher les posts sur le mur
exports.getAllPosts = (req, res) => {
    models.Post.findAll({
        include: [{
            model: models.User,
            attributes: ['lastName' , 'firstName']
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
            attributes: ['firstName', 'lastName']
        }],
    })
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => res.status(500).json(err))
},

//Modification d'un post
exports.updatePost = (req, res) => {
    //récupération de l'id du demandeur pour vérification
    let userOrder = req.body.userIdOrder;
    //identification du demandeur
    let id = utils.getUserId(req.headers.authorization);
    models.User.findOne({
        attributes: ['id', 'email', 'firstName', 'lastName', 'isAdmin'],
        where: { id: id }
    })
        .then(user => {
            //Vérification que le demandeur est soit l'admin soit le poster (vérif aussi sur le front)
            if (user && (user.isAdmin == true || user.id == userOrder)) {
                console.log('Modif ok pour le post :', req.params.id);
                models.Post
                    .update(
                        {
                            title: req.body.newTitle,
                            content: req.body.newText,
                            attachment: req.body.newImg
                        },
                        { where: { id: req.params.id } }
                    )
                    console.log(userOrder)
                    .then(() => res.end())
                    .catch(err => res.status(500).json(err))
            }
            else {
                res.status(401).json({ error: 'Utilisateur non autorisé à modifier ce post' })
            }
        }
        )
        .catch(error => res.status(500).json(error));
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

exports.reactToPost = (req, res, next) => { // Function that allows users to like / dislike / un-like / un-dislike sauces
    let userId = utils.getUserId(req.headers.authorization)
    // let userAlreadyLiked = models.UsersLiked.findOne({where: {PostId: req.params.id, UserId: userId}})
    // console.log(userAlreadyLiked)
    if( req.body.like = 1) {
        models.UsersLiked.findOne({where: {PostId: req.params.id, UserId: userId}})
        .then(userAlreadyLiked => {

             if (userAlreadyLiked === null) {
                 console.log('Yes Papa')
                 models.Post.increment('likes', {by: 1, where: {id: req.params.id}})
                .then(() => {
                    console.log('Yes Papiiiiiiii')
                       models.UsersLiked.create({
                         PostId: req.params.id,
                         UserId: userId
                       })
                     .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
                     .catch(res.status(500).json(console.log('impossible d ajouter la ligne UsersLiked')))
                 })
                .catch(res.status(500).json(console.log('impossible d ajouter le like')))
            } else {
                 res.status(403).json('Like Déjà ajouté')
            }
        })
        .catch(error => res.status(500).json(console.log(error)))
    }

   
    // .then(post => { 
    //   switch (req.body.like) {  // Use of a switch to facilitate the 4 different cases 
    //       case 1 : // If the user liked the sauce
    //           models.UsersLiked.findOne({where: {PostId: post.id, UserId: userId}})
    //           .then(userAlreadyLiked => {
    //              if (!userAlreadyLiked)
    //             { // And that he hasn't like the sauce yet
    //             models.Post.increment('likes', {by: 1, where: {id: post.id}})
    //             models.UsersLiked.create({
    //                 PostId: req.params.id,
    //                 UserId: userId
    //             })
    //             console.log(userAlreadyLiked)
    //             .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
    //             .catch((error) => {res.status(400).json({error: error});});
    //           }
    //         })
    //         .catch(res.status(404).json('usersliked pas trouvé et du coup ca tombe dans catch'))
    //            // Add a like to the sauce and push his userId into the usersLiked array
    //         break;
    
    //     //   case -1 :  // If the user Disliked the sauce
    //     //       if (!post.usersDisliked.includes(userId)) {  // And that he hasn't disliked the sauce yet
    //     //         models.Post.updateOne({where: {id: req.params.id}}, {$inc: {dislikes: 1}, $push: {usersDisliked: userId}, id: req.params.id})
    //     //     .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
    //     //     .catch(error => res.status(400).json({ error }));
    //     //       }  // Add a dislike to the sauce and push his userId into the usersDisliked array
    //     //     break;
    
    //     //   case 0: // Two different options here, either remove a like or remove a dislike
    //     //       if (post.usersLiked.includes(userId)) { // If the users' Id is already present in usersLiked
    //     //         models.Post.updateOne({where: {id: req.params.id}}, {$inc: {likes: -1}, $pull: {usersLiked: userId}, id: req.params.id})
    //     //         .then(() => res.status(201).json({ message: 'Like annulé avec succès !' })) // Upon clicking like, remove a like from the sauce and remove his userId from the array
    //     //         .catch(error => res.status(400).json({ error }));
    //     //       } else if (post.usersDisliked.includes(userId)) { // If the users' ID is already present in usersDisliked
    //     //         models.Post.updateOne({where: {id: req.params.id}}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}, id: req.params.id})
    //     //         .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' })) // Do the opposite
    //     //         .catch(error => res.status(400).json({ error })); 
    //     //       }   
    //     //     break;
          
    //       default: // If none of the previous 4 options are true, this error message will appear
    //       console.log(req.body.like)
    //       console.log(post)
    //         throw { error: "Impossible de modifier vos likes, merci de bien vouloir réessayer ultérieurement" };
    //   }
    // })
    // .catch(error => res.status(400).json({ error }));
}
