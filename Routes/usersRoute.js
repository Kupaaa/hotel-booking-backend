import express from 'express'
import { createUser, loginUser, deleteUser, updateUser, getUser} from '../controllers/userController.js'


const userRouter = express.Router()

userRouter.post("/", createUser)
userRouter.post("/login", loginUser)
userRouter.delete("/", deleteUser)
userRouter.put("/", updateUser)
userRouter.get("/", getUser)





export default userRouter;