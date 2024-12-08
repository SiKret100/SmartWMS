import {Text, View} from 'react-native';
import React, {useContext} from 'react';
import {Tabs} from 'expo-router';
import Feather from "react-native-vector-icons/Feather";
import {UserDataContext} from "../_layout";

const TaskLayout = () => {
    const userData = useContext(UserDataContext);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#3E86D8',
            tabBarStyle: {height: 85},
            tabBarLabelStyle: {fontSize: 13, fontWeight: 'bold'}
        }
        }>
            <Tabs.Screen name='index' options={{
                title: "Tasks",
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Feather name="home" size={24} color={color}/>
                )
            }}/>
            <Tabs.Screen
                name='yourTask'
                redirect={userData.role !== 'Employee'}
                options={{
                title: "Your Task",
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <Feather name="edit" size={24} color={color}/>
                )
            }}/>
        </Tabs>
    )
}

export default TaskLayout;
