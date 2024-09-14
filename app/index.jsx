import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
  } from "@react-navigation/native";
  import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
  import "@/global.css";
  import { Stack, Link, router } from "expo-router";
  import * as SplashScreen from "expo-splash-screen";
  import { useEffect, useState } from "react";
  import { useFonts } from "expo-font";
  import { useColorScheme } from "@/hooks/useColorScheme";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
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
  import FormField from "../components/FormField";
  import CustomButton from "../components/CustomButton";
  import handelogin from "../services/auth/handelogin";
  import "react-native-reanimated";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    await handelogin(form.email, form.password, error, setError, setLoading);
  };

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  //without that componenets are not load as well as nativewind
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  //------------------------------------------------------------

  return (
      <SafeAreaView className="h-full items-center bg-smartwms">
        <KeyboardAvoidingView
          behavior="padding"
          className={`bg-smartwms h-full px-4 justify-center ${Platform.OS === "web" ? "w-96" : "w-full"}`}
        >
          <View className={`items-center justify-center`}>
            <View className="items-center justify-center w-full h-40">
              <Image
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                source={require("../img/logo.png")}
              />
            </View>
          </View>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Log in"
            handlePress={handleLoginPress}
            containerStyles="w-full mt-7"
            textStyles={"text-white"}
            isLoading={loading}
          />

          <View
            className={`${!error ? "" : " bg-red-400"}  mt-7 w-full h-16 rounded-2xl items-center justify-center`}
          >
            <Text className="text-white">{error}</Text>
          </View>

          <Link href="/home/profile">Go to profile</Link>
          <Link href="/home/test">Go to </Link>
          
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}
