import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function CustomButton({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  showLoading = true,
    iconName=""
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl min-h-[62px] justify-center items-center  ${isLoading ? "bg-blue-300" : "bg-smartwms-blue"} ${containerStyles}`}
      disabled={isLoading}
    >
      <View className= "flex-row">

        {showLoading & isLoading ?   <ActivityIndicator size="small" color="#fff"/> : null}
        {
          iconName !== "" ?
              (
                  <Feather color={"white"} name={iconName} size={24}/>
              ) : null
        }
        <Text className={`text-lg ${textStyles} ${isLoading ? "ml-2" : ""}`}>
          {" "+title}
        </Text>



      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
