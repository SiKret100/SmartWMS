import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import {ScrollView} from "react-native-gesture-handler";
import CancelButton from "../buttons/CancelButton";
import {Feather} from "@expo/vector-icons";
import {Button} from "react-native-elements";
import shelfAssignmentErrorMessages from "../../data/ErrorMessages/shelfAssignmentErrorMessages";


const ShelfAssignForm = ({shelvesList, assignedShelves, setAssignedShelves, setIsModalVisible, productQuantity}) => {

    //PROPS====================================================================================================
    const [currentlyAssignedProductQuantity, setCurrentlyAssignedProductQuantity] = useState(productQuantity);
    const [localAssignedShelves, setLocalAssignedShelves] = useState([]);


    //USE EFFECT HOOKS=========================================================================================
    useEffect(() => {
        if (currentlyAssignedProductQuantity === 0 ){
            setAssignedShelves(localAssignedShelves);
            setIsModalVisible(false)

            return () => {
                setCurrentlyAssignedProductQuantity(0);
                setLocalAssignedShelves([]);
            };

        }
    },[currentlyAssignedProductQuantity])


    return (

        <View>

            <ScrollView className={"px-2"}>
                <View className="flex flex-col items-start justify-between my-5 mx-5">
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                    <Text className="my-5 text-3xl font-bold">Assign Product to shelves</Text>
                </View>

                <View className={"mb-5 px-2 flex-row"}>
                    <Text className={" text-2xl font-bold text-gray-800"}>Pieces remained:</Text>
                    <Text className={"text-2xl font-bold ml-5"}>{currentlyAssignedProductQuantity}</Text>
                </View>

                {
                    shelvesList.map(shelf => {

                            //PROPS====================================================================================================
                            const [key, setKey] = useState(shelf.shelfId);
                            const [form, setForm] = useState({
                                shelfId: shelf.shelfId,
                                level: shelf.level,
                                maxQuant: "",
                                currentQuant: "",
                                productsProductId: shelf.productId,
                                racksRackId: shelf.rackLane.rackNumber,
                                lane: shelf.rackLane.lane.laneCode,
                                rack: shelf.rackLane.rackNumber

                            });

                            const [maxQuantError, setMaxQuantError] = useState(true);
                            const [currentQuantError, setCurrentQuantError] = useState(true);
                            const [currentQuantErrorMessage, setCurrentQuantErrorMessage] = useState("");
                            const [maxQuantErrorMessage, setMaxQuantErrorMessage] = useState("");
                            const [isAssignedToShelf, setIsAssignedToShelf] = useState(false);


                            //FUNCTIONS=============================================================================================
                            const handleAssignShelf = () => {
                                setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity - parseInt(form.currentQuant));
                                setLocalAssignedShelves(prevArr => [...prevArr, form])
                                setIsAssignedToShelf(true)
                            }

                            const handleMaxQuant = (e) => {
                                const maxQuantVar = e.nativeEvent.text;
                                setIsAssignedToShelf(false)

                                const regexp = new RegExp("^[1-9]{1}\\d*$");
                                if(regexp.test(maxQuantVar)) {
                                    const parsedMaxQuant = parseInt(maxQuantVar);

                                    if (isNaN(parsedMaxQuant)) {
                                        setMaxQuantError(true);
                                        setMaxQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuant);
                                    }
                                    else {
                                        const parsedCurrentQuant = parseInt(form.currentQuant);

                                        if(parsedMaxQuant > 0 && parsedMaxQuant <= 2147483647) {
                                            setMaxQuantError(false);
                                            setMaxQuantErrorMessage("")

                                            if(isNaN(parsedCurrentQuant)) {
                                                setCurrentQuantError(true);
                                                setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.invalidCurrentQuant);
                                            }
                                            else {
                                                if(parsedCurrentQuant > parsedMaxQuant ){
                                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantBelowZeroOrAboveMaxQuant);
                                                    setCurrentQuantError(true);
                                                }
                                                else {
                                                    if(parsedCurrentQuant > currentlyAssignedProductQuantity ){
                                                        setCurrentQuantErrorMessage(true)
                                                        setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantBelowZeroOrAbovePiecesLeft);
                                                    }
                                                    else {
                                                        setCurrentQuantErrorMessage("");
                                                        setCurrentQuantError(false);
                                                    }
                                                }
                                            }
                                        }

                                        else {
                                            setMaxQuantError(true);
                                            setMaxQuantErrorMessage(shelfAssignmentErrorMessages.negativeOrExcessiveMaxQuant);
                                        }
                                    }
                                }
                                else{
                                    setMaxQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuant);
                                    setMaxQuantError(true);
                                }
                            }

                            const handleCurrentQuant = (e) => {
                                const currentQuant = e.nativeEvent.text;
                                const alreadyAssignedShelf = localAssignedShelves.filter(shelf => shelf.shelfId === form.shelfId);
                                setIsAssignedToShelf(false);

                                if(alreadyAssignedShelf.length > 0){
                                    setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity + parseInt(alreadyAssignedShelf[0].currentQuant));
                                    setLocalAssignedShelves(assignedShelves.filter(shelf => shelf.shelfId !== form.shelfId));
                                }

                                const regexp = new RegExp("^[1-9]{1}\\d*$");

                                if (regexp.test(currentQuant)) {
                                    const parsedCurrentQuant = parseInt(currentQuant);

                                    if (isNaN(parsedCurrentQuant)) {
                                        setCurrentQuantError(true);
                                        setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.invalidCurrentQuant)
                                    } else {
                                        const parsedMaxQuant = parseInt(form.maxQuant);

                                        if ( parsedCurrentQuant > 0 && parsedCurrentQuant <= currentlyAssignedProductQuantity) {
                                            if(!isNaN(parsedMaxQuant)){
                                                if(parsedCurrentQuant <= parsedMaxQuant){
                                                    setCurrentQuantError(false);
                                                    setCurrentQuantErrorMessage("");
                                                }
                                                else{
                                                    setCurrentQuantError(true);
                                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantToMaxQuantMismatch);
                                                }
                                            }
                                            else {
                                                setCurrentQuantError(false);
                                                setCurrentQuantErrorMessage("");
                                            }

                                        }else{
                                            setCurrentQuantError(true);
                                            setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantBelowZeroOrAbovePiecesLeft);
                                        }
                                    }
                                } else {
                                    setCurrentQuantError(true);
                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.invalidCurrentQuant);
                                }
                            }



                            return (
                                <View className="px-2 shadow mb-5">

                                    <View key={key} className="flex flex-row bg-slate-200 p-2 rounded-lg gap-2">

                                        <View className="flex-3 justify-center pr-2">
                                            <View className="flex-row items-center justify-between">
                                                <Text className="font-bold text-2xl text-gray-800">Lane:</Text>
                                                <Text className="ml-2">{shelf.rackLane.lane.laneCode}</Text>
                                            </View>

                                            <View className="flex-row items-center justify-between">
                                                <Text className="font-bold text-2xl text-gray-800">Rack:</Text>
                                                <Text className="ml-2">{shelf.rackLane.rackNumber}</Text>
                                            </View>

                                            <View className="flex-row items-center justify-between">
                                                <Text className="font-bold text-2xl text-gray-800">Level:</Text>
                                                <Text className="ml-2">{shelf.level}</Text>
                                            </View>
                                        </View>

                                        <View className="flex-1 flex-row items-center justify-between gap-2">
                                            <View className="flex-1 justify-center">
                                                <NumberFormField
                                                    title="Current"
                                                    value={form.currentQuant.toString()}
                                                    handleChangeText={(e) => setForm({ ...form, currentQuant: e })}
                                                    onChange={e => handleCurrentQuant(e)}
                                                    isError={currentQuantError}
                                                    iconsVisible={true}
                                                />
                                            </View>

                                            <View className="flex-1 justify-center">
                                                <NumberFormField
                                                    title="Max"
                                                    value={form.maxQuant.toString()}
                                                    handleChangeText={(e) => setForm({ ...form, maxQuant: e })}
                                                    onChange={e => handleMaxQuant(e)}
                                                    isError={maxQuantError}
                                                    iconsVisible={true}
                                                />
                                            </View>

                                            <View className="justify-center">
                                                <Button
                                                    onPress={() => handleAssignShelf()}
                                                    type="clear"
                                                    icon={
                                                        <Feather
                                                            name="plus-circle"
                                                            size={24}
                                                            color={currentQuantError || maxQuantError || isAssignedToShelf ? "gray" : "#3E86D8"}
                                                        />
                                                    }
                                                    disabled={currentQuantError || maxQuantError || isAssignedToShelf}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    {(currentQuantError && form.currentQuant.length > 0) ? (
                                        <Text className="text-red-600"> {currentQuantErrorMessage} </Text>
                                    ) : null}

                                    {(maxQuantError && form.maxQuant.length > 0) ? (
                                        <Text className="text-red-600"> {maxQuantErrorMessage} </Text>
                                    ) : null}

                                </View>
                            )
                        }
                    )
                }

            </ScrollView>

        </View>

    )
}

export default ShelfAssignForm;