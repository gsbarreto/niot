import React, { useState, useEffect, useContext, createContext } from "react";
import api from "./api";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = async (email, password) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      delete data.success;
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };
  const signup = async (name, email, password) => {
    try {
      await api.post("/users", {
        name,
        email,
        password,
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };
  const signout = () => {
    return setUser(null);
  };
  //   const sendPasswordResetEmail = (email) => {
  //     return firebase
  //       .auth()
  //       .sendPasswordResetEmail(email)
  //       .then(() => {
  //         return true;
  //       });
  //   };
  //   const confirmPasswordReset = (code, password) => {
  //     return firebase
  //       .auth()
  //       .confirmPasswordReset(code, password)
  //       .then(() => {
  //         return true;
  //       });
  //   };
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    // const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     setUser(user);
    //   } else {
    //     setUser(false);
    //   }
    // });
    // Cleanup subscription on unmount
    // return () => unsubscribe();
  }, []);
  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    // sendPasswordResetEmail,
    // confirmPasswordReset,
  };
}
