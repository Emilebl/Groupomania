//Imports
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routage
router.put("/:id", auth, multer, postCtrl.updatePost);  // Front ok
router.post("/new", auth, multer, postCtrl.createPost); // Front ok
router.delete("/:id", auth, postCtrl.deletePost); // Front ok
router.get("/", auth, postCtrl.getAllPosts); // Front ok
router.get("/:id", auth, postCtrl.getOnePost); // Front ok
router.post("/:id/react", auth, postCtrl.reactToPost) // Front ok
router.post("/:id/comment", auth, postCtrl.commentPost)
router.delete("/:id/comment/:comid", auth, postCtrl.deleteComment)

module.exports = router; 