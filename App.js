import React from "react";
import AppProvider from "./app/providers";
import { useFonts } from "expo-font";
import MainNavigation from "./app/navigation/MainNavigation";
import { useNotifications } from "./app/hooks";

const App = () => {
  const [fontsLoaded] = useFonts({
    // @ts-ignore
    "Cairo-Regular": require("./app/assets/fonts/Cairo-Regular.ttf"),
    // @ts-ignore
    "Cairo-SemiBold": require("./app/assets/fonts/Cairo-SemiBold.ttf"),
    // @ts-ignore
    "Cairo-Bold": require("./app/assets/fonts/Cairo-Bold.ttf"),
  });

  useNotifications();
  return (
    <AppProvider>
      {fontsLoaded && (
        <>
          <MainNavigation />
        </>
      )}
    </AppProvider>
  );
};

export default App;
