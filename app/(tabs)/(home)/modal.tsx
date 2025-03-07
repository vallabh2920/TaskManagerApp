import {
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomTextInput from "@/components/ui/CustomTextInput";
import CustomButton from "@/components/ui/CustomButton";
import { useStore } from "@/data/context/StoreContext";
import { useLocalSearchParams, useRouter } from "expo-router";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["not started", "ongoing", "completed"]),
});

export default function AddTaskScreen() {
  const { addTask, updateTask } = useStore();
  const params = useLocalSearchParams();
  const router = useRouter();
  const { taskDetail, fetchSingleTask } = useStore();
  const [selectStatus, setSelectStatus] = useState(taskDetail?.status || "");
  useEffect(() => {
    const fetchApi = async () => {
      await fetchSingleTask(`${params._id}`);
    };
    fetchApi();
  }, []);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskDetail?.title || "",
      description: taskDetail?.description || "",
      status: taskDetail?.status || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (taskDetail?._id) {
        const res = await updateTask(taskDetail._id, data);
        console.log("resupadta", res);
      } else {
        const res = await addTask(data);
        console.log("res", res);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15 }}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="Title"
                containerStyle={{
                  borderRadius: 20,
                  padding: 15,
                  marginTop: 10,
                }}
                selectionColor={"#000"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.title?.message}
            </Text>
          )}

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomTextInput
                placeholder="Description"
                containerStyle={{
                  borderRadius: 20,
                  padding: 15,
                  marginTop: 10,
                  minHeight: 240,
                }}
                selectionColor={"#000"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.description && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.description?.message}
            </Text>
          )}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {["not started", "ongoing", "completed"].map((status) => {
              return (
                <CustomButton
                  key={status}
                  onPress={() => {
                    setSelectStatus(status);
                    setValue("status", status);
                  }}
                  title={status}
                  bgColor={
                    status === "not started"
                      ? "#BDBDBD"
                      : status === "ongoing"
                      ? "#1E88E5"
                      : "#43A047"
                  }
                  containerStyle={{
                    width: "auto",
                    borderRadius: 20,
                    paddingVertical: 10,
                    marginTop: 10,
                    borderBottomWidth: selectStatus === status ? 4 : undefined,
                    borderBottomColor:
                      selectStatus === status ? "gray" : undefined,
                  }}
                />
              );
            })}
          </View>
          {errors.status && (
            <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
              {errors.status?.message}
            </Text>
          )}

          <CustomButton
            title="Add Task"
            bgColor="#D4393C"
            containerStyle={{
              borderRadius: 20,
              paddingVertical: 15,
              marginTop: 10,
            }}
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
