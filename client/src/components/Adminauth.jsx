import AnimationWrapper from "../common/AnimationWrapper";
import InputBox from "./inputBox";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {
     const location = useLocation();
  const serverRoute = type === "signin" ? "/signin" : "/signup";
  const { setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const userAuthThroughServer = async (serverRoute, formData) => {
    try {
      const response = await axios({
        method: "POST",
        url: import.meta.env.VITE_SERVER_DOMAIN + serverRoute,
        data: formData,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.status === 200 && response.data) {
        storeInSession("user", JSON.stringify(response.data));
        setUserAuth(response.data);
        toast.success(
          type === "signin" ? "Welcome back!" : "Account created successfully!"
        );

        navigate("/home"); // <---- Move navigate here to ensure it runs right after setting state
      } else {
        throw new Error(response.data?.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Full error details:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.error || "Authentication failed";
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error(
          "Unable to connect to server. Please check your connection."
        );
      } else {
        toast.error("An error occurred while processing your request.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (
      !data.email?.trim() ||
      !data.password?.trim() ||
      (type !== "signin" && !data.fullname?.trim())
    ) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (
      type !== "signin" &&
      (data.fullname.length < 3 || data.fullname.length > 20)
    ) {
      toast.error("Full name must be between 3 and 20 characters");
      return;
    }

    const cleanData = { ...data, email: data.email.trim().toLowerCase() };
    await userAuthThroughServer(serverRoute, cleanData);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "signin"
              ? "Welcome back admin"
              : "Join us today as admin"}
          </h1>

          {type !== "signin" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button className="btn-dark center mt-14" type="submit">
            {type === "signin" ? "Sign In" : "Create Account"}
          </button>

          <p className="mt-6 text-dark-grey text-xl text-center">
            {/* {type === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              to={type === "signin" ? "/signup" : "/signin"}
              className="underline text-black text-xl ml-1"
            >
              {type === "signin" ? "Join us" : "Sign in"}
            </Link> */}
          </p>
          {location.pathname !== "/signin" && ( 
            <Link to="/admin/signin">
              <p>hello</p>
            </Link>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
