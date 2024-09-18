import { Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";

const UserLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name='index' options={{
        title:"Użytkownicy",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={24} color="black" />
        )
      }}/>
      <Tabs.Screen name='add' options={{
        title:"Dodaj",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="plus-circle" size={24} color="black" />
        )
      }}/>
      <Tabs.Screen name='update' options={{
        title:"Edytuj",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="edit" size={24} color="black" />
        )
      }}/>
      <Tabs.Screen name='delete' options={{
        title:"Usuń",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name="trash" size={24} color="black" />
        )
      }}/>
    </Tabs>
  )
}

export default UserLayout;
