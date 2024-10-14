import express from 'express'
import { createRoom } from '../controllers/roomController.js';

const roomRoute = express();

roomRoute.post("/", createRoom)



export default roomRoute;