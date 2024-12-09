import React, {useEffect, useState,} from "react";
import laneService from "../../services/dataServices/laneService";
import {Platform, RefreshControl, Text, View, Modal, SafeAreaView, Alert} from "react-native";
import CustomButton from "../buttons/CustomButton";
import {ScrollView} from "react-native-gesture-handler";
import Accordion from "react-native-collapsible/Accordion";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import {Feather} from "@expo/vector-icons";
import shelfService from "../../services/dataServices/shelfService";
import ShelvesMobileForm from "./ShelvesMobileForm";
import RacksMobileForm from "../racks/RacksMobileForm";
import {useFocusEffect} from "expo-router";
import rackService from "../../services/dataServices/rackService";


const ShelvesMobileDisplayer = () => {

    //PROPS====================================================================================================
    const [rawData, setRawData] = useState([]);
    const [sections, setSections] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const [activeLaneSections, setActiveLaneSections] = useState([]);
    const [activeRackSections, setActiveRackSections] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isShelfModalVisible, setIsShelfModalVisible] = useState(false);
    const [isRackModalVisible, setIsRackModalVisible] = useState(false);
    const [shelfModalHeader, setShelfModalHeader] = useState("")
    const [rackModalHeader, setRackModalHeader] = useState("")
    const [currentEditShelf, setCurrentEditShelf] = useState(null);
    const [currentEditRack, setCurrentEditRack] = useState(null);
    const [rackId, setRackId] = useState(null);
    const [laneId, setLaneId] = useState(null);

    //FUNCTIONS================================================================================================
    const fetchData = async () => {
        setSections([]);
        await laneService
            .GetAllWithRacksShelves()
            .then(response => {
                setRawData(response.data);
                setSections(handlePrepareSections(response.data));

            })
            .catch(err => {
                throw err
            })
    }

    const handlePrepareSections = (data) => {

        return data.map((lane) => ({
            laneId: lane.laneId,
            title: lane.laneCode,
            content: lane.racks.map((rack) => ({
                laneId: lane.laneId,
                rackId: rack.rackId,
                title: rack.rackNumber,
                content: rack.shelves.map((shelf) => ({
                    rackId: rack.rackId,
                    shelfId: shelf.shelfId,
                    title: shelf.level,
                    maxQuant: shelf.maxQuant,
                    currentQuant: shelf.currentQuant,
                    productId: shelf.productsProductId,
                }))
            }))
        }))
    }

    const _renderLaneHeader = (section, _, isActive) => {
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
                    <DeleteButton onDelete={() => handleDeleteLane(section)}/>
                    {/*<EditButton onEdit={() => console.log("edit")} />*/}
                </View>

            </View>
        );
    };

    const _renderRackHeader = (section, _, isActive) => {
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
                    <DeleteButton onDelete={() => handleDeleteRack(section) }/>
                    {/*<EditButton onEdit={() => console.log("edit")} />*/}
                </View>

            </View>
        );
    };

    const _renderRackContent = (rack) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => handleModalAddShelf(rack.rackId)}
                              title={"Add Level"}
                              textStyles={"text-white"}
                              containerStyles={"w-full mt-0"}
                />

                {rack.content.map((level, index) => {
                    const isLast = index === rack.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <EditButton onEdit={() => handleModalEditShelf(level)}/>

                            <View className={"flex-col justify-between items-center px-5 py-5"}>
                                <Text>{"Level: P" + level.title}</Text>
                            </View>
                            <DeleteButton onDelete={() => handleDeleteShelf(level)}></DeleteButton>

                        </View>

                    );
                })}

            </View>
        )
    }

    const _renderLaneContent = (section) => {
        return (
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => handleModalAddRack(section.laneId)} title={"Add Rack"} textStyles={"text-white"} containerStyles={"w-full mt-0"}/>

                {section.content.length === 0 ? <Text></Text>
                    :
                    <Accordion sections={section.content}
                               renderHeader={_renderRackHeader}
                               renderContent={_renderRackContent}
                               onChange={(rack) => setActiveRackSections(rack)}
                               activeSections={activeRackSections}
                               underlayColor='transparent'
                    />
                }


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
        )
    }

    const handleDeleteShelf = async (shelf) => {
        if (shelf.productId !== null) {
            console.log("Jest produkt");
            setErrors([...errors, "Cannot deleted shelf with product assigned to it"]);
        } else {
            console.log("No product")
            await shelfService.Delete(shelf.shelfId)
                .then(response => {
                    console.log(`Shelf successfully deleted: ${JSON.stringify(response)}`);
                    onRefresh();
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const handleDeleteRack = async (rack) => {
        if(rack.content.length === 0) {
            try{
                const result = rackService.Delete(rack.rackId);
                createAlert("Info", "Rack successfully deleted");
                onRefresh();
            }
            catch(err){
                console.log(err);
            }
        }else{
            createAlert('Warning','Cannot delete Rack with Shelves assigned to it');
        }
    }

    const handleDeleteLane = (lane) => {
        //console.log("Lane: " + JSON.stringify(lane))
        if(lane.content.length === 0) {
            const result = laneService.Delete(lane.laneId);
            onRefresh();
            createAlert("Info", "Lane successfully deleted");

        }
        else {
            createAlert('Warning','Cannot delete Lane with Racks assigned to it');
        }
    }

    const handleModalAddShelf = async (rackId) => {
        setCurrentEditShelf(null);
        setIsShelfModalVisible(true);
        setRackId(rackId);
        setShelfModalHeader("Add")
    }

    const handleModalEditShelf = async (level) => {
        setCurrentEditShelf(level);
        setIsShelfModalVisible(true)
        console.log(`levels rack id: ${level.rackId}`);
        setRackId(level.rackId);
        setShelfModalHeader("Edit")
    }

    const handleModalAddRack = async (laneId) => {
        setCurrentEditRack(null);
        setIsRackModalVisible(true);
        setLaneId(laneId);
        setRackModalHeader("Add")
        console.log(`Lane id: ${laneId}`);
    }

    const _renderSectionTitle = (section) => {
        return (
            <View>
                <Text>{section.content}</Text>
            </View>
        );
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
        setActiveLaneSections([]);
        setActiveRackSections([]);
    }, [])

    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        fetchData()
            .catch(err => console.log(err));
    }, [isShelfModalVisible, isRackModalVisible]);

    useFocusEffect(
        React.useCallback(() => {
            fetchData()
            setActiveLaneSections([]);
            setActiveRackSections([]);
        }, [isShelfModalVisible, isRackModalVisible])
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >

            <Accordion
                sections={sections}
                renderContent={_renderLaneContent}
                activeSections={activeLaneSections}
                renderHeader={_renderLaneHeader}
                onChange={(section) => setActiveLaneSections(section)}
                underlayColor='transparent'
            />



            {/*<CustomButton handlePress={() => {*/}
            {/*    console.log(JSON.stringify(sections))*/}
            {/*}} title="Button"/>*/}

            <Modal
                visible={isShelfModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsShelfModalVisible(false)}
            >
                <View className="flex-auto mt-5">

                    <ShelvesMobileForm
                        object={currentEditShelf}
                        header={shelfModalHeader}
                        setIsModalVisible={setIsShelfModalVisible}
                        rackId={rackId}
                    />
                </View>

            </Modal>

            <Modal
                visible={isRackModalVisible}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle={Platform.OS === "ios" ? "pageSheet" : ""}
                onRequestClose={() => setIsRackModalVisible(false)}
            >
                <View className="flex-auto mt-5">
                    <RacksMobileForm
                        object={currentEditRack}
                        header={rackModalHeader}
                        setIsModalVisible={setIsRackModalVisible}
                        rackId={rackId}
                        laneId={laneId}
                    />
                </View>

            </Modal>

        </ScrollView>
    )
}

export default ShelvesMobileDisplayer