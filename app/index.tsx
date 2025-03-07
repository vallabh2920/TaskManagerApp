import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/ui/CustomButton";
import { Link } from "expo-router";
import { Image, SafeAreaView, Text, View } from "react-native";

export default function OnboaringScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "space-between",
      }}
    >
      <Image
        source={require("@/assets/images/onboarding.png")}
        style={{ height: 500, width: "80%", alignSelf: "center" }}
        resizeMode="contain"
      />

      <ThemedText
        type="title"
        style={{
          width: "70%",
          textAlign: "center",
          alignSelf: "center",
          color: "#000",
        }}
      >
        Task Management & To-Do List
      </ThemedText>
      <ThemedText
        type="default"
        style={{
          width: "80%",
          textAlign: "center",
          alignSelf: "center",
        }}
      >
        This productive tool is designed to help you better manage your task
        project-wise conveniently!
      </ThemedText>

      <CustomButton
        title="Get Started"
        href={"/(auth)/login"}
        bgColor="#D4393C"
        containerStyle={{
          width: "90%",
          alignSelf: "center",
          marginBottom: 20,
        }}
      />
    </SafeAreaView>
  );
}
