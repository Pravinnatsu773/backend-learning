const Industry = require("./../models/industryModel");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError') ;




const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};



const createIndustry = catchAsync(async (req, res, next) => {
  req.body.userId = req.user._id;

  const industryData = await Industry.create(req.body);

  const {name,} = industryData;
  



  res.status(201).json({
    status: "success",
    message:"Industry created Successfully"
  });
});

const getAllIndustry = catchAsync(async (req, res, next) => {
  const industry = await Industry.find();

  res.status(200).json({
    status: "success",

    data: { industry },
  });
});

const getIndustry = catchAsync(async (req, res, next) => {
  if(!req.params.id){
return next(new AppError('Please provide industry Id',400))
  }
  const industry = await Industry.findById(req.params.id);

  res.status(200).json({
    status: "success",

    data: { industry },
  });
});

const updateIndustry = catchAsync(async (req, res, next) => {
  
  const filteredBody = filterObj(req.body, "name",);

  const industry = await Industry.findByIdAndUpdate(req.params.id, filteredBody,  {
    new: true,
    runValidators: true,
  });
  

  res.status(200).json({
    status: "success",

    data: { industry },
  });
});

const deleteIndustry = catchAsync(async (req, res, next) => {
  

  await Industry.findByIdAndUpdate(req.params.id, {isDeleted:true});

  res.status(201).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createIndustry,
  getAllIndustry,
  getIndustry,
  updateIndustry,
  deleteIndustry,
};
