import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ title: "Add task", presentation: "modal" }}
      />
      <Stack.Screen
        name="taskdetail"
        options={{
          title: "Task Details",

          headerLeft: () => (
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color="gray" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
