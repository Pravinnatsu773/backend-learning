
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const mongoSaniize = require('express-mongo-sanitize')
const hpp = require('hpp');

const {xss}  = require('express-xss-sanitizer');
const AppError = require('./utils/appError') ;
const globalErrorHandler = require('./controllers/errorController');
const connectDB = require("./db/connectDb");
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');

const industryRoutes = require('./routes/industryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
// const firebase  = require('firebase')
const dotenv = require('dotenv');


dotenv.config()




// firebase.initializeApp(config.firebaseConfig)

app.use(helmet())


app.use(express.json({
    limit:'10kb'
}))

app.use(mongoSaniize());
app.use(xss());
app.use(hpp({
    whitelist:[
        
    ]
}));

const limiter  = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many request from this IP, please try again in an hour'

})


app.use('/api',limiter);


app.use('/api/v1/user',userRoutes );

app.use('/api/v1/business',businessRoutes );

app.use('/api/v1/industry',industryRoutes );

app.use('/api/v1/review',reviewRoutes );

app.use('/api/v1/subscription',subscriptionRoutes );

app.all('*',(req,res,next)=>{

    next(new AppError('Route not found', 404))
})

app.use(globalErrorHandler)


const port = 3000

const start = async ()=>{

    try {
        await connectDB(process.env.MONGODB_URI)

        app.listen(port, ()=>{
            console.log(`Listening the server on port: ${port}`)
        })

    } catch (error) {
        console.log(error)
    }
}


start()
