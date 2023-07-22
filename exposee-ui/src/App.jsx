import './App.css';
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from '../src/components/Mainpage/Main'
import Login from '../src/components/Login/Login';
import Registration from '../src/components/Registration/Registration';
import Profilepage from './components/Profilepage/Profile';
function App() {
  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ <Main /> } />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/profile" element ={<Profilepage />}/>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;