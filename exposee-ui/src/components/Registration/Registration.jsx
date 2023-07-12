import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import '../Registration/Registration.css'
import { UserContext } from '../../UserContext';

=======

import '../Registration/Registration.css'
import { UserContext } from '../../UserContext';


>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


<<<<<<< HEAD
=======

>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
  // const updateUser  = 
  // useContext(UserContext);
  //const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the signup API request
<<<<<<< HEAD
      const response = await fetch(`http://localhost:3000/user`, {
=======

      const response = await fetch(`http://localhost:3000/user`, {

>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
<<<<<<< HEAD
=======

>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
        body: JSON.stringify({ username: username, email: email, password: password}),
        credentials: 'include'
        
      });
<<<<<<< HEAD
console.log("HWY",response);
=======

>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;

        console.log('Signup successful');

        // Reset form fields
        setUsername('');
        setEmail('');
        setPassword('');

        // Update the user context
<<<<<<< HEAD
        useContext(loggedInUser);

=======

        useContext(loggedInUser);


>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
        // Navigate to the home page after successful login
        navigate('/');
      } else {
        // Handle signup failure case
        alert('Signup failed');
      }
    } catch (error) {
      // Handle any network or API request errors
      alert('Signup failed: ' + error);
    }
  };

  return (
    
    <div className="registration-form-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
<<<<<<< HEAD
=======

>>>>>>> 5ff522a4274442e80a92082320eae2e03e9395d9
         <div className="form-group"> 
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <p>
          {/* Already have an account? <Link to="/login">Log In</Link> */}
        </p>
      </form>
    </div>
  )
};

export default Registration;