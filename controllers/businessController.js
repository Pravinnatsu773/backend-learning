const Business = require("./../models/businessModel");
const User = require("./../models/userModel");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError') ;

const sharp = require('sharp');
const { compress } = require('compressorjs');
const path = require('path');
const { getStorage} = require('firebase-admin/storage');


const storage = getStorage().bucket();


const uploadUserPhoto  = catchAsync(async (req, res, next) => {
  if(typeof req.file == "undefined"){
next()
return
  }
  const file = req.file;
    const folderName = 'business'; // Specify your folder name here
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
      const [downloadUrl] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // This is an arbitrary date far in the future
      });
      req.body.businessPic  = downloadUrl
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



const createBusiness = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;

  const businessData = await Business.create(req.body);

  const {businessName, businessType, businessUrl, businessPic} = businessData;
  
  await User.findByIdAndUpdate(req.user._id, { $push: { businesses: {businessName, businessType, businessUrl, businessPic} }} ,  {
    new: true,
    runValidators: true,
  })


  res.status(201).json({
    status: "success",
    message:"Business created Successfully"
  });
});

const getAllBusiness = catchAsync(async (req, res, next) => {
  const business = await Business.find({userId:req.user._id});

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const getBusiness = catchAsync(async (req, res, next) => {
  if(!req.params.id){
return next(new AppError('Please provide businness Id',400))
  }
  const business = await Business.findById(req.params.id);

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const updateBusiness = catchAsync(async (req, res, next) => {
  
  const filteredBody = filterObj(req.body, "businessName", "businessType", "businessUrl", "businessPic");

  const business = await Business.findByIdAndUpdate(req.params.id, filteredBody,  {
    new: true,
    runValidators: true,
  });
  

  res.status(200).json({
    status: "success",

    data: { business },
  });
});

const deleteBusiness = catchAsync(async (req, res, next) => {
  

  await Business.findByIdAndUpdate(req.params.id, {isDeleted:true});

  res.status(201).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createBusiness,
  getAllBusiness,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  uploadUserPhoto
};
