import React, { createContext, useState } from 'react'

const authContext = createContext();
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(false);

    
  return (
    <authContext.Provider value={user}>
        {children}
    </authContext.Provider>
  )
}
