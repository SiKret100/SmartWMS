import { Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";

const AlertLayout = () => {
  return (
    <Tabs screenOptions={
      {
        tabBarActiveTintColor: '#3E86D8',
        tabBarStyle: {
          height: 85
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: 'bold'
        }
      }
    }>
      <Tabs.Screen name='index' options={{
        title: "Alerty",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={24} color={color} />
        )
      }} />
      <Tabs.Screen name='add' options={{
        title: "Dodaj",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="plus-circle" size={24} color={color} />
        )
      }} />
      <Tabs.Screen name='update' options={{
        title: "Edytuj",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="edit" size={24} color="black" />
        ),
        tabBarButton: () => null
      }} />
    </Tabs>
  )
}

export default AlertLayout;
