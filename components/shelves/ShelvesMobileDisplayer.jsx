import React, {useEffect, useState,} from "react";
import shelfService from "../../services/dataServices/shelfService";
import {RefreshControl, Text, View} from "react-native";
import CustomButton from "../buttons/CustomButton";
import {ScrollView} from "react-native-gesture-handler";
import Accordion from "react-native-collapsible/Accordion";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import {Feather} from "@expo/vector-icons";


const ShelvesMobileDisplayer = () => {

    const [sections, setSections] = useState([]);
    const [refreshing, setRefreshing]= useState(false)
    const [activeLaneSections, setActiveLaneSections] = useState([]);
    const [activeRackSections, setActiveRackSections] = useState([]);
    const [rackSections, setRackSections] = useState([]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        fetchData()
        setRefreshing(false)
    },[])

    const fetchData = async () => {
        setSections([]);
        await shelfService
            .GetAll()
            .then(response => {
                setSections(handlePrepareSection(response.data))
            })
            .catch(err => {
                throw err
            })
    }

    const handlePrepareSection = (data) => {
        let lanesArray = [];

        data.forEach((item) => {
            const existingLane = lanesArray.find(newItem => newItem.title === item.lane);

            //najpierw sprawdzamy czy dany LANE istnieje
            if (existingLane) {

                const existingRack = existingLane.content.find(rack => rack.title === item.rack);

                //sprawdzamy czy dany rack istieje w danym lanie, jesli nie to go tworzymy jak to dodajemy do jego contetntu
                if (existingRack) {
                    existingRack.content.push({
                        shelfId: item.shelfId,
                        level: item.level,
                        maxQuant: item.maxQuant,
                        currentQuant: item.currentQuant
                    });
                } else {
                    existingLane.content.push({
                        shelfId: item.shelfId,
                        title: item.rack,
                        content: [
                            {
                                shelfId: item.shelfId,
                                level: item.level,
                                maxQuant: item.maxQuant,
                                currentQuant: item.currentQuant
                            }
                        ]
                    });
                }
                //jesli LANE nie istnieje to jest tworzony caly obiekt z struktura pod levele i racki
            } else {
                lanesArray.push({
                    shelfId: item.shelfId,
                    title: item.lane,
                    content: [{
                        shelfId: item.shelfId,
                        title: item.rack,
                        content: [
                            {
                                shelfId: item.shelfId,
                                level: item.level,
                                maxQuant: item.maxQuant,
                                currentQuant: item.currentQuant
                            }
                        ]
                    }]
                });
            }
        });

        //console.log(JSON.stringify(lanesArray));
        return lanesArray;
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
            <View className="flex-row justify-between items-center px-5 py-5 mx-2 my-2 shadow rounded-2xl bg-slate-200">

                <Feather
                    name={isActive ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="black"
                    className={"absolute left-4"}

                />

                <View className="flex-1 items-center">
                    <Text className="text-lg">{section.title}</Text>
                </View>

                <View className="flex-row space-x-2 absolute right-4">
                    <DeleteButton onDelete={() => console.log("delete")} />
                    <EditButton onEdit={() => console.log("edit")} />
                </View>

            </View>
        );
    };

    const _renderRackContent = (rack) => {
        return(
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => console.log("Add Rack")} title={"Add Level"} textStyles={"text-white"} containerStyles={"w-full mt-0"}></CustomButton>

                {rack.content.map((level, index) => {
                    const isLast = index === rack.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <DeleteButton onDelete={ (e) => console.log(e)}></DeleteButton>
                            <View className={"flex-col justify-between items-center px-5 py-5"}>
                                <Text>{"Level:" + level.level}</Text>
                            </View>

                            <EditButton onEdit={ () => console.log("edit level")} />

                        </View>

                    );
                })}

            </View>
        )

    }
    
    const _renderLaneContent = (section) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => console.log("Add Rack")} title={"Add Rack"} textStyles={"text-white"} containerStyles={"w-full mt-0"}></CustomButton>

                {/*{section.content.map((rack, index) => {*/}
                {/*    const isLast = index === section.content.length - 1;*/}
                {/*    return (*/}
                {/*        <View*/}
                {/*            key={index}*/}
                {/*            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}*/}
                {/*        >*/}
                {/*           <DeleteButton onDelete={ (e) => console.log(e)}></DeleteButton>*/}
                {/*            <View className={"flex-col justify-between items-center px-5 py-5"}>*/}
                {/*                <Text>{"Rack:" + rack.title}</Text>*/}
                {/*            </View>*/}

                {/*            <EditButton onEdit={ () => console.log("edit rack")} />*/}

                {/*        </View>*/}
                {/*        */}
                {/*        <Accordion sections={rack.section} renderHeader={_renderHeader} renderContent={} onChange={} activeSections={}*/}



                {/*    );*/}
                {/*})}*/}
                {section.content.length === 0 ? <Text></Text>
                    :
                    <Accordion sections={section.content} renderHeader={_renderHeader} renderContent={_renderRackContent} onChange={(rack) => setActiveRackSections(rack)} activeSections={activeRackSections}                 underlayColor='transparent'
                    />
                }


            </View>
        );
    };


    useEffect(() => {
            fetchData()
                .catch(err => console.log(err));
    }, []);

    return (
        <ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/*<Text>Shelves</Text>*/}
            {/*<CustomButton handlePress={ () => console.log(JSON.stringify( sections))} title = {"Show sections"} ></CustomButton>*/}

            <Accordion
                sections={sections}
                renderContent={_renderLaneContent}
                activeSections={activeLaneSections}
                renderHeader={_renderHeader}
                onChange={ (section) => setActiveLaneSections(section)}
                underlayColor='transparent'
            />
        </ScrollView>

    )

}

export default ShelvesMobileDisplayer