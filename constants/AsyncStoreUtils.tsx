import AsyncStorage from "@react-native-async-storage/async-storage";

const loginUser = async (token: string) => {
  try {
    await AsyncStorage.setItem("jwtToken", token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("jwtToken");
    // Navigate to login screen (use router or navigation)
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export { loginUser, logoutUser };
