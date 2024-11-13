import {SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import {ScrollView} from "react-native-gesture-handler";
import rackErrorMessages from "../../data/ErrorMessages/rackErrorMessages";
import CancelButton from "../buttons/CancelButton";
import CustomButton from "../buttons/CustomButton";


const ShelfAssignForm = ({shelvesList, assignedShelves, setAssignedShelves, setIsModalVisible, productQuantity}) => {

    //PROPS====================================================================================================
    const [currentlyAssignedProductQuantity, setCurrentlyAssignedProductQuantity] = useState(productQuantity);
    const [tempShelvesList, setTempShelvesList] = useState(shelvesList);

    //FUNCTIONS=============================================================================================



    //USE EFFECT HOOKS=========================================================================================



    return (
        //wyswietlac ile jeszcze sztuk do rozdysponowania

        <View>
            <ScrollView className={"px-2"}>
                <View className="flex flex-col items-start justify-between my-5 mx-5">
                    <CancelButton onPress={() => setIsModalVisible(false)} />
                    <Text className="my-5 text-3xl font-bold">Assign Prodcut to shelves</Text>
                </View>

                <Text className={"text-2xl font-bold text-center mb-5"}>
                    {currentlyAssignedProductQuantity} pieces remain for assignment
                </Text>
                {
                    tempShelvesList.map(shelf => {

                        //PROPS====================================================================================================
                        const [key, setKey] = useState(shelf.shelfId);
                        const [form, setForm] = useState({
                            shelfId: shelf.shelfId,
                            level: shelf.level,
                            maxQuant: "",
                            currentQuant: "",
                            productsProductId: shelf.productId,
                            racksRackId: shelf.rackLane.rackNumber,
                        })

                        const [maxQuantError, setMaxQuantError] = useState(true);
                        const [currentQuantError, setCurrentQuantError] = useState(true);
                        const [currentQuantErrorMessage, setCurrentQuantErrorMessage] = useState("");
                        const [maxQuantErrorMessage, setMaxQuantErrorMessage] = useState("");


                        //FUNCTIONS=============================================================================================
                        const handleAssignShelf = () => {
                            setCurrentlyAssignedProductQuantity(prevQuantity => prevQuantity - parseInt(form.currentQuant));
                            setAssignedShelves(prevArr => [...prevArr, form])
                            //setTempShelvesList(tempShelvesList.filter(shelf => shelf.shelfId !== form.shelfId));
                        }

                        const handleMaxQuant = (e) => {
                            const maxQuantVar = e.nativeEvent.text;

                            // if(form.maxQuant.length !== 0 && form.currentQuant.length !== 0 ){
                            //     setErrorMessage("Maximum quantity is required");
                            // }

                            if(maxQuantVar.length >= 1 && !maxQuantVar.startsWith("0")) {
                                const parsedMaxQuant = parseInt(maxQuantVar);
                                if (isNaN(parsedMaxQuant)) {
                                    setMaxQuantError(true);
                                    setMaxQuantErrorMessage("Entered value for max quantity is not a number");
                                    console.log('Error: not a number');
                                }
                                else {
                                    const parsedCurrentQuant = parseInt(form.currentQuant);
                                    if(parsedMaxQuant > 0 && parsedMaxQuant <= 2147483647) {
                                        setMaxQuantError(false)
                                        setMaxQuantErrorMessage("")
                                        if(isNaN(parsedCurrentQuant)) {
                                            setCurrentQuantError(true);
                                            setCurrentQuantErrorMessage("Enterd value for current quantity is not a number");
                                        }
                                        else {
                                            if(parsedCurrentQuant > parsedMaxQuant){
                                                setCurrentQuantErrorMessage("Current Quantity is either less than zero or exceeds max quantity value");
                                                setCurrentQuantError(true);
                                            }
                                            else {
                                                setCurrentQuantErrorMessage("");
                                                setCurrentQuantError(false);
                                            }
                                        }
                                    }

                                    else {
                                        setMaxQuantError(true);
                                        setMaxQuantErrorMessage("Please enter a positive number greater than 0");
                                    }
                                }
                            }
                            else{
                                setMaxQuantErrorMessage("Please enter a valid max quantity number");
                                setMaxQuantError(true);
                            }
                        }

                        const handleCurrentQuant = (e) => {
                            const currentQuant = e.nativeEvent.text;

                            if (currentQuant.length >= 1 && !currentQuant.startsWith("0")) {
                                const parsedCurrentQuant = parseInt(currentQuant);
                                console.log(parsedCurrentQuant);

                                if (isNaN(parsedCurrentQuant)) {
                                    setCurrentQuantError(true);
                                    setCurrentQuantErrorMessage("Entered value for max quantity is not a number")
                                    console.log('Entered value for current quantity is not a number');
                                } else {
                                    if ( parsedCurrentQuant > 0 && parsedCurrentQuant <= currentlyAssignedProductQuantity) {
                                        setCurrentQuantError(false);
                                        setCurrentQuantErrorMessage("")
                                        console.log('No error');
                                    }else{
                                        setCurrentQuantError(true);
                                        setCurrentQuantErrorMessage("Entered value is either less than zero or exceeds product's quantity");
                                        console.log('Error');
                                    }
                                }
                            } else {
                                setCurrentQuantError(true);
                                setCurrentQuantErrorMessage("Please enter a valid current quantity number");
                                console.log('Error');
                            }
                        }

                        // const validateQuantities = (field, value) => {
                        //     const parsedValue = parseInt(value);
                        //
                        //     // Aktualizacja formularza
                        //     setForm(prevForm => ({
                        //         ...prevForm,
                        //         [field]: value
                        //     }));
                        //
                        //     // Sprawdzenie błędów
                        //     if (field === "maxQuant" && form.currentQuant.length > 0) {
                        //         if (value.length === 0) {
                        //             setErrorMessage("Maximum quantity is required");
                        //             setMaxQuantError(true);
                        //             return;
                        //         }
                        //     }
                        //
                        //     if (field === "currentQuant") {
                        //         if (form.maxQuant.length === 0) {
                        //             setErrorMessage("Maximum quantity is required");
                        //             setCurrentQuantError(true);
                        //             return;
                        //         }
                        //
                        //         const maxQuantParsed = parseInt(form.maxQuant);
                        //         if (parsedValue > maxQuantParsed) {
                        //             setErrorMessage("Current quantity cannot exceeds maximum quantity");
                        //             setCurrentQuantError(true);
                        //             return;
                        //         }
                        //     }
                        //
                        //     setErrorMessage("");
                        //     setMaxQuantError(false);
                        //     setCurrentQuantError(false);
                        // };

                        return (

                            <View className={"px-2 shadow mb-5"}>

                                <View key={key} className={"flex flex-row  bg-slate-200 p-2 rounded-lg"}>

                                    {/*Rack Lane Level*/}
                                    <View className={"justify-center"}>

                                        <View className="flex-row items-center justify-between mr-10">
                                            <Text className={"font-bold text-2xl text-gray-800"}>Lane:</Text>
                                            <Text className={"ml-2"}>{shelf.rackLane.lane.laneCode}</Text>
                                        </View>

                                        <View className="flex-row items-center justify-between mr-10">
                                            <Text className={"font-bold text-2xl text-gray-800"}>Rack:</Text>
                                            <Text className={"ml-2"}>{shelf.rackLane.rackNumber}</Text>
                                        </View>


                                        <View className="flex-row items-center justify-between mr-10">
                                            <Text className={"font-bold text-2xl text-gray-800"}>Level:</Text>
                                            <Text className={"ml-2"}>{shelf.level}</Text>
                                        </View>

                                    </View>

                                    {/*MaxQuant CurrentQuant Button*/}
                                    <View className={"flex-col"}>
                                        <View className={"flex-row items-center"}>

                                            <View className={"justify-center mr-10"}>
                                                <NumberFormField
                                                    title="Current Quantity"
                                                    value={form.currentQuant.toString()}
                                                    handleChangeText={(e) => setForm({...form, currentQuant: e})}
                                                    onChange={e => handleCurrentQuant(e)}
                                                    isError={currentQuantError}
                                                    iconsVisible={true}
                                                />
                                            </View>

                                            <View className={"justify-center"}>
                                                <NumberFormField
                                                    title="Max Quantity"
                                                    value={form.maxQuant.toString()}
                                                    handleChangeText={(e) => setForm({...form, maxQuant: e}) }
                                                    onChange = {e => handleMaxQuant(e)}
                                                    isError={maxQuantError}
                                                    iconsVisible={true}
                                                />

                                            </View>

                                        </View>

                                        <View>

                                            <CustomButton
                                                handlePress={() => handleAssignShelf()}
                                                title={"Assign to shelf"}
                                                isLoading={currentQuantError || maxQuantError}
                                                showLoading={false}
                                            />

                                            <CustomButton
                                                handlePress={() => console.log(`Assigned shelves: ${JSON.stringify(assignedShelves)}`)}
                                                title={"Show assigned"}
                                                isLoading={currentQuantError || maxQuantError}
                                                showLoading={false}
                                            />

                                        </View>

                                    </View>

                                </View>
                                {(currentQuantError && form.currentQuant.length > 0) ? (<Text className={"color-red-600"}> {currentQuantErrorMessage} </Text>) : null}
                                {(maxQuantError && form.maxQuant.length > 0) ? (<Text className={"color-red-600"}> {maxQuantErrorMessage} </Text>) : null}

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