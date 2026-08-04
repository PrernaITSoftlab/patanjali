import {createContext,useContext,useEffect,useState} from 'react';
import {read,write} from '../utils/storage';
import {normalizeUser} from '../utils/accessControl';
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>normalizeUser(read('user',null)));useEffect(()=>{if(user)write('user',user)},[user]);const login=(u)=>{const authenticated=normalizeUser(u);setUser(authenticated);write('user',authenticated)};const logout=()=>{setUser(null);localStorage.removeItem('trustlogix:user')};return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
