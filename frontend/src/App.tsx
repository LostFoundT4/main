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
import Profile from "./components/ProfilePage";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";

export const App = () => {

    const isLoggedIn = true;

    return (
        <Router>
            <Routes>
                <Route path="/frontend/sign-up" element={<SignUpSide />}></Route>
                <Route path="/frontend/sign-in" element={<SignInSide />}></Route>
                <Route element = {<ProtectedRoute  />}>
                    <Route path="/frontend/home" element={<Home />}></Route>
                    <Route path="/frontend/profile-page" element = {<Profile />}></Route>
                </Route>
            </Routes>
        </Router>
    );
};
