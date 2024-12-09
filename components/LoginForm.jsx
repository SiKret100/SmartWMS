
import "@/global.css";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
    SafeAreaView,
    KeyboardAvoidingView,
    View,
    Platform,
    Text,
    Image
} from "react-native";
import TextFormField from "./form_fields/TextFormField";
import CustomButton from "./buttons/CustomButton";
import "react-native-reanimated";
import authService from "../services/auth/authService";

SplashScreen.preventAutoHideAsync();



const LoginForm = () => {

    //PROPS====================================================================================================
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "Admin",
        password: "Admin123@",
    });

    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });


    //FUNCTIONS================================================================================================
    const handleLoginPress = async () => {
        await authService.handeLogin(form.email, form.password, error, setError, setLoading);
    };


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        if (loaded) {
        SplashScreen.hideAsync();
        }
    }, [loaded]);


    if (!loaded) {
        return null;
    }

    return (
       <SafeAreaView className="h-full items-center bg-smartwms">

        <KeyboardAvoidingView
          behavior="padding"
          className={`bg-smartwms h-full px-4 justify-center ${Platform.OS === "web" ? "w-96" : "w-full"}`}
        >
          <View className={`items-center justify-center`}>

            <View className="items-center justify-center w-full h-40">

              <Image
                className="w-full justify-center items-center h-full px-4"
                source={require("../img/logo.png")}
              />

            </View>

          </View>

          <TextFormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <TextFormField
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

        </KeyboardAvoidingView>

      </SafeAreaView>
    );
};

export default LoginForm;