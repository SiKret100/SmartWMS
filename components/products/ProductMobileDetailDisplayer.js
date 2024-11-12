import {Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React from "react";
import {ScrollView} from "react-native-gesture-handler";
import CustomButton from "../buttons/CustomButton";
import {Divider} from "react-native-elements";

const ProductMobileDetailDisplayer = ({product, setIsModalVisible}) => {
    return (

        <View>
            <View className="flex flex-col items-start justify-between mt-2 px-2">
                <CancelButton onPress={() => setIsModalVisible(false)}/>
                <Text className={"text-5xl font-bold mt-4"}>{product.productName}</Text>
            </View>

            <View className={"px-2 shadow"}>

                <ScrollView className={"px-2 mt-7"}>

                    <View className={"flex flex-col justify-start bg-slate-200 p-2  rounded-lg"}>

                        <View className="flex-row items-center justify-between mr-10">
                            <Text className="font-bold text-2xl text-gray-800">Quantity:</Text>
                            <Text className="ml-2">{product.quantity}</Text>
                        </View>

                        <View className="flex flex-row items-center justify-between mr-10">
                            <Text className="font-bold text-2xl text-gray-800">Barcode:</Text>
                            <Text className="ml-2">{product.barcode}</Text>
                        </View>


                        <View className="flex flex-row items-center justify-between mr-10">
                            <Text className="font-bold text-2xl text-gray-800">Price:</Text>
                            <Text className="ml-2">{product.price}</Text>
                        </View>


                    </View>

                    <View className={"bg-slate-200 p-2 rounded-lg mt-5"}>
                        <View className="flex-col items-start justify-between mr-10">
                            <Text className="font-bold text-2xl text-gray-800">Description:</Text>
                            <Text className="mt-2">{product.productDescription}</Text>
                        </View>
                    </View>

                    <Divider width={5} className={"mt-5 color-gray-800 rounded"}/>

                    <Text className={"text-3xl font-bold mt-4 shadow-amber-400"}>Locations:</Text>


                    {product.shelves.length > 0 && product.shelves.map(shelf => {
                            const stockPercentage = (shelf.currentQuant / shelf.maxQuant) * 100;
                            const textColor = stockPercentage < 25 ? "text-red-500"
                                : stockPercentage < 75 ? "text-yellow-500"
                                    : "text-green-500";

                            return (

                                <View key={shelf.shelfId}
                                      className={"flex flex-row justify-between bg-slate-200 p-2  rounded-lg mt-5"}>

                                    <View>
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

                                    <View className={"flex-col justify-center"}>
                                        <Text
                                            className={`mr-10 text-5xl font-semibold  ${textColor}`}>{shelf.currentQuant}/{shelf.maxQuant}</Text>
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

export default ProductMobileDetailDisplayer;