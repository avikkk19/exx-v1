import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CrimeReportingHub from "./components/CrimeReportingHub";
import UserAuthForm from "./components/UserAuthForm";
import { lookInSession } from "./common/session";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user from session only on the first mount
    const userInSession = lookInSession("user");
    setUserAuth(
      userInSession ? JSON.parse(userInSession) : { access_token: null }
    );

    // Redirect to sign in if not logged in
    if (!userInSession) {
      navigate("/signin");
    }
  }, []); // No dependency here to prevent re-render loop

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<UserAuthForm/>} />
        <Route path="/home" element={<CrimeReportingHub/>} />

        <Route path="/signin" element={<UserAuthForm type="signin" />} />
        <Route path="/signup" element={<UserAuthForm type="signup" />} />
        <Route path="/admin/signin" element={<UserAuthForm type="signin" />} />
        <Route path="/admin/signup" element={<UserAuthForm type="signup" />} />
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
