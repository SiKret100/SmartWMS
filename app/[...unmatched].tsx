import { Link } from 'expo-router';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
} from "react-native";

const NotFoundScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Link href="/" asChild>
          <Pressable>
            <Text className="font-bold text-3xl underline text-center">404 Not Found: Nie znaleziono strony, wróć na stronę główną</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default NotFoundScreen;