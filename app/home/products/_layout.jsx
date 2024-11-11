import { Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";

const ProductLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name='index' options={{
        title:"Produkty",
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

    </Tabs>
  )
}

export default ProductLayout;
