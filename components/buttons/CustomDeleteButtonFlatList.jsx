import {Text, View, TouchableOpacity, Alert} from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather";

export default function CustomDeleteButtonFlatList({
                                                 title,
                                                 handlePress,
                                                 containerStyles,
                                                 textStyles,
                                                 icon, onDelete
                                             }) {

    const createTwoButtonAlert = () => {
        Alert.alert('Warning', 'Are you sure you want to delete this?', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => onDelete(),
                style: 'destructive'
            }
        ])
    }

    return (
        <TouchableOpacity
            onPress={createTwoButtonAlert}
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

