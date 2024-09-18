import { Link, Stack } from 'expo-router';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text,
  Image,
  Pressable,
} from "react-native";

export default function NotFoundScreen() {
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
}