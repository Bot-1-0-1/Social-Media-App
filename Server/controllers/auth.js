import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";



// This file handles the backend logic 

/* REGISTER USER */

export const register = async (req , res) => {                      // req got from frontend res set to the frontend
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();                             // random salt provided by bcrypt to encrypt our password
        const passwordHash = await bcrypt.hash(password ,salt);         // We are hashing the password

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile : Math.floor(Math.random()*10000),
            impressions : Math.floor(Math.random()*10000),
        });

        const savedUser = await newUser.save();                             // Saving the user with details given above in db and giving the name saved user
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json({ error : err.message});
    }
} 


/* LOGGING-IN */                // User registration is completed above. Here we are checking whether user = legit if yes giving him/her the jwt to access the web pages

export const login = async(req,res)=>{
    try {
        const { email , password} = req.body;
        const user = await User.findOne({ email : email});                  
        if(!user)                                                                   // To check if user exists
            return res.status(400).json( { msg : "User doesn't exist. "});

        const isMatch = await bcrypt.compare(password, user.password);              // To check if the password matches
        if( !isMatch)
            return res.status(400).json({ msg : "Invalid Credentials. "});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);       // Giving token for the legit user so he can visit the web pages        
        delete user.password;                                                   // Deleting the password so it can't go to the frontend 

        res.status(200).json( { token , user } )

        } catch (error) {
        res.status(500).json( { error : err.message });
    }
}