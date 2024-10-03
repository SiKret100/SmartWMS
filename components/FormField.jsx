import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>

            <Text className='text-base font-pmedium'>{title}</Text>

            <View className={` bg-slate-200  w-full h-16 px-4 rounded-2xl items-start transition duration-150 ease-in-out shadow ${isFocused ? 'border-smartwms-blue border-2' :''}`  }>
                <TextInput
                    className='flex-1 w-full h-full text-black-100 outline-none'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={'#7b7b8b'}
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    
                />
            </View>

        </View>
    );
    }



export default FormField;
