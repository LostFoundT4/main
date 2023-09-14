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
import Home from "./components/Home";

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="frontend/sign-in" element={<SignInSide />}></Route>
                <Route path="frontend/sign-up" element={<SignUpSide />}></Route>
                <Route path="frontend/home" element={<Home />}></Route>
            </Routes>
        </Router>
    );
};
