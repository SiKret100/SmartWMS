import {SafeAreaView, Text, View} from "react-native";
import React, {useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import {ScrollView} from "react-native-gesture-handler";
import rackErrorMessages from "../../data/ErrorMessages/rackErrorMessages";


const ShelfAssignForm = ({shelvesList, assignedShelves, setIsModalVisible, productQuantity}) => {

    //PROPS====================================================================================================
    const [currentlyAssignedProductQuantity, setCurrentlyAssignedProductQuantity] = useState(productQuantity);


    //FUNCTIONS=============================================================================================



    //USE EFFECT HOOKS=========================================================================================



    return (
        //wyswietlac ile jeszcze sztuk do rozdysponowania

        shelvesList.map(shelf => {

                const [key, setKey] = useState(shelf.shelfId);
                const [form, setForm] = useState({
                    shelfId: shelf.shelfId,
                    level: shelf.level,
                    maxQuant: "",
                    currentQuant: "",
                    productsProductId: shelf.productId,
                    racksRackId: shelf.rackLane.rackNumber,
                })

                const [maxQuantError, setMaxQuantError] = useState(false);
                const [currentQuantError, setCurrentQuantError] = useState(false);
                const [errorMessage, setErrorMessage] = useState("");

                const handleMaxQuant = (e) => {
                    const maxQuantVar = e.nativeEvent.text;

                    if(form.maxQuant.length !== 0 && form.currentQuant.length !== 0 ){
                        setErrorMessage("Maximum quantity is required");
                    }

                    if(maxQuantVar.length >= 1 && !maxQuantVar.startsWith("0")) {
                        const parsedMaxQuant = parseInt(maxQuantVar);
                        if (isNaN(parsedMaxQuant)) {
                            setMaxQuantError(true);
                            console.log('Error: not a number');
                        }
                        else {
                            if(parsedMaxQuant > 0 && parsedMaxQuant <= 2147483647)
                                setMaxQuantError(false)
                            else setMaxQuantError(true);
                        }
                    }
                    else{
                        setMaxQuantError(true);
                    }
                }

                const handleCurrentQuant = (e) => {
                    const currentQuant = e.nativeEvent.text;

                    if(form.maxQuant.length === 0 ){
                        setErrorMessage("Maximum quantity is required");
                    }

                    if (currentQuant.length >= 1 && !currentQuant.startsWith("0")) {
                        const parsedCurrentQuant = parseInt(currentQuant);
                        console.log(parsedCurrentQuant);

                        if (isNaN(parsedCurrentQuant)) {
                            setCurrentQuantError(true);
                            console.log('Error: not a number');
                        } else {
                            if ( parsedCurrentQuant > 0 && parsedCurrentQuant <= form.currentQuant ) {
                                setCurrentQuantError(false);
                                console.log('No error');
                            }else{
                                setCurrentQuantError(true);
                                console.log('Error');
                            }
                        }
                    } else {
                        setCurrentQuantError(true);
                        console.log('No error');
                    }
                }

            const validateQuantities = (field, value) => {
                const parsedValue = parseInt(value);

                // Aktualizacja formularza
                setForm(prevForm => ({
                    ...prevForm,
                    [field]: value
                }));

                // Sprawdzenie błędów
                if (field === "maxQuant" && form.currentQuant.length > 0) {
                    if (value.length === 0) {
                        setErrorMessage("Maximum quantity is required");
                        setMaxQuantError(true);
                        return;
                    }
                }

                if (field === "currentQuant") {
                    if (form.maxQuant.length === 0) {
                        setErrorMessage("Maximum quantity is required");
                        setCurrentQuantError(true);
                        return;
                    }

                    const maxQuantParsed = parseInt(form.maxQuant);
                    if (parsedValue > maxQuantParsed) {
                        setErrorMessage("Current quantity cannot exceed maximum quantity");
                        setCurrentQuantError(true);
                        return;
                    }
                }

                setErrorMessage("");
                setMaxQuantError(false);
                setCurrentQuantError(false);
            };

                return (

                    <View className={"px-2 shadow"}>

                        <ScrollView className={"px-2 mt-7"}>
                            <View key={key}
                                  className={"flex flex-row justify-between bg-slate-200 p-2  rounded-lg mt-5"}>

                                <View className={"flex-1"}>

                                    <View className="flex-row items-center justify-between mr-10">
                                        <Text className={"font-bold text-2xl text-gray-800"}>Lane:</Text>
                                        <Text className={"ml-2"}>{shelf.rackLane.lane.laneCode}</Text>
                                    </View>

                                    <View className="flex-row items-center justify-between mr-10">
                                        <Text className={"font-bold text-2xl text-gray-800"}>Rack:</Text>
                                        <Text className={"ml-2"}>{shelf.rackLane.rackNumber}</Text>
                                    </View>


                                    <View className="flex-row items-center justify-between mr-10">
                                        <Text className={"font-bold text-2xl text-gray-800"}>Shelf:</Text>
                                        <Text className={"ml-2"}>{shelf.level}</Text>
                                    </View>

                                </View>

                                <View className={"flex-col justify-center flex-1 mr-5"}>
                                    <NumberFormField
                                        title="Current Quantity"
                                        value={form.currentQuant.toString()}
                                        handleChangeText={(e) => setForm({...form, currentQuant: e})}
                                        onChange={e => handleCurrentQuant(e)}
                                        isError={currentQuantError}
                                        iconsVisible={true}
                                    />
                                </View>

                                <View className={"flex-col justify-center flex-1"}>
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

                            {(currentQuantError && form.currentQuant.length > 0) ? <Text className={'text-red-600'}>{errorMessage}</Text> : null}

                        </ScrollView>
                    </View>


                )
            }
        )

    )
}

export default ShelfAssignForm;