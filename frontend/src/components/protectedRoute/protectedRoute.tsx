import { Outlet , Navigate} from "react-router-dom";
import {useState , useEffect} from "react";

const useAuth  = () =>{
    return true;
}

export default function ProtectedRoutes(){
    const isAuth = useAuth()
    return isAuth ? <Outlet /> : <Navigate to="/frontend/sign-in" />
}