import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Colors } from "../config";
import { useAppContext } from "../providers";

const NotificationBox = ({
  id = 0,
  amount = 235,
  sender_name = "علي عبدالله",
  sender_bank = "الأهلي",
  sender_account_number = "55626x11",
  transaction_id = 53,
  received_bank = "الجارحي",
  created_at = "09/05/2021",
  status_id = 0,
}) => {
  const { savedNotifications, setSavedNotifications } = useAppContext();

  const confirmAccept = (accept = true) => {
    Alert.alert(
      accept ? "قبول التحويل" : "رفض التحويل",
      accept
        ? "هل أنت متأكد من أنك تريد الموافقة علي التحويل ؟"
        : "هل أنت متأكد من أنك تريد رفض التحويل ؟",
      [
        {
          text: "الغاء",
          onPress: () => null,
          style: "cancel",
        },
        { text: "موافق", onPress: () => modifyNotification(accept) },
      ],
      { cancelable: false }
    );
  };

  const modifyNotification = async (accept) => {
    try {
      let notifications;
      accept
        ? (notifications = savedNotifications.map((item) => {
            if (+item.id == +id) {
              item.status_id = 1;
              return item;
            }
          }))
        : (notifications = savedNotifications.map((item) => {
            if (+item.id == +id) {
              item.status_id = 2;
              return item;
            }
          }));

      setSavedNotifications(notifications);
    } catch (e) {
      alert(e.message);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "حذف بشكل نهائي",
      "هل أنت متأكد من أنك تريد حذف هذا الاشعار ؟\nلن تتمكن من اجراء أي تعديل عليه اذا قمت بحذفه",
      [
        {
          text: "الغاء",
          onPress: () => null,
          style: "cancel",
        },
        { text: "موافق", onPress: () => deleteNotification() },
      ],
      { cancelable: false }
    );
  };
  const deleteNotification = async () => {
    try {
      let notifications;

      notifications = savedNotifications.filter((item) => +item.id != +id);

      setSavedNotifications(notifications);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        قام {sender_name} بتحويل مبلغ {amount} من بنك {sender_bank} الي بنك{" "}
        {received_bank} ورقم الحساب {sender_account_number}
      </Text>
      {status_id == 0 ? (
        <View style={styles.btnsContainer}>
          <TouchableNativeFeedback
            onPress={() => confirmAccept(false)}
            useForeground
          >
            <View
              style={[
                styles.btnContainer,
                { backgroundColor: Colors.red, borderColor: Colors.darkRed },
              ]}
            >
              <Text style={styles.btnText}>رفض</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={() => confirmAccept()}
            useForeground
          >
            <View style={styles.btnContainer}>
              <Text style={styles.btnText}>قبول</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      ) : (
        <View style={styles.btnsContainer}>
          {status_id == 1 ? (
            <Text style={[styles.btnText, { color: Colors.green }]}>
              تم قبول المعاملة
            </Text>
          ) : (
            <Text style={[styles.btnText, { color: Colors.green }]}>
              تم قبول المعاملة
            </Text>
          )}

          <TouchableNativeFeedback onPress={confirmDelete} useForeground>
            <View
              style={[
                styles.btnContainer,
                { backgroundColor: Colors.red, borderColor: Colors.darkRed },
              ]}
            >
              <Text style={styles.btnText}>حذف</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    elevation: 8,
    borderRadius: 8,
  },
  description: {
    fontFamily: "Cairo-Regular",
    fontSize: 18,
    padding: 15,
    paddingVertical: 25,
    borderRadius: 8,
  },
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
  },
  btnContainer: {
    backgroundColor: Colors.green,
    borderWidth: 1,
    borderColor: Colors.darkGreen,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 7,
    overflow: "hidden",
    width: "45%",
    elevation: 3,
  },
  btnText: {
    fontFamily: "Cairo-Regular",
    fontSize: 20,
    color: Colors.white,
  },
});

export default NotificationBox;
