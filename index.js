import bodyParser from 'body-parser'
import express from 'express'
import userRoute from './Routes/usersRoute.js'
import mongoose from 'mongoose'
import galleryItemRoute from './Routes/galleryItemRoute.js'
import categoryRoute from './Routes/categoryRoute.js'
import dotenv from 'dotenv'
import authenticateToken from './services/authentication.js'


dotenv.config();

const app = express();

const ConnectionString = process.env.MONGO_URL;

mongoose.connect(ConnectionString).then(
    ()=>{
        console.log("connected to the database")
    }
).catch(
    ()=>{
        console.log("connection failed")
    }
)

app.use (bodyParser.json());

app.use(authenticateToken);




app.use ("/api/users", userRoute);
app.use ("/api/gallery", galleryItemRoute);
app.use ("/api/category", categoryRoute);







app.listen(5000,(req,res)=>{
    console.log("Server is running on port 5000")
});
