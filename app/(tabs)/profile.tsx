import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/ui/CustomButton";
import { useStore } from "@/data/context/StoreContext";
import { useRouter } from "expo-router";
import { StyleSheet, Image, Platform, SafeAreaView, View } from "react-native";

export default function TabTwoScreen() {
  const { profile, signOut } = useStore();
  console.log("profile", profile);
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <View
          style={{
            height: 80,
            width: 80,
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: { height: 2, width: 4 },
            shadowOpacity: 0.5,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 50,
            marginBottom: 20,
          }}
        >
          <ThemedText type="title">
            {profile?.name.toUpperCase().slice(0, 2)}
          </ThemedText>
          {/* <ThemedText type="subtitle">{profile?.name}</ThemedText> */}
        </View>

        <ThemedText
          type="default"
          style={{ textAlign: "center", marginBottom: 3 }}
        >
          Name: {profile?.name}
        </ThemedText>
        <ThemedText
          type="default"
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          Email: {profile?.email}
        </ThemedText>

        <CustomButton
          title="LogOut"
          bgColor="#D4393C"
          containerStyle={{
            borderRadius: 20,
            paddingVertical: 15,
          }}
          onPress={() => {
            signOut();
            router.push("/(auth)/login");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
