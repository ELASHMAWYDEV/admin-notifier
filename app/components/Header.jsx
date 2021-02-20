import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Colors } from "../config";

const Header = ({ title = "" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: StatusBar.currentHeight + 25,
    paddingBottom: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: "Cairo-Regular",
    color: Colors.white,
    textAlign: "center",
  },
});

export default Header;
