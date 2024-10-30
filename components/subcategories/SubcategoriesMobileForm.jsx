import React, {useEffect, useState} from "react";
import {KeyboardAvoidingView, Platform, SafeAreaView, Text, View} from "react-native";
import FormField from "../FormField";
import CustomSelectList from "../selects/CustomSelectList";
import CustomButton from "../buttons/CustomButton";
import subcategoryService from "services/dataServices/subcategoryService.js";
import * as SecureStore from "expo-secure-store";
import CategoryDto from "../../data/DTOs/categoryDto";
import axios from "axios";
import {router} from "expo-router";

const SubcategoryMobileForm = ({object = {}, header, setIsModalVisible, categoriesList, categoryId}) => {
    const [errors, setErrors] =  useState({});
    const [subCategoryNameError, setSubCategoryNameError] = object.subcategoryId ? useState(false) : useState(true);
    const [subCategoryCategoryIdError, setSubCategoryCategoryIdError] = object?.subcategoryId ? useState(false) : useState(false);
    const [selectKey, setSelectKey] = useState(0);
    const [form, setForm] = useState({
        subcategoryName: object?.subcategoryName || "",
        categoriesCategoryId: object?.categoriesCategoryId || categoryId
    });

    const handleSubcategoryName = (e) => {
        const subcategoryNameVar = e.nativeEvent.text;
        subcategoryNameVar.length > 0 ? setSubCategoryNameError(false) : setSubCategoryNameError(true);
    }

    const [categoryTypeMap, setCategoryTypeMap] = React.useState(
       categoriesList.map( category => (
           {
               key: category.id,
               value: category.title,
           }
       ))
    );

    const defaultOption = form.categoriesCategoryId !== -1 ? categoryTypeMap.find(category => category.key == form.categoriesCategoryId) : null;

    const handleCategoryId = () => {
        form.categoriesCategoryId === -1 ? setSubCategoryCategoryIdError(true) : setSubCategoryCategoryIdError(false);
    }

    useEffect(() => {
        console.log('Otrzymano obiekt:' + JSON.stringify(categoriesList));
    }, []);

    const handleEdit = async (id, form) => {
        console.log("WYWOLANIE EDIT")
        try {
            const result = await subcategoryService.Update(id, form);
            if(result.errors){
                setErrors(result.errors)
                console.log("Błędy przechwycone", JSON.stringify(result.errors));
            }else {
                setErrors({});
                setForm({
                    subcategoryName: "",
                    categoriesCategoryId: "",
                })
                setIsModalVisible(false)
                setSelectKey((prevKey) => prevKey + 1);
            }
        }
        catch(err){
            setErrors(err);
            console.log(err)
        }
    }

    const handleAdd = async (form) => {
        try{
            const result = await subcategoryService.Add(form);

            if (result.errors){
                setErrors(result.errors)
                console.log("Błędy przechwycone", JSON.stringify(result.errors));
            }else {
                setErrors({});
                setForm({
                    subcategoryName: "",
                    categoriesCategoryId: ""
                    }
                )
                setIsModalVisible(false)
                setSelectKey((prevKey) => prevKey + 1);

            }
        }
        catch(err){
            setErrors(err);
        }
    }
    return(

        <SafeAreaView className={"h-full mx-2"}>
            <KeyboardAvoidingView
                behavior="padding"
                className={`h-full px-4`}
            >
                <Text className={'my-5 text-3xl font-bold'}>{header}</Text>

                <FormField
                    title="Subcategory name"
                    value={form.subcategoryName}
                    handleChangeText={(e) => setForm({...form, subcategoryName: e})}
                    otherStyles=""
                    keyboardType="email-address"
                    onChange={e => handleSubcategoryName(e)}
                    isError={subCategoryNameError}
                    iconsVisible={true}
                />

                {categoryId == null &&
                    <View className={"mt-8"}>
                        <CustomSelectList
                            setSelected={ (val) => setForm((prevForm) => ({...prevForm, categoriesCategoryId: val}))}
                            typeMap={categoryTypeMap}
                            defaultOption={defaultOption}
                            onSelect={() => handleCategoryId}
                        />

                    </View>
                }

                <CustomButton
                    title="Save"
                    handlePress = {
                        () => {
                            if(object?.categoriesCategoryId)
                                handleEdit(object.subcategoryId, form)
                            else handleAdd(form)
                        }
                    }
                    containerStyles={"w-full mt-7"}
                    textStyles={"text-white"}
                    isLoading={subCategoryNameError || subCategoryCategoryIdError}
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

export default SubcategoryMobileForm;