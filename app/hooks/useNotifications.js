import { useEffect, useState, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";

const useNotifications = async () => {
  const [notification, setNotification] = useState({
    request: { content: { data: {} } },
  });
  const [savedNotifications, setSavedNotifications] = useState([]);
  const [pushToken, setPushToken] = useState("");
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    //Initialization
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    getPushToken();

    //Notification Handlers
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        // @ts-ignore
        setNotification(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {}
    );

    return () => {
      // @ts-ignore
      Notifications.removeNotificationSubscription(notificationListener);
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    (async () => {
      //Save the notification to storage
      const data = notification.request.content.data;
      if (data && data.id) {
        //Set default status_id = 0 ==> pendnig
        data.status_id = 0;

        let notifications = JSON.parse(
          await AsyncStorage.getItem("@notifications")
        );

        if (!notifications) {
          notifications = [];
        }

        //Check if this notification exist (by id) or not
        if (!notifications.find((item) => +item.id == +data.id)) {
          notifications.push(data);

          setSavedNotifications(notifications);
          await AsyncStorage.setItem(
            "@notifications",
            JSON.stringify(notifications)
          );
        }
      }
    })();
  }, [notification]);

  //Get the push notification & send it to the server (if you want)
  const getPushToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);

      //Update the push token on storage
      await AsyncStorage.setItem("@expo_push_token", token || "");
      return token;
    } catch (e) {
      alert(e.message);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("notifications", {
        name: "notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  return {
    pushToken,
  };
};

export default useNotifications;
