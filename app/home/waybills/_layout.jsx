import { Text, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Feather from "react-native-vector-icons/Feather";

const WaybillLayout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: '#3E86D8',
        tabBarStyle: { height: 85 },
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold'}}
    }>
      <Tabs.Screen name='index' options={{
        title:"Waybills",
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Feather name="home" size={24} color={color} />
        )
      }}/>
   
    </Tabs>
  )
}

export default WaybillLayout;
