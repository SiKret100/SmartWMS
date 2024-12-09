import {SafeAreaView, Text, View} from 'react-native'
import TextFormField from "../form_fields/TextFormField";
import React, {useState} from "react";
import CustomButton from "../buttons/CustomButton";
import ErrorMessages from "../errors/ErrorMessages";
import CancelButton from "../buttons/CancelButton";
import crudService from "../../services/dataServices/crudService";
import CategoryDto from "../../data/DTOs/categoryDto";
import {router} from "expo-router";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";

const CategoriesMobileForm = ({object = {}, header, setIsModalVisible}) => {

    //PROPS====================================================================================================
    const [errors, setErrors] = useState({});
    const [categoryNameError, setCategoryNameError] = object?.id ? useState(false) : useState(true);
    const [selectKey, setSelectKey] = useState(0);
    const [form, setForm] = React.useState({
        categoryName: object?.title || ""
    })


    //FUNCTIONS================================================================================================
    const handleName = (e) => {
        const nameVar = e.nativeEvent.text;
        nameVar.length >= 3 ? setCategoryNameError(false) : setCategoryNameError(true);
    }

    const handleEdit = async(id, form) => {

        try {
            const categoryDto = new CategoryDto(form);
            const result = await crudService.Update(id, categoryDto, "Category");

            if(result.errors) {
                setErrors(result.errors);
            }
            else {
                setErrors({});
                setForm({
                    categoryName: ""
                })
                setIsModalVisible(false);
                setSelectKey(prevKey => prevKey + 1);
            }
        }
        catch(err){
            CustomAlert("Error editing category");
           setErrors({message: err})
        }
    }

    const handleAdd = async(form) => {
        try {
            const categoryDto = new CategoryDto(form);
            const result = await crudService.Post(categoryDto, "Category");

            if(result.errors){
                setErrors(result.errors);
            }
            else{
                setErrors({})
                setForm({
                    categoryName: ""
                })
            }

            router.push("/home/categories/");
        }
        catch(err){
            CustomAlert("Error adding category");
            setErrors(err);
        }
    }


    return (
        <SafeAreaView className={"h-full mx-2"}>

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

        </SafeAreaView>
    )
}

export default CategoriesMobileForm
