import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import CancelButton from "../buttons/CancelButton";
import React, {useEffect, useState} from "react";
import NumberFormField from "../form_fields/NumberFormField";
import {Button} from "react-native-elements";
import {Feather} from "@expo/vector-icons";
import CustomButton from "../buttons/CustomButton";
import shelfAssignmentErrorMessages from "../../data/ErrorMessages/shelfAssignmentErrorMessages";
import * as Progress from "react-native-progress";
import CustomEditButtonFlatList from "../buttons/CustomEditButtonFlatList";
import CustomAlert from "../popupAlerts/TaskAlreadyTaken";


const ProductDeliveryDistributionForm = ({
                                             productQuantity,
                                             shelvesList,
                                             setIsModalVisible,
                                             assignedShelves,
                                             setAssignedShelves,
                                             setError
                                         }) => {
    const [currentlyAssignedProductQuantity, setCurrentlyAssignedProductQuantity] = useState(productQuantity);
    const [localAssignedShelves, setLocalAssignedShelves] = useState([]);
    const [totalToAssign, setTotalToAssign] = useState(productQuantity);
    const progress =  (totalToAssign - currentlyAssignedProductQuantity)/ totalToAssign ;

    //const [tempShelvesList, setTempShelvesList] = useState(shelvesList);


    useEffect(() => {
        if (currentlyAssignedProductQuantity === 0) {
            setAssignedShelves(localAssignedShelves);
            setError(false);
            setIsModalVisible(false)

            return () => {
                setCurrentlyAssignedProductQuantity(0);
                setLocalAssignedShelves([]);
            };

        }
    }, [currentlyAssignedProductQuantity])

    return (

        <ScrollView>
            <View className="flex flex-col items-start justify-between my-5 mx-5">
                <CancelButton onPress={() => setIsModalVisible(false)}/>
            </View>

            <View className={"flex-row mt-2 gap-5 mx-4"}>

                <View className={" flex-auto px-2 flex-col bg-slate-200 rounded-lg shadow "}>

                    <View className={"flex-col justify-between py-1 ml-3 mt-3"}>
                        <Text className={"text-2xl font-bold text-gray-800 text-smartwms-blue"}>Total to assign</Text>
                        <Text
                            className={"text-xl color-gray-500"}>{totalToAssign}</Text>
                    </View>

                    <View className={"flex-col justify-between ml-3 mt-3"}>
                        <Text className={"text-2xl font-bold text-gray-800 text-smartwms-blue"}>Pieces remained</Text>
                        <Text className={"text-xl color-gray-500"}>{currentlyAssignedProductQuantity}</Text>
                    </View>

                </View>

                <View className="flex-auto flex-col bg-slate-200 p-2 rounded-lg shadow items-center justify-center">

                    <Text className="text-center font-bold color-gray-500">
                        Progress
                    </Text>

                    <Text className="text-2xl text-center font-bold text-smartwms-blue">
                        { (totalToAssign - currentlyAssignedProductQuantity)} / { totalToAssign}
                    </Text>

                    <Progress.Circle
                        className={"px-2 shadow py-2"}
                        size={80}
                        progress={progress}
                        thickness={19}
                        color="#FFB50C"
                        unfilledColor="#d9dbdf"
                        borderWidth={5}
                        borderColor={"#475f9c"}
                    />
                </View>

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
                            // const newQuant = parseInt(form.currentQuant).toString();
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
                                setIsModalVisible(false);
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
                                // setCurrentlyAssignedProductQuantity( parseInt(alreadyAssignedShelf[0].currentQuant));
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


                            <View key={shelf.shelfId} className={"bg-slate-200 flex-col justify-stretch gap-2 mt-5 mx-4 rounded-lg shadow"}>

                                <View className={"flex-row"}>
                                    <View className={"flex-col flex-1 basis-3/5 justify-center gap-2 rounded-lg  p-2"}>


                                        <View className={"flex-row bg-blue-200 rounded-lg"}>

                                            <View
                                                className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                                <Feather name="git-pull-request" size={30} color="#FFFFFF"/>
                                            </View>

                                            <View className={"flex-col mx-2 my-1"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Lane</Text>
                                                <Text className={"text-smartwms-blue"}>{shelf.rackLane.lane.laneCode}</Text>
                                            </View>
                                        </View>

                                        <View className={"flex-row bg-blue-200 rounded-lg "}>

                                            <View
                                                className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                                <Feather name="grid" size={30} color="#FFFFFF"/>
                                            </View>

                                            <View className={"flex-col mx-2 my-1"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Rack</Text>
                                                <Text className={"text-smartwms-blue "}>{shelf.rackLane.rackNumber}</Text>
                                            </View>

                                        </View>

                                        <View className={"flex-row bg-blue-200 rounded-lg "}>

                                            <View
                                                className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                                <Feather name="align-justify" size={30} color="#FFFFFF"/>
                                            </View>

                                            <View className={"flex-col mx-2 my-1"}>
                                                <Text className={"text-smartwms-blue text-xl font-bold"}>Level</Text>
                                                <Text className={"text-smartwms-blue "}>{shelf.level}</Text>
                                            </View>

                                        </View>
                                    </View>

                                    <View className={"flex-col flex-1 justify-center basis-2/5"}>

                                        <View className={"flex-row px-2"}>
                                            <View className={"w-2 rounded bg-smartwms-orange mr-2 my-4"}/>
                                            <View className={"flex-1"}>
                                                <NumberFormField
                                                    title={shelf.maxQuant === 0 ? "Current" : "Assign"}
                                                    value={isAssignedToShelf ? currenltyAssignedQuantityToShelf : form.currentQuant.toString()}
                                                    handleChangeText={(e) => setForm({...form, currentQuant: e})}
                                                    onChange={shelf.maxQuant === 0 ? e => handleCurrentQuantForEmpty(e) : e => handleAssignQuantForNonEmpty(e)}
                                                    isError={currentQuantError}
                                                    iconsVisible={true}
                                                    textStyles={"color-smartwms-blue font-bold"}
                                                />
                                            </View>
                                        </View>


                                        <View className={"flex-row px-2 "}>
                                            <View className={"w-2 rounded bg-smartwms-orange mr-2 my-4"}/>
                                            <View className={"flex-1"}>
                                                <NumberFormField
                                                    title="Maximum"
                                                    value={form.maxQuant.toString()}
                                                    handleChangeText={(e) => setForm({...form, maxQuant: e})}
                                                    onChange={e => handleMaxQuant(e)}
                                                    isError={maxQuantError}
                                                    iconsVisible={true}
                                                    textStyles={"color-smartwms-blue font-bold"}
                                                    editable={shelf.maxQuant === 0}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row  justify-center items-cente">

                                    <CustomEditButtonFlatList  disabled={currentQuantError || maxQuantError || isAssignedToShelf} onEdit={() => handleAssignShelf() } icon={"plus-circle"} title={"Add" } containerStyles={`flex-1 ${currentQuantError || maxQuantError || isAssignedToShelf ? "bg-gray-500" : " bg-green-500"}   rounded-b-lg`} textStyles={"text-white"}></CustomEditButtonFlatList>

                                </View>

                            </View>

                        )
                    }
                )
            }

        </ScrollView>

    )

}

export default ProductDeliveryDistributionForm