import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text,
  Image,
  Pressable
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import TextFormField from "../components/form_fields/TextFormField";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import handelogin from "../services/auth/handelogin";
import {Link, router} from "expo-router";


const index = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    await handelogin(form.email, form.password, error, setError, setLoading);
  };

  const content = (
    <SafeAreaView className="h-full items-center bg-smartwms">
      <KeyboardAvoidingView
        behavior="padding"
        className={`bg-smartwms h-full px-4 my-6 justify-center ${Platform.OS === "web" ? "w-96" : "w-full"}`}
      >
        <View className={`items-center justify-center`}>
          <View className="items-center justify-center w-full h-40">
            <Image
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
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

        <View className = {`${!error ? '' : ' bg-red-400'}  mt-7 w-full h-16 rounded-2xl items-center justify-center`}>
          <Text className="text-white">{error}</Text>
        </View>

        <Link href="/drawer/profile">Go to profile</Link>
        <Pressable onPress={() => router.push("/drawer/profile")}>
          <Text>Go to profile2</Text>
        </Pressable>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return Platform.OS === "web" ? (
    content
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {content}
    </TouchableWithoutFeedback>
  );
};

export default index;
