import bodyParser from 'body-parser'
import express from 'express'
import userRoute from './Routes/usersRoute.js'
import mongoose from 'mongoose'
import galleryItemRoute from './Routes/galleryItemRoute.js'
import jwt from 'jsonwebtoken'

const app = express()

const ConnectionString = "mongodb+srv://tester:123@cluster0.wmscg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(ConnectionString).then(
    ()=>{
        console.log("connected to the database")
    }
).catch(
    ()=>{
        console.log("connection failed")
    }
)

app.use (bodyParser.json())

app.use((req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log(token)

    if (token != null) {
        jwt.verify(token, "bbc", (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" }); 
            }
            if (decoded) {
                req.user = decoded;
                next(); 
            }
        });
    } else {
        next(); 
    }
});


app.use ("/api/users",userRoute)
app.use ("/api/gallery",galleryItemRoute)







app.listen(5000,(req,res)=>{
    console.log("Server is running on port 5000")
});
