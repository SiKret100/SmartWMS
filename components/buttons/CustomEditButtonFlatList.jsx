import {StyleSheet, Text, View, TouchableOpacity, Alert} from "react-native";
import React from "react";
import {ActivityIndicator} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function CustomEditButtonFlatList({
                                                 title,
                                                 handlePress,
                                                 containerStyles,
                                                 textStyles,
                                                 icon,
                                                 onEdit
                                             }) {


    return (
        <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.7}
            className={`justify-center items-center p-2  ${containerStyles}`}
        >
            <View className="flex-row">


                <View className={"flex-row items-center align-middle"}>

                    <Feather color="#ffffff" className={"mr-2"} name={icon} size={12}/>

                    <Text className={`text-lg ${textStyles}`}>
                        {title}
                    </Text>
                </View>


            </View>

        </TouchableOpacity>
    );
}

