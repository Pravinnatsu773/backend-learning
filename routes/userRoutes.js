const express = require("express");

const userController = require("./../controllers/userController");
const authController = require('./../controllers/authController')

const multer = require('multer');
const router = express.Router();


const multerStorage = multer.memoryStorage();


// const multerFilter = (req,file,cb)=>{
//   if(file.mimetype.startsWith('image')){
//     cb(null, true);
//   }else{
//     cb(new AppError("Not an image! Please uplaod only images.", 400),false);
//   }
// }


const upload = multer({
  storage:multerStorage,
//   fileFilter:multerFilter
});


router.post('/signup', authController.signup);

router.post('/login', authController.login);


router.post('/forgotPassword', authController.forgotPassword);

router.patch('/resetPassword/:token', authController.resetPassword);


router.patch('/updateMe',authController.protect, upload.single('photo'),userController.uploadUserPhoto, userController.updateMe);


router.route("/profile").get(authController.protect,userController.getUser)
router.delete('/deleteMe',authController.protect, userController.deleteMe);

router.route("/").get(authController.protect,userController.getAllUser);


router.route("/:id").patch(authController.protect,userController.updateUser).delete(authController.protect,userController.deleteUser);

module.exports = router;