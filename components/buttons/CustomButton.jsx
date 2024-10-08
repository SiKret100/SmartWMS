import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function CustomButton({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  showLoading = true,
}) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? "bg-blue-300" : "bg-smartwms-blue"}`}
      disabled={isLoading}
    >
      <View className= "flex-row">
{/* 
        {isLoading && (
          <ActivityIndicator size="small" color="#fff"/>
        )} */}

        {showLoading & isLoading ?   <ActivityIndicator size="small" color="#fff"/> : null}

        <Text className={`text-lg ${textStyles} ${isLoading ? "ml-2" : ""}`}>
          {title}
        </Text>

      </View>


    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
