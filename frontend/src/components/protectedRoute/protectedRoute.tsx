import { Outlet , Navigate} from "react-router-dom";
import {useState , useEffect} from "react";

const useAuth  = () =>{
    console.log(localStorage.getItem('authToken'))
    if(localStorage.getItem('authToken') === undefined || localStorage.getItem('authToken') === null){
        return false;
    }
    return true;
}

export default function ProtectedRoutes(){
    const isAuth = useAuth()
    return isAuth ? <Outlet /> : <Navigate to="/frontend/sign-in" />
}