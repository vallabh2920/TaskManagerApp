import React from "react";
import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

interface ListItemProps
  extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  task: TaskInterface;
  onDismiss?: (task: TaskInterface) => void;
  onEdit?: (task: TaskInterface) => void;
}

const LIST_ITEM_HEIGHT = 70;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;
const SWIPE_STOP_POINT = -SCREEN_WIDTH * 0.3;

const ListItem: React.FC<ListItemProps> = ({
  task,
  onDismiss,
  onEdit,
  simultaneousHandlers,
}) => {
  const router = useRouter();
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const marginVertical = useSharedValue(10);
  const opacity = useSharedValue(1);
  const showButtons = useSharedValue(false);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = Math.max(event.translationX, -SCREEN_WIDTH * 0.5);
    },
    onEnd: () => {
      if (translateX.value < TRANSLATE_X_THRESHOLD) {
        translateX.value = withTiming(SWIPE_STOP_POINT);
        showButtons.value = true;
      } else {
        translateX.value = withTiming(0);
        showButtons.value = false;
      }
    },
  });
  const handlePress = () => {
    if (translateX.value === 0) {
      translateX.value = withTiming(SWIPE_STOP_POINT);
      showButtons.value = true;
    } else {
      translateX.value = withTiming(0);
      showButtons.value = false;
    }
  };

  const handleDelete = () => {
    translateX.value = withTiming(-SCREEN_WIDTH);
    itemHeight.value = withTiming(0);
    marginVertical.value = withTiming(0);
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished && onDismiss) {
        runOnJS(onDismiss)(task);
      }
    });
  };
  const handleEdit = () => {
    translateX.value = withTiming(0);
    showButtons.value = false;
  };

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rButtonContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(showButtons.value ? 1 : 0),
  }));

  const rTaskContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginVertical: marginVertical.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.taskContainer, rTaskContainerStyle]}>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.actionButtons, rButtonContainerStyle]}>
          <Pressable
            style={[styles.button, styles.editButton]}
            onPress={() => {
              onEdit?.(task);
              handleEdit();
            }}
          >
            <FontAwesome5 name="edit" size={20} color="white" />
          </Pressable>
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <FontAwesome5 name="trash-alt" size={20} color="white" />
          </Pressable>
        </Animated.View>
      </View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}
      >
        <Animated.View style={[styles.task, rStyle]}>
          <Pressable
            onPress={() => {
              console.log("clickkkkk", task);
              router.push({
                pathname: "/(tabs)/(home)/taskdetail",
                params: {
                  _id: task._id,
                  // user: task.user,
                  // title: task.title,
                  // description: task.description,
                  // status: task.status,
                },
              });
            }}
            style={{ flexDirection: "column" }}
          >
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskTitle}>{task.description}</Text>
          </Pressable>

          <Pressable
            //   style={[styles.button, styles.deleteButton]}
            onPress={handlePress}
          >
            <Entypo name="dots-three-vertical" size={18} color="black" />
          </Pressable>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    width: "100%",
    alignItems: "center",
  },
  task: {
    width: "90%",
    height: LIST_ITEM_HEIGHT,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    right: "10%",
    height: LIST_ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
  },
  button: {
    width: 50,
    height: LIST_ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "blue",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default ListItem;
