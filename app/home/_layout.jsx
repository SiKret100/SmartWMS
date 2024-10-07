import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from "expo-router/drawer";
import { createContext } from 'react';
import { useEffect, useState, useContext } from "react";
import authService from '../../services/auth/authService';

export const UserDataContext = createContext({});

const RootLayout = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await authService.getUserInfo();
        setUserData(res.data);
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchUserInfo();
  }, [])

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
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
            redirect={userData.role == 'Employee'}
            options={{
              drawerLabel: 'Alerts',
              title: 'Alerts',
              headerStyle: { backgroundColor: 'bg-slate-200' }
            }}
          />

          <Drawer.Screen
            name='categories'
            options={{
              drawerLabel: 'Categories',
              title: 'Categories',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='orders'
            options={{
              drawerLabel: 'Orders',
              title: 'Orders',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='products'
            options={{
              drawerLabel: 'Products',
              title: 'Products',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='reports'
            options={{
              drawerLabel: 'Reports',
              title: 'Reports',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='shelves'
            options={{
              drawerLabel: 'Shelves',
              title: 'Shelves',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='subcategories'
            options={{
              drawerLabel: 'Subcategories',
              title: 'Subcategories',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />

          <Drawer.Screen
            name='tasks'
            options={{
              drawerLabel: 'Tasks',
              title: 'Tasks',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />



          <Drawer.Screen
            name='users'
            options={{
              drawerLabel: 'Users',
              title: 'Users',
              headerStyle: { backgroundColor: 'bg-slate-200' }
            }}
          />


          <Drawer.Screen
            name='waybills'
            options={{
              drawerLabel: 'Waybills',
              title: 'Waybills',
              headerStyle: { backgroundColor: 'bg-slate-200' }

            }}
          />
        </Drawer>
      </UserDataContext.Provider>
    </GestureHandlerRootView>
  )
};

export default RootLayout;