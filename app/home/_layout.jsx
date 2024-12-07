import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Drawer from "expo-router/drawer";
import {createContext} from 'react';
import {useEffect, useState, useContext} from "react";
import authService from '../../services/auth/authService';
import {getConnection, initializeSignalR} from "../../services/signalR/signalRService";
import {
    configureNotificationSettings,
    registerForPushNotificationsAsync
} from "../../services/notifications/notificationService";
import * as Notifications from "expo-notifications";
import {router} from "expo-router";

export const UserDataContext = createContext({});

const RootLayout = () => {
    const [userData, setUserData] = useState({});

    const fetchUserInfo = async () => {
        try {
            const res = await authService.getUserInfo();
            setUserData(res.data);
        } catch (err) {
            console.log(err)
        }
    }

    const initSignalR = async () => {

        await initializeSignalR();
        const connection = getConnection();

        if (connection) {
            connection.on('Receive Alert', async (notification) => {
                console.log('Otrzymano powiadomienie:' + JSON.stringify(notification)) ;
                try {
                    const response = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: notification.title || 'Nowe powiadomienie!',
                            body: notification || notification.message || 'Masz nowe powiadomienie!',
                            data: {notification},
                        },
                        trigger: {seconds: 1},
                    });
                    console.log('Notification scheduled:', response);
                } catch (error) {
                    console.error('Error scheduling notification:', error);
                }
            });
        } else {
            console.error('SignalR connection is undefined.');
        }
    };


    useEffect(() => {
        configureNotificationSettings();
        fetchUserInfo();
        initSignalR();
        return () => {
            const connection = getConnection();
            connection?.off('ReceiveNotification');
        };
    }, []);

    useEffect(() => {
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Użytkownik kliknął powiadomienie:', response.notification);
            router.push('/home/alerts/');
        });

        return () => {
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);



    return (

        <GestureHandlerRootView style={{flex: 1}}>
            <UserDataContext.Provider value={userData}>
                <Drawer>
                    <Drawer.Screen
                        name='index'
                        options={{
                            drawerLabel: 'HomePage',
                            title: 'Home Page',
                        }}
                    />

                    <Drawer.Screen
                        name='alerts'
                        options={{
                            drawerLabel: 'Alerts',
                            title: 'Alerts',
                            headerStyle: {backgroundColor: 'bg-slate-200'}
                        }}
                    />

                    <Drawer.Screen
                        name='categories'
                        redirect={userData.role === 'Employee'}
                        options={{
                            drawerLabel: 'Categories',
                            title: 'Categories',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='orders'
                        redirect={userData.role === 'Employee'}
                        options={{
                            drawerLabel: 'Orders',
                            title: 'Orders',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='products'
                        options={{
                            drawerLabel: 'Products',
                            title: 'Products',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='reports'
                        redirect={userData.role === 'Employee'}
                        options={{
                            drawerLabel: 'Reports',
                            title: 'Reports',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='shelves'
                        redirect={userData.role === 'Employee'}
                        options={{
                            drawerLabel: 'Shelves',
                            title: 'Shelves',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='tasks'
                        options={{
                            drawerLabel: 'Tasks',
                            title: 'Tasks',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />

                    <Drawer.Screen
                        name='users'
                        redirect={userData.role === 'Employee'}
                        options={{
                            drawerLabel: 'Users',
                            title: 'Users',
                            headerStyle: {backgroundColor: 'bg-slate-200'}
                        }}
                    />

                    <Drawer.Screen
                        name='waybills'
                        options={{
                            drawerLabel: 'Waybills',
                            title: 'Waybills',
                            headerStyle: {backgroundColor: 'bg-slate-200'}

                        }}
                    />
                </Drawer>
            </UserDataContext.Provider>
        </GestureHandlerRootView>
    )
};

export default RootLayout;