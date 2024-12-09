import {Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React from "react";
import {ScrollView} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";
import * as Progress from "react-native-progress";

const ProductsMobileDetailDisplayer = ({product, setIsModalVisible}) => {
    return (

        <View>

            <View className="flex flex-col items-start justify-between mt-2 px-2">
                <CancelButton onPress={() => setIsModalVisible(false)}/>
            </View>

            <View className={"px-4 shadow"}>

                <ScrollView className={"mt-7"}>

                    <View className={"flex flex-col justify-start bg-slate-200 p-2 rounded-lg"}>


                        <View className={"flex-row items-center"}>

                            <Feather color="#3E86D8" className={"mr-2"} name={"archive"} size={45}/>

                            <View className={"flex-col"}>
                                <Text className={"text-smartwms-blue text-2xl font-bold"}>{product.productName}</Text>
                                <Text className={"text-xl color-gray-500"}>{product.barcode}</Text>
                            </View>

                        </View>

                        <View className={"flex-row gap-4 my-2"}>
                            <View className={"flex-row"}>
                                <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                <View className={"flex-col"}>
                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Quantity</Text>
                                    <Text className={" color-gray-500"}>{product.quantity}</Text>
                                </View>
                            </View>

                            <View className={"flex-row"}>
                                <View className={"h-full w-2 rounded bg-smartwms-orange mr-2"}/>
                                <View className={"flex-col"}>
                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Price</Text>
                                    <Text className={" color-gray-500"}>{product.price} PLN</Text>
                                </View>
                            </View>

                            <View className="flex-row">
                                <View className="h-full w-2 rounded bg-smartwms-orange mr-2"/>
                                <View className="flex-col w-44">
                                    <Text className="text-smartwms-blue text-xl font-bold">Description</Text>
                                    <Text className="color-gray-500 flex-wrap">{product.productDescription}</Text>
                                </View>
                            </View>

                        </View>

                    </View>

                    {product.shelves.length > 0 && product.shelves.map(shelf => {
                            const progress = shelf.currentQuant / shelf.maxQuant
                            const stockPercentage = (shelf.currentQuant / shelf.maxQuant) * 100;
                            const textColor = stockPercentage < 25 ? "rgb(239 68 68)"
                                : stockPercentage < 75 ? "#FFC031"
                                    : "rgb(34 197 94)";

                            return (

                                <View key={shelf.shelfId} className={"flex-row gap-5 mt-5"}>

                                    <View className={"flex-row items-center rounded-lg  bg-slate-200 p-2 flex-1"}>

                                        <View className={"flex-col gap-2 w-full"}>
                                            <View className={"flex-row bg-blue-200 rounded-lg"}>

                                                <View
                                                    className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                                    <Feather name="git-pull-request" size={30} color="#FFFFFF"/>
                                                </View>

                                                <View className={"flex-col mx-2 my-1"}>
                                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Lane</Text>
                                                    <Text
                                                        className={"text-smartwms-blue"}>{shelf.rackLane.lane.laneCode}</Text>
                                                </View>

                                            </View>

                                            <View className={"flex-row bg-blue-200 rounded-lg "}>

                                                <View
                                                    className="flex-row bg-smartwms-blue rounded-lg justify-center items-center p-2">
                                                    <Feather name="grid" size={30} color="#FFFFFF"/>
                                                </View>

                                                <View className={"flex-col mx-2 my-1"}>
                                                    <Text className={"text-smartwms-blue text-xl font-bold"}>Rack</Text>
                                                    <Text
                                                        className={"text-smartwms-blue "}>{shelf.rackLane.rackNumber}</Text>
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
                                    </View>


                                    <View
                                        className="flex-col bg-slate-200 rounded-lg items-center justify-center flex-2 px-5">

                                        <Text className="text-center font-bold color-gray-500">
                                            Items left
                                        </Text>

                                        <Text className="text-2xl text-center font-bold text-smartwms-blue">
                                            {shelf.currentQuant} / {shelf.maxQuant}
                                        </Text>

                                        <Progress.Circle
                                            className={"px-2 py-2 shadow m-2 mt-2"}
                                            size={90}
                                            progress={progress}
                                            thickness={19}
                                            color={textColor}
                                            unfilledColor="#d9dbdf"
                                            borderWidth={5}
                                            borderColor={"#475f9c"}
                                        />
                                    </View>

                                </View>

                            )

                        }
                    )}

                </ScrollView>

            </View>
        </View>


    );
}

export default ProductsMobileDetailDisplayer;