import { createContext } from "react";
import { socket } from '../socket.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const userSocket = socket;

  return (
    <AppContext.Provider value={{socket: userSocket}}>
      {children}
    </AppContext.Provider>
  ); 
};

export default AppContext;