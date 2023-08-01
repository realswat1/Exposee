// UserContext.js
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = () => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
     
    </UserContext.Provider>
  );
};
