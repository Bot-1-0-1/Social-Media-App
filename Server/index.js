import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { register } from "./controllers/auth.js"
import { verifyToken } from "./Middleware/authorization.js";
import { createPost } from "./controllers/posts.js"
import User from './models/User.js';
import Post from "./models/Posts.js";
import { users , posts } from './data/index.js'

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);
dotenv.config();
const app = express();                              // Enables us to use the middleware
app.use(express.json());                            // Invoking the middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended : true}));
app.use(bodyParser.urlencoded({ limit: "30mb" , extended : true }));
app.use(cors());
app.use("/assets" , express.static(path.join(__dirname , "public/assets")));


/* FILE STORAGE */

const storage = multer.diskStorage( {
    destination : function ( req, file , cb ){              // Whenever a user uploads any image it will be stored here 
        cb(null , "public/assets");
    },
    filename : function ( req , file ,cb){                  // Filename of the uploaded will be the original name
        cb( null , file.originalname);
    }
});

const upload = multer({ storage });


/* ROUTES WITH FILES */

app.post("/auth/register" , upload.single("picture") , register);           // app.post( route , middleware => upload picture locally in "public/assets" , controller => actual logic of saving the user in db and functionality to register user )
app.post("/posts", verifyToken , upload.single("picture") , createPost)

/* ROUTES */

app.use("/auth" , authRoutes);                              // we are creating the new folder to keep this file clean
app.use('/users',userRoutes);
app.use("/posts",postRoutes);



/* MONGOOSE SETUP */

const PORT = process.env.PORT || 6001 ;
mongoose.set("strictQuery", false);                         // If we sent empty query then db might send all data in the db
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then( () => {
    app.listen(PORT , () => console.log(`Server port : ${PORT }`));

    /* ADD DATA ONE TIME */

    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch( err => console.log(err));
console.log(process.env.MONGO_URL);

