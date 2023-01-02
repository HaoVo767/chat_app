import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/configure";
import { useEffect, createContext } from "react";
import { message } from "antd";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  console.log("tới đây");
  useEffect(() => {
    const unsubcribed = auth.onAuthStateChanged((user) => {
      console.log({ user });
      if (user) {
        const { displayName } = user;
        message.success("hello  " + displayName);
        navigate("/");
      } else {
        navigate("/login");
        console.log("chuyển tới login");
      }
    });

    //clean function
    return () => {
      unsubcribed();
    };
  }, [navigate]);
  return <>children</>;
}

export default AuthProvider;
