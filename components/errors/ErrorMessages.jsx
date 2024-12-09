import { Text, View } from 'react-native'
import React from 'react'

const ErrorMessages = ({errors}) => {
    return (
        <View className={ "bg-red-400  mt-7 w-full rounded-2xl justify-center p-5 font-bold"}>
            {Object.keys(errors).map((key, index) => (
                <Text key={index} className="text-white">
                    {'•' + errors[key]}
                </Text>
            ))}
        </View>
    )
};

export default ErrorMessages;