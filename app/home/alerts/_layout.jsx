import {Tabs} from 'expo-router';
import Feather from "react-native-vector-icons/Feather";
import {useContext} from "react";
import {UserDataContext} from "../_layout";

const AlertLayout = () => {
    const userData = useContext(UserDataContext);
    const hide = userData.role === 'Employee'

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#3E86D8',
            tabBarStyle: {
                height: 85,
                display : hide ? "none" : "flex"
            },
            tabBarLabelStyle: {fontSize: 13, fontWeight: 'bold'}
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: "Alers",
                    headerShown: false,
                    tabBarIcon: ({color}) => (
                        <Feather name="home" size={24} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name='add'
                redirect={userData.role === 'Employee'}
                options={{
                    title: "Add",
                    headerShown: false,
                    tabBarIcon: ({color}) => (
                        <Feather name="plus-circle" size={24} color={color}/>
                    )
                }}
            />
        </Tabs>
    );
};

export default AlertLayout;
