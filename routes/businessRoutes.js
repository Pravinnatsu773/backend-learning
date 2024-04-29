const express = require("express");
const businessController = require("./../controllers/businessController");
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


router.route("/").get(authController.protect,businessController.getAllBusiness).post(authController.protect,upload.single('businessPic'),businessController.uploadUserPhoto, businessController.createBusiness);


router.route("/:id").get(authController.protect,businessController.getBusiness).patch(authController.protect,businessController.updateBusiness).delete(authController.protect,businessController.deleteBusiness);

module.exports = router;