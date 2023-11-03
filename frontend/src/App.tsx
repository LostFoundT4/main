import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  redirect,
} from "react-router-dom";
import SignInSide from "./components/SignInSide";
import SignUpSide from "./components/SignUpSide";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import Profile from "./components/Dashboard";
import * as React from "react";
import AxiosInstance from "./utils/axiosInstance";
import { useEffect, useState } from "react";
import MyListings from "./components/MyListings";
import {UserIDContext,UserNameContext} from "./utils/contextConfig"
import SignUpComplete from "./components/SignUpComplete";
import SignUpVerification from "./components/SignUpVerification";
import ForgotPassword from "./components/ForgotPassword";

export const App = () => {

    //Using useContext for global Varables
    const [contextID, setContextID] = useState<string | null>(null)
    const [contextName, setContextName] = useState<string | null>(null)
    
    return (
        <Router>
            <UserIDContext.Provider value={{contextID, setContextID}}>
            <UserNameContext.Provider value={{contextName, setContextName}}>
            <Routes>
                <Route path="/frontend/sign-up" element={<SignUpSide />}></Route>
                <Route path="/frontend/sign-in" element={<SignInSide />}></Route>
                <Route path="/frontend/sign-up-complete" element={<SignUpComplete />}></Route>
                <Route path="/frontend/email-verification" element={<SignUpVerification />}></Route>
                <Route path="/frontend/forgot-password" element={<ForgotPassword />}></Route>
                <Route element = {<ProtectedRoute />}>
                    <Route path="/frontend/home" element={<Home />}></Route>
                    <Route path="/frontend/dashboard" element={<Profile />}></Route>
                    <Route path="/frontend/edit-profile" element={<EditProfile />}></Route>
                    <Route path="/frontend/my-listings" element={<MyListings />}></Route>
                </Route>
            </Routes>
            </UserNameContext.Provider>
            </UserIDContext.Provider>
        </Router>
    );
};