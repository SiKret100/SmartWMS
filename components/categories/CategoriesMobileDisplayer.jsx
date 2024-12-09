import React, {useCallback} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { useState, useEffect } from "react";
import {Text, View, RefreshControl, Platform, Modal, Alert} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import EditButton from "../buttons/EditButton";
import {useFocusEffect} from "expo-router";
import CategoriesMobileForm from "./CategoriesMobileForm";
import CustomButton from "../buttons/CustomButton";
import DeleteButton from "../buttons/DeleteButton";
import SubcategoriesMobileForm from "../subcategories/SubcategoriesMobileForm";
import crudService from "../../services/dataServices/crudService";


const CategoriesMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [error, setError] = useState([]);
    const [sections, setSections] = useState([]);
    const [activeSections, setActiveSections] = useState([]);
    const [isModalVisibleCategory, setIsModalVisibleCategory] = useState(false);
    const [currentEditItemCategory, setCurrentEditItemCategory] = useState(null);
    const [currentEditItemSubcategory, setCurrentEditItemSubcategory] = useState(null);
    const [isModalVisibleSubcategory, setIsModalVisibleSubcategory] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [isSubcategoryDeleted, setIsSubcategoryDeleted] = useState(false);


    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        setSections([]); // Resetujemy sekcje
        await crudService.
            GetAll("Category/withSubcategories")
            .then(response => {
                const updatedSections = response.data.map(category => ({
                    id: category.categoryId,
                    title: category.categoryName,
                    content: category.subcategories
                }));

                const reversedSections = updatedSections.reverse();
                setSections(reversedSections);

            })
            .catch(err => {
                setError(err);
                console.log(`Error ${err}`);
            });
    };

    const onRefresh = React.useCallback(() =>{
        setRefreshing(true);
        fetchData();
        setActiveSections([])
        setRefreshing(false);
    }, []);

    const _renderHeader = (section, _, isActive) => {
        return (
            <View className="flex-row justify-between items-center px-5 py-5 mx-2 my-2 shadow rounded-2xl bg-slate-200">

                <Feather
                    name={isActive ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                    className={"absolute left-4"}

                />

                <View className="flex-1 items-center">
                    <Text className="text-lg">{section.title.toUpperCase()}</Text>
                </View>

                <View className="flex-row space-x-2 absolute right-4">
                    <DeleteButton onDelete={() => handleDeleteCategory(section)} />
                    <EditButton onEdit={() => handleModalEditCategory(section)} />
                </View>

            </View>
        );
    };


    const _renderContent = (section) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => handleModalAddSubcategory(section.id)} title={"Add subcategory"} textStyles={"text-white"} containerStyles={"w-full mt-0"}></CustomButton>
                {section.content.map((subcategory, index) => {
                    const isLast = index === section.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <EditButton onEdit={ () => handleModalEditSubcategory(subcategory)} />
                            <Text>{subcategory.subcategoryName}</Text>
                            <DeleteButton onDelete={ () => handleDeleteSubcategory(subcategory.subcategoryId)}></DeleteButton>


                        </View>

                    );
                })}
            </View>
        );
    };

    const createAlert = (title, message) => {
        return (
            Alert.alert(title, message, [
                {
                    text: "Ok",
                    onPress: () => {},
                    style: "cancel"
                }
            ])
        );
    }

    const handleModalEditSubcategory = async (object) => {
        setCurrentEditItemSubcategory(object)
        setIsModalVisibleSubcategory(true)
        setCategoryId(null);
    }

    const handleModalEditCategory = async (object) => {
        setCurrentEditItemCategory(object);
        setIsModalVisibleCategory(true);
    }

    const handleModalAddSubcategory = async (categoryId) => {
        setCurrentEditItemSubcategory();
        setIsModalVisibleSubcategory(true);
        setCategoryId(categoryId);
    }

    const handleDeleteCategory = async (object) => {
        if ((object.content).length > 0 ){
            createAlert('Warning','Cannot delete Categories with Subcategories assigned to them');

        } else {
            await crudService.Delete(object.id, "Category")

                .then(response => {
                    setSections(sections.filter(category => category.id !== object.id));
                    createAlert("Info", "Category successfully deleted");
                    setActiveSections([])


                })
                .catch(err => {
                    console.log(err);
                    createAlert("Error", err);
                })
        }
    }

    const handleDeleteSubcategory = async (id) => {
        try{
            await crudService.Delete(id, "Subcategory");
            createAlert("Message", "Subcategory deleted")
            setIsSubcategoryDeleted(true)
        }
        catch(err){
            console.log(`Error deleting subcategory`);
            createAlert("Error", "Cannot delete subcategory with products assigned to it");
        }
    }


    //USE EFFECT HOOKS=========================================================================================
    useFocusEffect((
        useCallback(
            () => {
                fetchData()
                setActiveSections([])
            },[isModalVisibleCategory, isModalVisibleSubcategory])
    ))

    useEffect( () => {
        fetchData();
        if (isSubcategoryDeleted) {
            setIsSubcategoryDeleted(false);
            setActiveSections([])
        }
    }, [isSubcategoryDeleted]);


    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Accordion
                sections={sections}
                renderContent={_renderContent}
                activeSections={activeSections}
                renderHeader={_renderHeader}
                onChange={ (section) => setActiveSections(section)}
                underlayColor='transparent'
            />
            <Modal
                visible={isModalVisibleCategory}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisibleCategory(false)}
            >
                <View className="flex-auto mt-5">
                    <CategoriesMobileForm
                        object={currentEditItemCategory}
                        header="Edit"
                        setIsModalVisible={setIsModalVisibleCategory}
                    />
                </View>
            </Modal>

            <Modal
                visible={isModalVisibleSubcategory}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisibleSubcategory(false)}
            >
                <View className="flex-auto mt-5">
                    <SubcategoriesMobileForm
                        categoriesList={sections}
                        object={currentEditItemSubcategory}
                        header={categoryId == null ? 'Edit' : 'Add'}
                        setIsModalVisible={setIsModalVisibleSubcategory}
                        categoryId={categoryId}
                    />
                </View>
            </Modal>

        </ScrollView>

    )
}

export default CategoriesMobileDisplayer;