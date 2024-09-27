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
      try{
        const res = await authService.getUserInfo();
        setUserData(res.data);
      }
      catch(err){
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
              drawerLabel: 'Strona główna',
              title: 'Strona główna',
            }}
          />

          <Drawer.Screen 
            name='alerts'
            redirect={userData.role == 'Employee'}
            options={{
              drawerLabel: 'Alerty',
              title: 'Alerty',
            }}
          />

          <Drawer.Screen 
            name='categories' 
            options={{
              drawerLabel: 'Kategorie',
              title: 'Kategorie',
            }}
          />

          <Drawer.Screen 
            name='orders' 
            options={{
              drawerLabel: 'Zamówienia',
              title: 'Zamówienia',
            }}
          />

          <Drawer.Screen 
            name='products' 
            options={{
              drawerLabel: 'Produkty',
              title: 'Produkty',
            }}
          />

          <Drawer.Screen 
            name='reports' 
            options={{
              drawerLabel: 'Raporty',
              title: 'Raporty',
            }}
          />
          
          <Drawer.Screen 
            name='shelves' 
            options={{
              drawerLabel: 'Półki',
              title: 'Półki',
            }}
          />

          <Drawer.Screen 
            name='subcategories' 
            options={{
              drawerLabel: 'Podkategorie',
              title: 'Podkategorie',
            }}
          />

          <Drawer.Screen 
            name='tasks' 
            options={{
              drawerLabel: 'Zadania',
              title: 'Zadania',
            }}
          />

          <Drawer.Screen 
            name='users' 
            options={{
              drawerLabel: 'Użytkownicy',
              title: 'Użytkownicy',
            }}
          />

          <Drawer.Screen 
            name='waybills' 
            options={{
              drawerLabel: 'Listy przewozowe',
              title: 'Listy przewozowe',
            }}
          />
        </Drawer>
      </UserDataContext.Provider>
    </GestureHandlerRootView>
      )
};

export default RootLayout;