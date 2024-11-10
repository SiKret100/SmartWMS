import {KeyboardAvoidingView, Platform, SafeAreaView, Text, View} from 'react-native'
import TextFormField from "../form_fields/TextFormField";
import React, {useState, useEffect} from "react";
import CustomButton from "../buttons/CustomButton";
import categoryService from "../../services/dataServices/categoryService";
import {qunit} from "globals";
import ErrorMessages from "../errors/ErrorMessages";
import CancelButton from "../buttons/CancelButton";

const CategoriesMobileForm = ({object = {}, header, setIsModalVisible}) => {
    const [errors, setErrors] = useState({});
    const [categoryNameError, setCategoryNameError] = object?.id ? useState(false) : useState(true);
    const[selectKey, setSelectKey] = useState(0);

    const [form, setForm] = React.useState({
        categoryName: object?.title || ""
    })

    const handleName = (e) => {
        console.log("zmiana znaku");
        const nameVar = e.nativeEvent.text;
        nameVar.length > 0 ? setCategoryNameError(false) : setCategoryNameError(true);
    }

    const handleEdit = async(id, form) => {
        try {
            console.log("Wywolal sie")
            const result = await categoryService.Update(id, form);
            if(result.errors) {
                console.log("erorry")
                setErrors(result.errors);
            }
            else {
                console.log("Updated")
                setErrors({});
                setForm({
                    categoryName: ""
                })
                setIsModalVisible(false);
                setSelectKey(prevKey => prevKey + 1);
            }
        }
        catch(err){
           setErrors({message: err})

        }
    }

    const handleAdd = async(form) => {
        try {
            const result = await categoryService.Add(form);
            //console.log(result.errors);
            if(result.errors){
                setErrors(result.errors);
                //console.log(`Błędy przechwycone: ${JSON.stringify(result.errors)}`);
            }else{
                setErrors({})
                setForm({
                    categoryName: ""
                })

            }
        }
        catch(err){
            //console.log(err);
            setErrors(err);
        }
    }

    return (
        <SafeAreaView className={"h-full mx-2"}>
            {/*<KeyboardAvoidingView*/}
            {/*    behavior="padding"*/}
            {/*    clasName={`h-full px-4`}>*/}

            {header === "Edit" && (
                <View className="flex flex-row items-center justify-between my-5">
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                    <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">{header}</Text>
                </View>
            )}


            <TextFormField
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
                   <ErrorMessages errors={errors}/>
                )}


            {/*</KeyboardAvoidingView>*/}
        </SafeAreaView>
    )

}

export default CategoriesMobileForm
