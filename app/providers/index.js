import React, { createContext, useContext, useState, useEffect } from "react";
import { useCheckToken } from "../hooks";
import AsyncStorage from "@react-native-community/async-storage";

const AppContext = createContext(null);
const AuthContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
export const useAuthContext = () => useContext(AuthContext);

const AppProvider = ({ children }) => {
  const { checkToken } = useCheckToken();
  const [savedNotifications, setSavedNotifications] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem("@access_token");
      if (accessToken) {
        const tokenValid = await checkToken(accessToken);
        tokenValid ? setIsLoggedIn(true) : setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
      }

      //Get notifications
      const notifications = JSON.parse(
        await AsyncStorage.getItem("@notifications")
      );

      if (notifications && notifications.length != 0) {
        setSavedNotifications(notifications);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (savedNotifications && savedNotifications.length == 0) {
        setSavedNotifications([]);
        await AsyncStorage.setItem("@notifications", JSON.stringify([]));
      } else {
        setSavedNotifications(savedNotifications);
        await AsyncStorage.setItem(
          "@notifications",
          JSON.stringify(savedNotifications)
        );
      }
    })();
  }, [savedNotifications]);

  return (
    <AppContext.Provider value={{ savedNotifications, setSavedNotifications }}>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {children}
      </AuthContext.Provider>
    </AppContext.Provider>
  );
};

export default AppProvider;
