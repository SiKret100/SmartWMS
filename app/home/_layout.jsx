import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from "expo-router/drawer";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen 
          name='alerts' 
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
    </GestureHandlerRootView>
  );
};

export default RootLayout;