import {
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  Pressable,
  View,
} from "react-native";

import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useEffect } from "react";
import { useStore } from "@/data/context/StoreContext";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";

export default function TaskDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { taskDetail, setTaskDetail, fetchSingleTask } = useStore();
  useEffect(() => {
    if (!params._id) return;
    const fetchApi = async () => {
      await fetchSingleTask(`${params._id}`);
    };
    fetchApi();
    return () => {
      setTaskDetail(null);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Pressable
        style={{
          height: 50,
          width: 50,
          bottom: 100,
          right: 20,
          position: "absolute",
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: { height: 2, width: 4 },
          shadowOpacity: 0.5,
          elevation: 10,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          // router.navigate("/modal");
          router.navigate({
            pathname: "/modal",
            params: {
              _id: taskDetail?._id,
              // user: task.user,
              // title: task.title,
              // description: task.description,
              // status: task.status,
            },
          });
        }}
      >
        <Feather
          name="edit-3"
          size={20}
          color="black"
          style={{ alignSelf: "center" }}
        />
      </Pressable>
      <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
        <ThemedView
          style={{
            marginTop: 10,
            borderColor: "gray",
            borderWidth: 0.6,
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: { height: 2, width: 4 },
            shadowOpacity: 0.5,
            elevation: 20,
            borderRadius: 15,
          }}
        >
          <ThemedText
            type="subtitle"
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            Title : <ThemedText type="subtitle">{taskDetail?.title}</ThemedText>
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            marginTop: 10,
            borderColor: "gray",
            borderWidth: 0.6,
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: { height: 2, width: 4 },
            shadowOpacity: 0.5,
            elevation: 20,
            borderRadius: 15,
          }}
        >
          <ThemedText
            type="subtitle"
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            Description :{" "}
            <ThemedText type="subtitle">{taskDetail?.description}</ThemedText>
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            marginTop: 10,
            borderColor: "gray",
            borderWidth: 0.6,
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: { height: 2, width: 4 },
            shadowOpacity: 0.5,
            elevation: 20,
            borderRadius: 15,
          }}
        >
          <ThemedText
            type="subtitle"
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            Status :{" "}
            <ThemedText type="subtitle">{taskDetail?.status}</ThemedText>
          </ThemedText>
        </ThemedView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
