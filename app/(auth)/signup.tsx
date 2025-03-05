import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/ui/CustomButton";
import CustomTextInput from "@/components/ui/CustomTextInput";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";

// 🛠 Define Schema with Zod
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 🔄 Define Form Data Type
type SignUpForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // 🔹 Handle Form Submission
  const onSubmit = (data: SignUpForm) => {
    console.log("Login Data:", data);
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
                Hello {"\n"}
                <ThemedText type="title">there!</ThemedText>
              </ThemedText>
              <ThemedText
                type="default"
                lightColor="#6E6A7C"
                style={{ marginVertical: 10 }}
              >
                Create an account to access your{" "}
                <ThemedText type="default" lightColor="#D4393C">
                  Task
                </ThemedText>
              </ThemedText>
              {/* Name Input (Controlled) */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextInput
                    placeholder="Name"
                    leftIcon={<Feather name="user" size={22} color="#888" />}
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
              {errors.name && (
                <Text style={{ color: "red", fontSize: 12, marginTop: 2 }}>
                  {errors.name.message}
                </Text>
              )}
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
                title="Sign up"
                bgColor="#D4393C"
                onPress={handleSubmit(onSubmit)}
                containerStyle={{
                  borderRadius: 20,
                  paddingVertical: 15,
                }}
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
                Already have an account?{" "}
                <Link href={"/(auth)/login"}>
                  <ThemedText type="default" lightColor="#D4393C">
                    Sign in
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
