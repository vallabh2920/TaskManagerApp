import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  View,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomTextInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry || isPassword);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: "#fff",
        ...containerStyle,
      }}
    >
      {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}

      <RNTextInput
        style={{ flex: 1, fontSize: 16 }}
        placeholderTextColor="#888"
        secureTextEntry={isSecure}
        {...props}
      />

      {isPassword ? (
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
          <MaterialIcons
            name={isSecure ? "visibility-off" : "visibility"}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      ) : (
        rightIcon && <View style={{ marginLeft: 10 }}>{rightIcon}</View>
      )}
    </View>
  );
};

export default CustomTextInput;
