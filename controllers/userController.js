const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const sharp = require('sharp');
const { compress } = require('compressorjs');
const path = require('path');
const AppError = require("./../utils/appError");

const {firebaseApp} = require('../config/firebase.config')

const { getStorage} = require('firebase-admin/storage');


const storage = getStorage().bucket();

// const multerStorage = multer.diskStorage({
//   destination:(req, file, cb)=>{
//     cb(null,'public/img/users' )
//   },
//   filename:(req, file, cb)=>{
//     const ext = file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}` );
//   }
// });



const uploadUserPhoto  = catchAsync(async (req, res, next) => {
  const file = req.file;
    const folderName = 'files'; // Specify your folder name here
    const fileName = Date.now() + path.extname(file.originalname);
    const fileUpload = storage.file(`${folderName}/${fileName}`);
    // Create a writable stream and pipe the file to it
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    let compressedBuffer;
    if (file.mimetype.startsWith('image')) {
      // Compress image using sharp
      const image = sharp(file.buffer);
      compressedBuffer = await image.resize({quality:0.6, width: 180 }).toBuffer();
    } else {
      // Compress non-image file using Compressor.js
      compressedBuffer = compress(file.buffer, {
        quality: 0.5, // Adjust quality as needed
        mimeType: file.mimetype
      }).data;
    }
  
    stream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file.');
    });
  
    stream.on('finish', async() => {
      console.log('File uploaded successfully.');
      const [downloadUrl] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // This is an arbitrary date far in the future
      });

      req.body.imageUrl  = downloadUrl
      next()
      // res.status(200).send('File uploaded successfully.');
    });
  
    stream.end(compressedBuffer);
    
})




const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};



const getUser = async (req, res, next) => {
 
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",

    data: { user },
  });
};

const getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: "success",

    data: { user },
  });
});

const updateMe = async (req, res, next) => {
  // console.log(req.file);
  console.log(req.body);

  if (req.body.password) {
    return next(new AppError("Unnecessary password field", 400));
  }

  // const storageRef = ref(storage,`file/${req.file.originalname}`)
  // const uploadTask = await uploadBytesResumable(storageRef, req.file);

 

  const filteredBody = filterObj(req.body, "name", "email", "businesses","imageUrl");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user:updatedUser
    },
  });
};

const updateUser = async (req, res, next) => {
  res.status(201).json({
    status: "success",
    data: req.body,
  });
};

const deleteUser = async (req, res, next) => {};

const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active:false});

  res.status(201).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getUser,
  getAllUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  uploadUserPhoto
};
