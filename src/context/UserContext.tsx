import React, { createContext, useContext, useEffect } from "react";
import SecureStorage from "../utils/SecureStorage";
import { LSK_IS_LOGGED_IN } from "../constants/local-storage-constants";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
  // NOTE : Additionally userType and user data can be kept here
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return userContext;
};

export const UserProvider = ({ children }: any) => {
  const [isLoggedIn, _setIsLoggedIn] = React.useState(false);



    const setIsLoggedIn = (value: boolean) => {
        SecureStorage.setItem(LSK_IS_LOGGED_IN, +value)
        _setIsLoggedIn(value)
    }

  const logout = () => {
    SecureStorage.clearAll();
    _setIsLoggedIn(false);
  };

  useEffect(() => {
    const tempIsLoggedIn = SecureStorage.getItem(LSK_IS_LOGGED_IN);
    _setIsLoggedIn(+(tempIsLoggedIn ?? 0) === 1);
  }, []);

  const contextValue: UserContextType = {
    isLoggedIn,
    setIsLoggedIn,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
