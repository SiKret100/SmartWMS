import React, {Component, useCallback} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { useState, useEffect } from "react";
import { Text, Touchable, View } from "react-native";
import categoryService from "services/dataServices/categoryService.js";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from '@expo/vector-icons';
import EditButton from "../buttons/EditButton";
import {useFocusEffect} from "expo-router";


const CategoriesMobileDisplayer = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [sections, setSections] = useState([]);
    const [activeSections, setActiveSections] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const fetchData = async () => {
        setSections([]);
        await categoryService
            .GetCategoriesWithSubcategories()
            .then(response => {
                //console.log(response.data);
                //console.log(JSON.stringify(response.data))
                //setSections(response.data.map((category) => [{title: category.categoryName, content: category.subcategories}]))
                response.data.forEach(category => {
                    setSections(prevSections => [...prevSections, { title: category.categoryName, content: category.subcategories }])
                })



                console.log("Sections");
                console.log(JSON.stringify(sections));

            })
            .catch(err => {
                setError(err);
                console.log(`Error ${err}`);
            })
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

                <EditButton onEdit={ (e) => console.log(e)} />






            </View>
        );
    };
    

    const _renderContent = (section) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                {section.content.map((subcategory, index) => {
                    const isLast = index === section.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-col justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <Text>{subcategory.subcategoryName}</Text>
                        </View>
                    );
                })}
            </View>
        );
    };



    useFocusEffect((
        useCallback(
            () => {
                fetchData()
            },[isModalVisible])
    ))

    return (
        <Accordion
            sections={sections}
            renderContent={_renderContent}
            activeSections={activeSections}
            renderHeader={_renderHeader}
            onChange={ (section) => setActiveSections(section)}
            underlayColor='transparent'
        />

    )
}

export default CategoriesMobileDisplayer;