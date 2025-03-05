import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Href, Link } from "expo-router";

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  href?: Href; // For navigation
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  href,
  isLoading = false,
  disabled = false,
  variant = "primary",
  bgColor,
  textColor,
  borderColor,
  leftIcon,
  rightIcon,
  fullWidth = false,
  containerStyle,
  titleStyle,
}) => {
  // Default styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: borderColor || "#6200ea",
          borderWidth: 1,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
      default:
        return {
          backgroundColor: bgColor || "#6200ea",
          borderColor: "transparent",
        };
    }
  };

  const getTextColor = () => {
    if (variant === "outline") return textColor || "#6200ea";
    if (variant === "ghost") return textColor || "#6200ea";
    return textColor || "#ffffff";
  };

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        ...getButtonStyle(),
        ...containerStyle,
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {leftIcon}
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: 16,
                fontWeight: "600",
                ...titleStyle,
              },
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </View>
  );

  return href ? (
    <Link href={href} asChild>
      <TouchableOpacity disabled={disabled || isLoading} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    </Link>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
};

export default CustomButton;
