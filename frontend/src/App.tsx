import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    redirect,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignInSide from "./components/SignInSide";
import SignUpSide from "./components/SignUpSide";
import ProfilePage from "./components/ProfilePage";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="frontend/" element={<LandingPage />}></Route>
                <Route path="frontend/sign-in" element={<SignInSide />}></Route>
                <Route path="frontend/sign-up" element={<SignUpSide />}></Route>
                <Route path="frontend/profile-page" element={<ProfilePage />}></Route>
            </Routes>
        </Router>
    );
};
