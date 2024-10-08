import { Text, View, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";


const UserLayout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#3E86D8',
      tabBarStyle: { height: 85 },
      tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' }
    }} >
      <Tabs.Screen name='index' options={{
        title: "Users",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" size={24} color={color} />
        )
      }} />

      <Tabs.Screen name='managers' options={{
        title: "Managers",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="users" size={24} color={color} />
        )
      }} />

      <Tabs.Screen name='add' options={{
        title: "Add",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="user-plus" size={24} color={color} />
        )
      }} />


    </Tabs>
  )
}

export default UserLayout;
