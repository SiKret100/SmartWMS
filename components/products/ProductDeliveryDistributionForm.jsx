import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import CancelButton from "../buttons/CancelButton";
import React, {useEffect, useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import {Button} from "react-native-elements";
import {Feather} from "@expo/vector-icons";
import CustomButton from "../buttons/CustomButton";
import shelfAssignmentErrorMessages from "../../data/ErrorMessages/shelfAssignmentErrorMessages";

const ProductDeliveryDistributionForm = ({
                                             productQuantity,
                                             shelvesList,
                                             setIsModalVisible,
                                             assignedShelves,
                                             setAssignedShelves
                                         }) => {
    const [currentlyAssignedProductQuantity, setCurrentlyAssignedProductQuantity] = useState(productQuantity);
    const [localAssignedShelves, setLocalAssignedShelves] = useState([]);
    //const [tempShelvesList, setTempShelvesList] = useState(shelvesList);


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
                    <CancelButton onPress={() => setIsModalVisible(false)}/>
                    <Text className="my-5 text-3xl font-bold">Distribute delivery product</Text>
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
                                maxQuant: shelf.maxQuant === 0 ? "" : shelf.maxQuant.toString(),
                                currentQuant: "",
                                productsProductId: shelf.productId,
                                racksRackId: shelf.rackLane.rackNumber,
                                lane: shelf.rackLane.lane.laneCode,
                                rack: shelf.rackLane.rackNumber
                            })

                            const [maxQuantError, setMaxQuantError] = useState(form.maxQuant == "" ? true : false);
                            const [currentQuantError, setCurrentQuantError] = useState(form.currentQuant == "" ? true : false);
                            const [currentQuantErrorMessage, setCurrentQuantErrorMessage] = useState("");
                            const [maxQuantErrorMessage, setMaxQuantErrorMessage] = useState("");
                            const [isAssignedToShelf, setIsAssignedToShelf] = useState(false);
                            const [currenltyAssignedQuantityToShelf, setCurrentlyAssignedQuantityToShelf] = useState(0);


                            //FUNCTIONS=============================================================================================
                        const handleAssignShelf = () => {
                            console.log(`Aktualna wartosc dla shelfa: ${shelf.currentQuant}`);

                            const newQuant = (parseInt(form.currentQuant) + parseInt(shelf.currentQuant)).toString();
                            console.log("New quant: " + newQuant);

                            setCurrentlyAssignedQuantityToShelf(form.currentQuant);

                            const updatedForm = {
                                ...form,
                                currentQuant: newQuant
                            };

                            setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity - parseInt(form.currentQuant));

                            setForm({...updatedForm});

                            setLocalAssignedShelves(prevArr => [...prevArr, updatedForm]);

                            if (currentlyAssignedProductQuantity === 0) {
                                setIsModalVisible(false);12
                                console.log("Wszystkie rozdysponowane");
                            }

                            setIsAssignedToShelf(true);

                            console.log("Currently assigned: " + currentlyAssignedProductQuantity);
                        };





                        const handleMaxQuant = (e) => {
                                const maxQuantVar = e.nativeEvent.text;
                                setIsAssignedToShelf(false);
                                // if(form.maxQuant.length !== 0 && form.currentQuant.length !== 0 ){
                                //     setErrorMessage("Maximum quantity is required");
                                // }
                                const regexp = new RegExp("^[1-9]{1}\\d*$");
                                if (regexp.test(maxQuantVar)) {
                                    const parsedMaxQuant = parseInt(maxQuantVar);
                                    // console.log(`Parsed max: ${parsedMaxQuant}`);
                                    if (isNaN(parsedMaxQuant)) {
                                        setMaxQuantError(true);
                                        setMaxQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuant);
                                        // console.log('Error: not a number');
                                    } else {
                                        const parsedCurrentQuant = parseInt(form.currentQuant);
                                        if (parsedMaxQuant > 0 && parsedMaxQuant <= 2147483647) {
                                            setMaxQuantError(false);
                                            setMaxQuantErrorMessage("")
                                            if (isNaN(parsedCurrentQuant)) {
                                                setCurrentQuantError(true);
                                                setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.invalidCurrentQuant);
                                            } else {
                                                if (parsedCurrentQuant > parsedMaxQuant) {
                                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantBelowZeroOrAboveMaxQuant);
                                                    setCurrentQuantError(true);
                                                } else {
                                                    setCurrentQuantErrorMessage("");
                                                    setCurrentQuantError(false);
                                                }
                                            }
                                        } else {
                                            setMaxQuantError(true);
                                            setMaxQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuantPositiveError);
                                        }
                                    }
                                } else {
                                    setMaxQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuantValid);
                                    setMaxQuantError(true);
                                }
                            }


                            const handleCurrentQuantForEmpty = (e) => {
                                const currentQuant = e.nativeEvent.text;
                                const alreadyAssignedShelf = localAssignedShelves.filter(shelf => shelf.shelfId === form.shelfId);
                                setIsAssignedToShelf(false);

                                if (alreadyAssignedShelf.length > 0) {
                                    //console.log("Znaleziono")
                                    setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity + parseInt(alreadyAssignedShelf[0].currentQuant));
                                    setLocalAssignedShelves(assignedShelves.filter(shelf => shelf.shelfId !== form.shelfId));
                                }
                                const regexp = new RegExp("^[1-9]{1}\\d*$");
                                if (regexp.test(currentQuant)) {
                                    const parsedCurrentQuant = parseInt(currentQuant);
                                    //console.log(parsedCurrentQuant);

                                    if (isNaN(parsedCurrentQuant)) {
                                        setCurrentQuantError(true);
                                        setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.invalidMaxQuant)
                                        // console.log('Entered value for current quantity is not a number');
                                    } else {
                                        const parsedMaxQuant = parseInt(form.maxQuant);
                                        if (parsedCurrentQuant > 0 && parsedCurrentQuant <= currentlyAssignedProductQuantity) {
                                            if (!isNaN(parsedMaxQuant)) {
                                                if (parsedCurrentQuant <= parsedMaxQuant) {
                                                    setCurrentQuantError(false);
                                                    setCurrentQuantErrorMessage("");
                                                    // console.log('No error');
                                                } else {
                                                    setCurrentQuantError(true);
                                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantToMaxQuantMismatch);
                                                    // console.log('No error');
                                                }
                                            } else {
                                                setCurrentQuantError(false);
                                                setCurrentQuantErrorMessage("");
                                                // console.log('No Error');
                                            }

                                        } else {
                                            setCurrentQuantError(true);
                                            setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantBelowZeroOrAboveProductQuant);
                                            console.log('Error');
                                        }
                                    }
                                } else {
                                    setCurrentQuantError(true);
                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantValidQuantNumber);
                                    console.log('Error');
                                }
                            }

                            const handleAssignQuantForNonEmpty = (e) => {
                                const currentQuant = e.nativeEvent.text;
                                const alreadyAssignedShelf = localAssignedShelves.filter(shelf => shelf.shelfId === form.shelfId);
                                setIsAssignedToShelf(false);

                                if (alreadyAssignedShelf.length > 0) {
                                    //console.log("Znaleziono")
                                    setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity + parseInt(alreadyAssignedShelf[0].currentQuant));
                                    setLocalAssignedShelves(assignedShelves.filter(shelf => shelf.shelfId !== form.shelfId));
                                }

                                const regexp = new RegExp("^[1-9]{1}\\d*$");
                                if (regexp.test(currentQuant)) {
                                    // console.log("Przeszlo");
                                    setCurrentQuantError(false);
                                    const parsedCurrentQuant = parseInt(currentQuant);
                                    // console.log(`Sparsowane: ${parsedCurrentQuant}`)
                                    // console.log(`Pozostale: ${shelf.maxQuant - shelf.currentQuant}`)
                                    if (parsedCurrentQuant <= shelf.maxQuant - shelf.currentQuant) {
                                        if (parsedCurrentQuant <= currentlyAssignedProductQuantity) {
                                            setCurrentQuantError(false);
                                            setCurrentQuantErrorMessage("");
                                        } else {
                                            setCurrentQuantError(true);
                                            setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantAbovePiecesToDistribution);
                                        }
                                    } else {
                                        setCurrentQuantError(true)
                                        setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantNotEnoughSpace);
                                    }
                                } else {
                                    setCurrentQuantError(true)
                                    setCurrentQuantErrorMessage(shelfAssignmentErrorMessages.currentQuantValidNumber);
                                    // console.log("Nie Przeszlo")

                                }
                            }


                            return (

                                <View className="px-2 shadow mb-5">

                                    <View key={key} className="flex flex-row bg-slate-200 p-2 rounded-lg gap-2">

                                        {/* Rack Lane Level */}
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
                                            {
                                                shelf.maxQuant !== 0 ? (
                                                    <View className="flex-row items-center justify-between">
                                                        <Text className="font-bold text-2xl text-gray-800">Space:</Text>
                                                        <Text className="ml-2">{shelf.maxQuant - shelf.currentQuant}/{shelf.maxQuant}</Text>
                                                    </View>
                                                ) : (
                                                    <View className="flex-row items-center justify-between">
                                                        <Text className="font-bold text-2xl text-gray-800">Empty
                                                            shelf</Text>
                                                    </View>
                                                )
                                            }

                                        {/*<CustomButton handlePress={() => console.log(JSON.stringify(form))}></CustomButton>*/}

                                        </View>

                                        <View className="flex-1 flex-row items-center justify-between gap-2">
                                            <View className="flex-1 justify-center">
                                                <NumberFormField
                                                    title={shelf.maxQuant === 0 ? "Current" : "Assign"}
                                                    value={isAssignedToShelf ? currenltyAssignedQuantityToShelf : form.currentQuant.toString()}
                                                    handleChangeText={(e) => setForm({...form, currentQuant: e})}
                                                    onChange={shelf.maxQuant === 0 ? e => handleCurrentQuantForEmpty(e) : e => handleAssignQuantForNonEmpty(e)}
                                                    isError={currentQuantError}
                                                    iconsVisible={true}
                                                />
                                            </View>

                                            {shelf.maxQuant === 0 ? (
                                                <View className="flex-1 justify-center">
                                                    <NumberFormField
                                                        title="Max"
                                                        value={form.maxQuant.toString()}
                                                        handleChangeText={(e) => setForm({...form, maxQuant: e})}
                                                        onChange={e => handleMaxQuant(e)}
                                                        isError={maxQuantError}
                                                        iconsVisible={true}
                                                    />
                                                </View>
                                            ) : null
                                            }

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

                                    {/*<CustomButton handlePress={() => console.log(`Pierwotna lista: ${JSON.stringify(shelvesList)}`)} title="pierw" />*/}
                                    {/*<CustomButton handlePress={() => console.log("Nowa lista: " + JSON.stringify(localAssignedShelves))}></CustomButton>*/}

                                </View>

                            )
                        }
                    )
                }
                <CustomButton
                    handlePress={() => console.log("Local assignes shelves: " + JSON.stringify(localAssignedShelves))}></CustomButton>


            </ScrollView>
        </View>
    )

}

export default ProductDeliveryDistributionForm