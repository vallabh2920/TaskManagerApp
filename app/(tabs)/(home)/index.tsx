import {
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  View,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import ListItem from "@/components/ui/ListItem";
import { useStore } from "@/data/context/StoreContext";
import { StatusBar } from "expo-status-bar";
const TITLES = [
  "Record the dismissible tutorial 🎥",
  "Leave 👍🏼 to the video",
  "Check YouTube comments",
  "Subscribe to the channel 🚀",
  "Leave a ⭐️ on the GitHub Repo",
];

interface TaskInterface {
  _id: string;
  user: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { fetchTasks, tasks, fetchSingleTask, deleteTask } = useStore();
  const [tasksData, setTasksData] = useState(tasks);
  const [refreshing, setRefreshing] = useState(false);

  const onDismiss = useCallback(async (task: TaskInterface) => {
    await deleteTask(task._id);
  }, []);
  const onEdit = useCallback(async (task: TaskInterface) => {
    await fetchSingleTask(`${task?._id}`);
    router.navigate({
      pathname: "/modal",
      params: {
        _id: task?._id,
        // user: task.user,
        // title: task.title,
        // description: task.description,
        // status: task.status,
      },
    });
  }, []);

  const _onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    // router.reload();
    const api = async () => {
      const res = await fetchTasks();
      console.log("res", res);
    };
    api();
  }, []);

  const scrollRef = useRef(null);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ThemedText type={"subtitle"} style={{ alignSelf: "center" }}>
        Task List
      </ThemedText>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, marginBottom: 50 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
        }
      >
        {tasks && tasks.length > 0 ? (
          tasks.map((task, index) => (
            <ListItem
              simultaneousHandlers={scrollRef}
              key={index}
              task={task}
              onDismiss={() => onDismiss(task)}
              onEdit={() => onEdit(task)}
            />
          ))
        ) : (
          <View
            style={{
              height: 300,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            <ThemedText type={"subtitle"} style={{ alignSelf: "center" }}>
              No Scheduled Tasks
            </ThemedText>
          </View>
        )}
      </ScrollView>

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
          router.navigate("/modal");
        }}
      >
        <Feather
          name="plus"
          size={24}
          color="black"
          style={{ alignSelf: "center" }}
        />
      </Pressable>
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
