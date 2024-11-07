import React, {useEffect, useState,} from "react";
import laneService from "../../services/dataServices/laneService";
import {Platform, RefreshControl, Text, View, Modal} from "react-native";
import CustomButton from "../buttons/CustomButton";
import {ScrollView} from "react-native-gesture-handler";
import Accordion from "react-native-collapsible/Accordion";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import {Feather} from "@expo/vector-icons";
import shelfService from "../../services/dataServices/shelfService";
import SubcategoriesMobileForm from "../subcategories/SubcategoriesMobileForm";
import ShelvesMobileForm from "./ShelvesMobileForm";


const ShelvesMobileDisplayer = () => {

    const [rawData, setRawData] = useState([]);
    const [sections, setSections] = useState([]);
    const [refreshing, setRefreshing]= useState(false)
    const [activeLaneSections, setActiveLaneSections] = useState([]);
    const [activeRackSections, setActiveRackSections] = useState([]);
    const [rackSections, setRackSections] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isModalVisibleShelf, setIsModalVisibleShelf] = useState(false);
    const [currentEditShelf, setCurrentEditShelf] = useState(null);
    const [rackId, setRackId] = useState(null);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    },[])

    const fetchData = async () => {
        setSections([]);
        await laneService
            .GetAllWithRacksShelves()
            .then(response => {
                setRawData(response.data);
                setSections(handlePrepareSections(response.data));

                //setSections(handlePrepareSection(response.data))
            })
            .catch(err => {
                throw err
            })
    }

    const handlePrepareSections = (data) => {

        return data.map ( (lane) => ({
            laneId: lane.id,
            title: lane.laneCode,
            content: lane.racks.map ( (rack) => ({
                rackId: rack.id,
                title: rack.rackNumber,
                    content: rack.shelves.map( (shelf) => ({
                        shelfId: shelf.shelfId,
                        title: shelf.level,
                        maxQuant: shelf.maxQuant,
                        currentQuant: shelf.currentQuant,
                        productId: shelf.productsProductId,
                    }))
            }))
        }))

    }

    const handleDeleteShelf = async (shelf) => {
        console.log(`Shelf for removal: ${JSON.stringify(shelf)}`);
        if(shelf.productId !== null){
            console.log("Jest produkt");
            setErrors(...errors, "Cannot deleted shelf with product assigned to it");
        }
        else {
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

    const handleModalAddShelf = async (rackId) => {
        setCurrentEditShelf();
        setIsModalVisibleShelf(true);
        setRackId(rackId);
    }

    const handleModalEditShelf = async (object) => {
        setCurrentEditShelf(object);
        console.log(object);
        setIsModalVisibleShelf(true);
        setRackId(null)
    }

    const _renderSectionTitle = (section) => {
        return (
            <View>
                <Text>{section.content}</Text>
            </View>
        );
    };

    const onDeleteLane = () => {
        console.log(JSON.stringify(rawData));
        console.log("-------------------")
        console.log(JSON.stringify(sections));
    }

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
                    <DeleteButton onDelete={() => onDeleteLane() } />
                    {/*<EditButton onEdit={() => console.log("edit")} />*/}
                </View>

            </View>
        );
    };

    const _renderRackContent = (rack) => {
        return(
            <View className={'rounded-lg shadow my-2 mx-4 bg-slate-200'}>
                <CustomButton handlePress={() => handleModalAddShelf(rack.rackId)} title={"Add Level"} textStyles={"text-white"} containerStyles={"w-full mt-0"}></CustomButton>

                {rack.content.map((level, index) => {
                    const isLast = index === rack.content.length - 1;
                    return (
                        <View
                            key={index}
                            className={`flex-row justify-between items-center px-2 py-3 ${!isLast ? 'border-b border-gray-300' : ''}`}
                        >
                            <DeleteButton onDelete={() => handleDeleteShelf(level)}></DeleteButton>
                            <View className={"flex-col justify-between items-center px-5 py-5"}>
                                <Text>{"Level: P" + level.title}</Text>
                            </View>

                            <EditButton onEdit={ () => handleModalEditShelf(level)} />

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

            <Accordion
                sections={sections}
                renderContent={_renderLaneContent}
                activeSections={activeLaneSections}
                renderHeader={_renderHeader}
                onChange={ (section) => setActiveLaneSections(section) }
                underlayColor='transparent'
                onDeleteLane={ onDeleteLane }
            />
            <CustomButton handlePress={() => {console.log(JSON.stringify(sections))}} title = "Button"/>

            <Modal
                visible = {isModalVisibleShelf}
                animationType={Platform.OS !== "ios" ? "" : "slide"}
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisibleShelf(false)}
            >
                <ShelvesMobileForm
                    object={currentEditShelf}
                    header={rackId === null ? "Edit" : "Add"}
                    setIsModalVisible={setIsModalVisibleShelf}
                    rackId={rackId}
                />

            </Modal>



        </ScrollView>



    )

}

export default ShelvesMobileDisplayer