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
import Profile from "./components/ProfilePage";
import EditProfile from "./components/EditProfile";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="frontend/sign-in" element={<SignInSide />}></Route>
        <Route path="frontend/sign-up" element={<SignUpSide />}></Route>
        <Route path="frontend/home" element={<Home />}></Route>
        <Route path="frontend/profile-page" element={<Profile />}></Route>
        <Route path="frontend/edit-profile" element={<EditProfile />}></Route>
      </Routes>
    </Router>
  );
};
