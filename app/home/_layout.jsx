import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePathname } from 'expo-router';
import Drawer from "expo-router/drawer";

const RootLayout = () => {



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {<Drawer/>}
    </GestureHandlerRootView>
  );
};

export default RootLayout;
