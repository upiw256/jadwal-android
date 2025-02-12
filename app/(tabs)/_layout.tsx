import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#AAAAAA" : "#555555",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Jadwal kelas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" style={{ color }} weight="bold" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "jadwal guru",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person" style={{ color }} weight="bold" />
          ),
        }}
      />
    </Tabs>
  );
}
