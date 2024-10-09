import React, { Component } from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import { useState, useEffect } from "react";
import { Text, Touchable, View } from "react-native";
import categoryService from "services/dataServices/categoryService.js";
import { TouchableOpacity } from "react-native-gesture-handler";

const CategoriesMobileDisplayer = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [sections, setSections] = useState([]);

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



    useEffect(() => {
        fetchData();
    }, [])

    return (
        <TouchableOpacity onPress={fetchData}>
            <Text>Kliknij</Text>
        </TouchableOpacity>
    )
}

export default CategoriesMobileDisplayer;