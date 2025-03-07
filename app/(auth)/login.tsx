import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/ui/CustomButton";
import CustomTextInput from "@/components/ui/CustomTextInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Alert,
} from "react-native";
import { useStore } from "@/data/context/StoreContext";

// 🛠 Define Schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔄 Define Form Data Type
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, fetchTasks } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 🔹 Handle Form Submission
  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(
        // !__DEV__
        //   ? "http://localhost:5001/api/auth/login"
        //   :
        "https://taskmanager-be-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("result", result);

      if (!response.ok) {
        Alert.alert(result.message || "Something went wrong");
        throw new Error(result.message || "Something went wrong");
      }

      await signIn(result.token, result.user);
      // await fetchTasks();

      router.replace("/(tabs)/(home)");
      console.log("Login Success:", result);
      // 👉 Handle navigation or store authentication token here
    } catch (error) {
      console.error("Login Error:", error);
      // 👉 Show an error message to the user
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                flex: 1,
                marginTop: 40,
                // justifyContent: "center",
              }}
            >
              <ThemedText
                type="title"
                lightColor="#D4393C"
                style={{ textAlign: "left" }}
              >
                Welcome {"\n"}
                <ThemedText type="title">back!</ThemedText>
              </ThemedText>
              <ThemedText
                type="default"
                lightColor="#6E6A7C"
                style={{ marginVertical: 10 }}
              >
                Sign in to access your{" "}
                <ThemedText type="default" lightColor="#D4393C">
                  Task
                </ThemedText>
              </ThemedText>
              {/* Email Input (Controlled) */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    leftIcon={<Feather name="mail" size={22} color="#888" />}
                    containerStyle={{
                      borderRadius: 20,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      marginTop: 10,
                    }}
                    selectionColor={"#000"}
                    value={value}
                    onChangeText={onChange} // ✅ Ensure field updates form state
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.email && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                  {errors.email.message}
                </Text>
              )}
              {/* Password Input (Controlled) */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    placeholder="Password"
                    isPassword
                    leftIcon={
                      <MaterialIcons name="password" size={22} color="#888" />
                    }
                    containerStyle={{
                      borderRadius: 20,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      marginTop: 10,
                    }}
                    selectionColor={"#000"}
                    value={value}
                    onChangeText={onChange} // ✅ Ensure field updates form state
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.password && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                  {errors.password.message}
                </Text>
              )}
              <Link
                href={"/(auth)/forgetpassword"}
                style={{ alignSelf: "flex-end", paddingVertical: 6 }}
              >
                <ThemedText type="default" lightColor="#0a7ea4">
                  Forget Password?
                </ThemedText>
              </Link>
              <CustomButton
                disabled={!isDirty || !isValid}
                title="Sign in"
                bgColor="#D4393C"
                containerStyle={{
                  borderRadius: 20,
                  paddingVertical: 15,
                }}
                onPress={handleSubmit(onSubmit)}
              />
              <View
                style={{
                  marginTop: 25,
                  //   flex: 1,
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ width: "30%", height: 0.5, backgroundColor: "gray" }}
                />
                <ThemedText type="default">Or</ThemedText>
                <View
                  style={{ width: "30%", height: 0.5, backgroundColor: "gray" }}
                />
              </View>
              <ThemedText
                type="default"
                lightColor="#6E6A7C"
                style={{ marginVertical: 10, alignSelf: "center" }}
              >
                Don't have an account?{" "}
                <Link href={"/(auth)/signup"}>
                  <ThemedText type="default" lightColor="#D4393C">
                    Create an account
                  </ThemedText>
                </Link>
              </ThemedText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
