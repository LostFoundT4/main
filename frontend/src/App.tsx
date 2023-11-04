import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignInSide from "./components/SignInSide";
import SignUpSide from "./components/SignUpSide";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import { useState } from "react";
import MyListings from "./components/MyListings";
import {UserIDContext,UserNameContext} from "./utils/contextConfig"
import SignUpComplete from "./components/SignUpComplete";
import SignUpVerification from "./components/SignUpVerification";
import ForgotPassword from "./components/ForgotPassword";
import PasswordReset from "./components/PasswordReset";

export const App = () => {

    //Using useContext for global Varables
    const [contextID, setContextID] = useState<string | null>(null)
    const [contextName, setContextName] = useState<string | null>(null)

    return (
        <Router>
            <UserIDContext.Provider value={{contextID, setContextID}}>
            <UserNameContext.Provider value={{contextName, setContextName}}>
            <Routes>
                <Route path="*" element={<SignInSide />}></Route>
                <Route path="/sign-up" element={<SignUpSide />}></Route>
                <Route path="/sign-in" element={<SignInSide />}></Route>
                <Route path="/email-verification" element={<SignUpVerification />}></Route>
                <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                <Route path="/password-reset" element={<PasswordReset />}></Route>
                <Route element = {<ProtectedRoute />}>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/edit-profile" element={<EditProfile />}></Route>
                    <Route path="/my-listings" element={<MyListings />}></Route>
                </Route>
            </Routes>
            </UserNameContext.Provider>
            </UserIDContext.Provider>
        </Router>
    );
};