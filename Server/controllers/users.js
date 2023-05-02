import User from "../models/User.js";

/* READ */

export const getUser = async (req,res)=>{
    try {
        const { id } = req.params;
        const  user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message : error.message});
    }
}

export const getUserFriends = async ( req , res ) =>{
    try {
        
    const { id } = req.params;
    const user = await User.findById(id);
    
    const friends = await Promise.all( user.friends.map ((id)=>User.findById(id)));             // Wea are making multiple API calls with Promise.aLL()
    console.log(friends);

        //Promise.all(array or iterable) ==> returns a Promise which contains the array of friends

    const formattedfriends = friends.map(
        ({ _id , firstName , lastName , occupation , location , picturePath })=>{               // We are formatting the data that will be sent to the frontend
            return { _id , firstName , lastName , occupation , location , picturePath }
        }
    );
    res.status(200).json(formattedfriends);
    } catch (error) {
        res.status(404).json({ message : error.message});
    }   
};


/* UPDATE */

export const addRemoveFriend = async( req,res)=>{
    try {
        const { id , friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id!== friendId);       // We are copying and saving the array when id!= friendId .Basically we are removing the
            friend.friends = friend.friends.filter((id)=> id !== id);
        }                                                                   // If friend Id is already part of the main user friend list we are removing or filtering the list where who are not friends are shown
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();


        const friends = await Promise.all( user.friends.map ((id)=>User.findById(id)));             // Wea are making multiple API calls with Promise.aLL()

        const formattedfriends = friends.map(
            ({ _id , firstName , lastName , occupation , location , picturePath })=>{               // We are formatting the data that will be sent to the frontend
                return { _id , firstName , lastName , occupation , location , picturePath }
            }
        )

        res.status(200).json(formattedfriends);

    } catch (error) {
        res.status(404).json({ message : error.message});
    }
}