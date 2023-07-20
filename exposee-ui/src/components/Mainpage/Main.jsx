import "./main.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext"; 
import { Link } from "react-router-dom";

function Main() {
  const {user, updateUser} = useContext(UserContext);
  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div className="main">
      <header className="header">
         <div className="user-info"> 
           {user ? ( 
            <>
              <span>Hi {user.username}! |</span>
               <Link to= "/profile"> Go to profile Page</Link> 
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
          </div>
      </header>
    </div>
  );
}

export default Main;
