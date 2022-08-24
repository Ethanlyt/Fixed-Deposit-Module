import React,{useEffect, useState} from 'react'
import myAPI from '../API/apicreate'

export const UserContext = React.createContext(
    {
        // name:"",
        userId:"",
        role:"",
        auth: false,
    }
);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        // name: "",
        userId: "",
        role:"",
        auth: false,
    });

    const login = (id,role) => {
        setUser((user) => ({
			// name: name,
			userId: id,
			role: role,
			auth: true,
		}));
    };

    const logout = () => {
        setUser((user) => ({
			// name: "",
			userId: "",
			role: "",
			auth: false,
        }));
    };
        
    

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};