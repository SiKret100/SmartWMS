import {View, Text, TextInput} from 'react-native';
import React, {useState} from 'react';
import Feather from "react-native-vector-icons/Feather";


const NumberFormField = ({
                             title,
                             value,
                             placeholder,
                             handleChangeText,
                             otherStyles,
                             isError = 0,
                             iconsVisible = false,
                             editable = true,
                             textStyles,
                             ...props
                         }) => {

    //PROPS====================================================================================================
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const smartwms_blue = "#475f9c";

    return (
        <View
            className={`space-y-2 ${otherStyles} mb-2`
            }>
            <
                Text
                className={`text-base font-pmedium ${textStyles}`}>{title}
            </Text>

            <View className={`
                              w-full 
                              h-16 
                              px-4 
                              rounded-2xl 
                              flex-row 
                              items-center  // Ensures both TextInput and icon are vertically centered
                              transition duration-150 
                              ease-in-out shadow 
                              ${isFocused ? 'border-smartwms-blue border-2' : ''} 
                              ${(isError && value.length >= 1) ? 'border-red-500 bg-red-200' : 'bg-slate-200'}`
            }
            >
                <TextInput
                    className='flex-1 h-full text-black-100 outline-none'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={'#7b7b8b'}
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    editable={editable}
                    {...props}
                />
                {(iconsVisible && value.length >= 1) && (

                    <View className="justify-center items-center ">
                        {isError ? (
                            <Feather name="x" size={24} color={"red"}/>
                        ) : (
                            <Feather name="check" size={24} color={smartwms_blue}/>
                        )}
                    </View>
                )}

            </View>
        </View>
    )
        ;
};

export default NumberFormField;
