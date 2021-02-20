import { API_URI } from "../config";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

const useCheckToken = () => {

  const checkToken = async (token) => {

    try {
      //Get the expo push token
      const pushToken = await AsyncStorage.getItem("@expo_push_token");
      if (!pushToken) {
        alert("يرجي المحاولة مرة أخري");
        return false;
      }

      //Send the request
      let response = await axios.get(
        `${API_URI}/token?token=${token}&expo_token=${pushToken}`
      );

      let status = response.status;
      let data = await response.data;

      if (status !== 200) {
        alert("حدث خطأ ما ، أو الرمز الذي قرأته غير صالح");
        return false;
      } else {
        if (data.message != "ok") {
          alert("حدث خطأ ما ، أو الرمز الذي قرأته غير صالح");
          return false;
        }
      }

      //All is good
      await AsyncStorage.setItem("@access_token", token);

      return true;
    } catch (e) {
      alert(e.message);
    }
  };

  return {
    checkToken,
  };
};

export default useCheckToken;
