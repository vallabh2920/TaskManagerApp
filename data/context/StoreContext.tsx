import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

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

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface StoreContextType {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  signIn: (token: string, profile: Profile) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "_id">) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  taskDetail: TaskInterface | null;
  fetchSingleTask: (taskId: string) => Promise<void>;
  setTaskDetail: (task: null) => void;
}

const StoreContext = React.createContext<StoreContextType | undefined>(
  undefined
);

// Custom Hook for Accessing StoreContext
export function useStore() {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}

// **Session & Task Provider**
export function StoreProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDetail, setTaskDetail] = useState<TaskInterface | null>(null);

  // **Load Session & Profile on App Start**
  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      const storedProfile = await AsyncStorage.getItem("userProfile");
      console.log("storedProfile", storedProfile);

      setSession(token);
      setProfile(storedProfile ? JSON.parse(storedProfile) : null);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  // **Sign In & Store Token + Profile**
  const signIn = async (token: string, profile: Profile) => {
    await AsyncStorage.setItem("jwtToken", token);
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    setSession(token);
    setProfile(profile);
  };

  // **Sign Out & Clear Storage**
  const signOut = async () => {
    await AsyncStorage.removeItem("jwtToken");
    await AsyncStorage.removeItem("userProfile");
    setSession(null);
    setProfile(null);
    setTasks([]); // Clear tasks on logout
  };

  const API_BASE_URL = "http://localhost:5001/api/tasks";

  // ✅ Fetch All Tasks
  const fetchTasks = async () => {
    if (!session) return;
    try {
      console.log("fetchTasks", session);

      const response = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${session}` },
      });
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Fetch Single Task by ID
  const fetchSingleTask = async (taskId: string) => {
    if (!session) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${session}` },
      });
      const data = await response.json();
      if (data.success) {
        setTaskDetail(data.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  // ✅ Add a New Task
  const addTask = async (task: Omit<Task, "_id" | "createdAt">) => {
    if (!session) return;
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(task),
      });
      const data = await response.json();
      if (data.success) {
        setTasks((prevTasks) => [...prevTasks, data.data]);
        router.back();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Update a Task
  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    if (!session) return;
    try {
      console.log("update data req", taskId, updatedTask);
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      console.log("update data", data);

      if (data.success) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        );
        await fetchSingleTask(taskId);
        setTaskDetail(null);
        router.back();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ✅ Delete a Task
  const deleteTask = async (taskId: string) => {
    if (!session) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session}` },
      });
      const data = await response.json();
      console.log("data", data);

      if (data.success) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // useEffect(() => {
  //   if (session) {
  //     fetchTasks();
  //   }
  // }, [session]);

  return (
    <StoreContext.Provider
      value={{
        profile,
        setProfile,
        signIn,
        signOut,
        session,
        isLoading,
        tasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        taskDetail,
        setTaskDetail,
        fetchSingleTask,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
