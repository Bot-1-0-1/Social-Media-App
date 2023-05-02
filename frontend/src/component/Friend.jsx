import React from 'react';
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from '../states/state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';


const Friend = ( { friendId , name , subtitle ,userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate =  useNavigate();
    const { _id } = useSelector((state)=>state.user);
    const token = useSelector((state)=> state.token);
    const friends = useSelector((state)=>state.user.friends);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light; 
    const primaryDark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends.find((friend)=> friend._id === friendId);

    const patchFriend = async() => {
        const response = await fetch(`http://localhost:3001/users/${_id}/${friendId}`,                                  /// For addinfg and removing the friend we need the id of the user and the friend to be added
        {
            method : "PATCH",
            header : {
                Authorization : `Bearer ${token}`,
                "Content-Type":"application/json"
            }
        }
        );
        const data = await response.json();
        dispatch(setFriends({ friends : data}));
    };

    return (
        <FlexBetween>
        <FlexBetween gap="1rem">
            <UserImage image ={userPicturePath } size="55px" />
            <Box 
                onClick={()=>{
                    navigate(`/profile/${friendId}`);
                    navigate(0);                                                                                     // IMP :: If you go to one person's profile and then go to another person's profile
                 }}>
                    
                    <Typography color={main} variant="h5"
                        fontWeight="500"
                        sx={{
                            "&: hover": {
                                color : palette.primary.light,
                                cursor : "ppointer"
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
            </Box>                                                                                           {/*Then the url changes but the components doesn't re renders */} {/* Hence we are going to the another person's page and refreshing it*/}
        </FlexBetween>
        <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
            {isFriend ? (
                <PersonRemoveOutlined sx={{ color: primaryDark }}/>            
            ):(<PersonAddOutlined sx={{ color : primaryDark}}/>)}
      </IconButton>
        </FlexBetween>
        
    )
}

export default Friend;