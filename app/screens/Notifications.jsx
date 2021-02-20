import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { usePermissions, NOTIFICATIONS } from "expo-permissions";
import { Header, NotificationBox } from "../components";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AsyncStorage from "@react-native-community/async-storage";
import { Colors } from "../config";
import { useAppContext } from "../providers";

const Tab = createMaterialTopTabNavigator();

const Notifications = () => {
  const [permission, askForPermission, getPermission] = usePermissions(
    NOTIFICATIONS,
    {
      ask: true,
    }
  );

  useEffect(() => {
    getNotificationsPermissions();
  }, []);

  const getNotificationsPermissions = () => {
    if (!permission || permission.status !== "granted") {
      askForPermission();
    }
    if (
      permission &&
      permission.status == "denied" &&
      permission.canAskAgain == false
    ) {
      alert(
        "يبدو أنك لم تمنح اذن الوصول الي الاشعارات ، يرجي التوجه الي اعدادات التطبيق ومنح اذن الوصول الي الاشعارات"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="الإشعارات" />
      <NotificationsNavigation />
    </View>
  );
};

/*************************************************************/

const NotificationsNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Pending"
      tabBarOptions={{ labelStyle: { fontFamily: "Cairo-SemiBold" } }}
    >
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="Finished" component={Finished} />
    </Tab.Navigator>
  );
};

/*************************************************************/

const Pending = () => {
  const { savedNotifications } = useAppContext();

  const [pendingNotifications, setPendingNotifications] = useState(
    savedNotifications.filter((item) => +item.status_id == 0) || []
  );

  return (
    <View style={styles.listContainer}>
      {pendingNotifications.length != 0 ? (
        <FlatList
          data={pendingNotifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <NotificationBox {...item} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
        />
      ) : (
        <Text style={styles.noticeText}>لا يوجد اشعارت حاليا</Text>
      )}
    </View>
  );
};

/*************************************************************/

const Finished = () => {
  const { savedNotifications } = useAppContext();

  const [finishedNotifications, setFinishedNotifications] = useState(
    savedNotifications.filter((item) => +item.status_id != 0) || []
  );

  return (
    <View style={styles.listContainer}>
      {finishedNotifications.length != 0 ? (
        <FlatList
          data={finishedNotifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => <NotificationBox {...item} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
        />
      ) : (
        <Text style={styles.noticeText}>لا يوجد اشعارت حاليا</Text>
      )}
    </View>
  );
};

/*************************************************************/

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {},
  noticeText: {
    fontFamily: "Cairo-SemiBold",
    color: Colors.black,
    fontSize: 20,
    textAlign: "center",
    marginTop: 50,
  },
});

export default Notifications;
