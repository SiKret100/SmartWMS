import React, {useState} from "react";
import {KeyboardAvoidingView, SafeAreaView, Text, View} from "react-native";
import TextFormField from "../form_fields/TextFormField";
import CustomSelectList from "../selects/CustomSelectList";
import CustomButton from "../buttons/CustomButton";
import CancelButton from "../buttons/CancelButton";
import crudService from "../../services/dataServices/crudService";
import SubcategoryDto from "../../data/DTOs/subcategoryDto";

const SubcategoryMobileForm = ({object = {}, header, setIsModalVisible, categoriesList, categoryId}) => {

    //PROPS====================================================================================================
    const [errors, setErrors] =  useState({});
    const [subCategoryNameError, setSubCategoryNameError] = object.subcategoryId ? useState(false) : useState(true);
    const [subCategoryCategoryIdError, setSubCategoryCategoryIdError] = object?.subcategoryId ? useState(false) : useState(false);
    const [selectKey, setSelectKey] = useState(0);
    const [form, setForm] = useState({
        subcategoryName: object?.subcategoryName || "",
        categoriesCategoryId: object?.categoriesCategoryId || categoryId
    });

    const [categoryTypeMap, setCategoryTypeMap] = React.useState(
        categoriesList.map( category => (
            {
                key: category.id,
                value: category.title,
            }
        ))
    );

    const defaultOption = form.categoriesCategoryId !== -1 ? categoryTypeMap.find(category => category.key == form.categoriesCategoryId) : null;


    //FUNCTIONS================================================================================================
    const handleSubcategoryName = (e) => {
        const subcategoryNameVar = e.nativeEvent.text;
        subcategoryNameVar.length > 0 ? setSubCategoryNameError(false) : setSubCategoryNameError(true);
    }

    const handleCategoryId = () => {
        form.categoriesCategoryId === -1 ? setSubCategoryCategoryIdError(true) : setSubCategoryCategoryIdError(false);
    }

    const handleEdit = async (id, form) => {
        try {
            const subcategoryDto = new SubcategoryDto(form);
            const result = await crudService.Update(id, subcategoryDto, "Subcategory");

            if(result.errors){
                setErrors(result.errors)
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
        }
    }

    const handleAdd = async (form) => {
        try{
            const subcategoryDto = new SubcategoryDto(form);
            const result = await crudService.Post(form, "Subcategory");

            if (result.errors){
                setErrors(result.errors)
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

                <View className="flex flex-row items-center justify-between my-5">
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                    <Text className="absolute left-1/2 transform -translate-x-1/2 my-5 text-3xl font-bold">{header}</Text>
                </View>

                <TextFormField
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