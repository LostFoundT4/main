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
import AxiosInstance from "./axios/axiosInstance";
import { useEffect, useState } from "react";
import MyItems from "./components/MyItems";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/frontend/sign-up" element={<SignUpSide />}></Route>
                <Route path="/frontend/sign-in" element={<SignInSide />}></Route>
                <Route element = {<ProtectedRoute />}>
                    <Route path="/frontend/home" element={<Home />}></Route>
                    <Route path="/frontend/dashboard" element={<Profile />}></Route>
                    <Route path="/frontend/edit-profile" element={<EditProfile />}></Route>
                    <Route path="/frontend/my-items" element={<MyItems />}></Route>
                </Route>
            </Routes>
        </Router>
    );
};