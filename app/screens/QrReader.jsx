import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { usePermissions, CAMERA } from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Header } from "../components";
import { Colors, API_URI } from "../config";
import axios from "axios";
import { useCheckToken } from "../hooks";
import { useAuthContext } from "../providers";

const QrReader = ({ navigation }) => {
  const { checkToken } = useCheckToken();
  const { setIsLoggedIn } = useAuthContext();

  const [permission, askForPermission, getPermission] = usePermissions(CAMERA, {
    ask: true,
  });

  const [scanned, setScanned] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);

  useEffect(() => {
    if (!permission || permission.status !== "granted") {
      askForPermission();
    }
    if (
      permission &&
      permission.status == "denied" &&
      permission.canAskAgain == false
    ) {
      alert(
        "يبدو أنك لم تنح اذن الوصول الي الكاميرا ، يرجي التوجه الي اعدادات التطبيق ومنح اذن الوصول الي الكاميرا"
      );
    }
  }, []);

  const readQrCode = async ({ data }) => {
    try {
      setScanned(true);
      setLoadingVisible(true);
      const tokenValid = await checkToken(data);
      setScanned(false);
      setLoadingVisible(false);
      if (tokenValid) {
        setIsLoggedIn(true);
      }
    } catch (e) {
      setScanned(false);
      setLoadingVisible(false);
      alert(e.message);
    }
  };

  return (
    <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Header title="تسجيل الدخول" />
      <Text style={styles.noticeText}>من فضلك قم بقراءة ال Qr Code</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : readQrCode}
        style={{ flex: 1 }}
      />
      <Modal transparent={true} animationType="fade" visible={loadingVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size={45} />
            <Text style={styles.loadingText}>جاري تسجيل الدخول</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.black,
    fontSize: 24,
    marginLeft: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 45,
  },
  noticeText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default QrReader;
