import { Outlet , Navigate} from "react-router-dom";
import {useState , useEffect} from "react";
import {useContext} from "react";
import {UserIDContext , UserNameContext} from "../../utils/contextConfig"
import AxiosInstance from "../../utils/axiosInstance";

const useAuth  = () =>{
    const {contextID, setContextID} = useContext(UserIDContext)
    const {contextName, setContextName} = useContext(UserNameContext)
    if(localStorage.getItem('authToken') === undefined || localStorage.getItem('authToken') === null){
        return false;
    }
    AxiosInstance.get("/api/auth/get-user",{
        headers: {
          "Authorization": "Token " + localStorage.getItem('authToken')
        }
    }).then((response) => {
        setContextID(response.data.id)
        setContextName(response.data.username)
    })
    return true;
}

export default function ProtectedRoutes(){
    const isAuth = useAuth()
    return isAuth ? <Outlet /> : <Navigate to="/frontend/sign-in" />
}