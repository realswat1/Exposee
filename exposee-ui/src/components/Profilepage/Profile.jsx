import "./Profile.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext"; 
import {Link} from "react-router-dom";
import axios from "axios";

const Profilepage = ()=> {
    const {user, setUser} = useContext(UserContext);
    useEffect (() => {
        const fetchUserProfile = async ()=>{
        try {
            const response = await fetch(`http://localhost:3000/profile/${user.id}`);
        }catch(error){
            console.error('Error fetching user profile: ', error);
        }
    };
    fetchUserProfile();
    }, []);
    const handleBroadcast = async () => {
        try {
            const response = await fetch ('/broadcast');
            console.log(Response.data);
        }catch (error){
            console.error('Error going live: ', error);
        }
    }; console.log(user.profilePicture)
    if (!user){
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1>Profile Page</h1>
            <div>
                <h2>User Information</h2>
                <div>
                    <img src={user.profilePicture} alt="Profile" />
                </div>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <button onClick= {handleBroadcast}>Broadcast</button>
            <Link to= "/"> GET INSPIRED</Link>
        </div>
    );    
};
export default Profilepage;