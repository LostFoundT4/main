import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import SignInSide from "./components/Pages/SignIn/SignInSide";
import SignUpSide from "./components/Pages/SignUp/SignUpSide";
import Home from "./components/Pages/Home/Home";
import EditProfile from "./components/Pages/Profile/EditProfile";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
import { useState } from "react";
import MyListings from "./components/Pages/MyListing/MyListings";
import {UserIDContext,UserNameContext} from "./utils/contextConfig"
import SignUpComplete from "./components/Pages/SignUp/SignUpComplete";
import SignUpVerification from "./components/Pages/SignUp/SignUpVerification";
import ForgotPassword from "./components/Pages/SignIn/ForgotPassword";
import PasswordReset from "./components/Pages/SignIn/PasswordReset";

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