import {KeyboardAvoidingView, Platform, SafeAreaView, Text, View} from 'react-native'
import FormField from "../FormField";
import React, {useState} from "react";
import CustomButton from "../buttons/CustomButton";
import categoryService from "../../services/dataServices/categoryService";
import {qunit} from "globals";

const CategoriesMobileForm = ({object = {}, header, setIsModalVisible}) => {
    const [errors, setErrors] = useState({});
    const [categoryNameError, setCategoryNameError] = object?.id ? useState(false) : useState(true);


    const [form, setForm] = React.useState({
        categoryName: object?.title || ""
    })

    const handleName = (e) => {
        const nameVar = e.nativeEvent.text;
        nameVar.length > 0 ? setCategoryNameError(false) : setCategoryNameError(true);
    }

    const handleEdit = async(id, form) => {
        console.log('Nasze ID:', id)
    }

    const handleAdd = async(form) => {
        try {
            const result = await categoryService.Add(form);
            console.log(result.errors);
            if(result.errors){
                setErrors(result.errors);
                console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            }else{
                setErrors({})
                setForm({
                    categoryName: ""
                })

            }
        }
        catch(err){
            console.log(err);
            setErrors(err)
        }
    }

    return (
        <SafeAreaView className={"h-full mx-2"}>
            <KeyboardAvoidingView
                behavior="padding"
                clasName={`h-full px-4`}>

                <Text className={'my-5 text-3xl font-bold'}>{header}</Text>

                <FormField
                    title="Name"
                    value={form.categoryName}
                    handleChangeText={(e) => setForm({...form, categoryName: e})}
                    otherStyles=""
                    keyboardType="email-address"
                    onChange={e => handleName(e)}
                    isError={categoryNameError}
                    iconsVisible={true}
                />

                <CustomButton
                    title="Save"
                    handlePress={() => {
                        if (object?.id)
                            handleEdit(object.id, form);
                        else handleAdd(form);
                    }}
                    containerStyles="w-full mt-7"
                    textStyles={"text-white"}
                    isLoading={categoryNameError}
                    showLoading={false}
                />


                {Object.keys(errors).length > 0 && (
                    <View
                        className={
                            "bg-red-400  mt-7 w-full h-16 rounded-2xl items-center justify-center"
                        }
                    >
                        {Object.keys(errors).map((key, index) => (
                            <Text key={index} className="text-white">
                                {errors[key]}
                            </Text>
                        ))}
                    </View>
                )}


            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}

export default CategoriesMobileForm
