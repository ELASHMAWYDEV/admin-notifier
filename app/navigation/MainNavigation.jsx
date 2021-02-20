import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QrReader, Notifications } from "../screens";
import { useAuthContext } from "../providers";

const Stack = createStackNavigator();

const MainNavigation = () => {
  const { isLoggedIn } = useAuthContext();

  console.log(isLoggedIn);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? "Notifications" : "QrReader"}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Notifications" component={Notifications} />
        ) : (
          <Stack.Screen name="QrReader" component={QrReader} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
