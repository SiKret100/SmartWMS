import React, {Component, useCallback} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { useState, useEffect } from "react";
import {Text, Touchable, View, RefreshControl, Platform, Modal} from "react-native";
import categoryService from "services/dataServices/categoryService.js";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import EditButton from "../buttons/EditButton";
import {useFocusEffect} from "expo-router";
import CategoriesMobileForm from "./CategoriesMobileForm";
import CustomButton from "../buttons/CustomButton";
import DeleteButton from "../buttons/DeleteButton";


const CategoriesMobileDisplayer = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [sections, setSections] = useState([]);
    const [activeSections, setActiveSections] = useState([]);
    const [isModalVisibleCategory, setIsModalVisibleCategory] = useState(false);
    const [currentEditItemCategory, setCurrentEditItemCategory] = useState(null);
    const [currentEditItemSubcategoty, setCurrentEditItemSubcategoty] = useState(null);
    const [isModalVisibleSubcategory, setIsModalVisibleSubcategory] = useState(false);


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() =>{
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }, []);

    const fetchData = async () => {
        setSections([]); // Resetujemy sekcje
        await categoryService
            .GetCategoriesWithSubcategories()
            .then(response => {
                const updatedSections = response.data.map(category => ({
                    id: category.categoryId,
                    title: category.categoryName,
                    content: category.subcategories
                }));

                const reversedSections = updatedSections.reverse();
                setSections(reversedSections);

                //console.log("Reversed Sections:", JSON.stringify(reversedSections));
            })
            .catch(err => {
                setError(err);
                console.log(`Error ${err}`);
            });
    };

    const _renderSectionTitle = (section) => {
        return (
            <View>
                <Text>{section.content}</Text>
            </View>
        );
    };

    const _renderHeader = (section, _, isActive) => {
        return (
            <View className={`flex-row justify-between items-center flex-0.5 px-5 py-5 mx-2 my-2 shadow rounded-2xl bg-slate-200 `}>

                <Feather
                    name={isActive ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                    className = {''}
                />

                <Text className="text-center text-lg">{section.title.toUpperCase()}</Text>

                <EditButton onEdit={ () => handleModalEditCategory(section)} />
            </View>
        );
    };

    const _renderContent = (section) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton title={"Add subcategory"} textStyles={"text-white"} containerStyles={"w-full mt-0"}></CustomButton>
                {section.content.map((subcategory, index) => {
                    const isLast = index === section.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <DeleteButton onDelete={ (e) => console.log(e)}></DeleteButton>
                            <Text>{subcategory.subcategoryName}</Text>
                            <EditButton onEdit={ () => handleModalEditSubcategory(section)} />

                        </View>

                    );
                })}
            </View>
        );
    };

    const handleModalEditSubcategory = async (object) => {
        setCurrentEditItemSubcategoty(object)
        setIsModalVisibleSubcategory(true)

    }

    const handleModalEditCategory = async (object) => {
        setCurrentEditItemCategory(object);
        setIsModalVisibleCategory(true);
    }

    useFocusEffect((
        useCallback(
            () => {
                fetchData()
            },[isModalVisibleCategory])
    ))

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
        </ScrollView>

    )
}

export default CategoriesMobileDisplayer;