import { Text, View } from "react-native";
import CancelButton from "../buttons/CancelButton";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-elements";

const ShelfAssignDisplayer = ({ assignedShelves, setIsModalVisible }) => {
    return (
        <View>
            <View className="flex flex-col items-start justify-between mt-2 px-2">
                <CancelButton onPress={() => setIsModalVisible(false)} />
                <Text className={"text-5xl font-bold mt-4"}>Assigned shelves:</Text>
            </View>

            <ScrollView className={"px-4 shadow py-2"}>
                {assignedShelves.map(shelf => {
                    const stockPercentage = (shelf.currentQuant / shelf.maxQuant) * 100;
                    const textColor = stockPercentage < 25 ? "text-red-500"
                        : stockPercentage < 75 ? "text-yellow-500"
                            : "text-green-500";

                    return (
                        <View key={shelf.shelfId} className={"flex flex-row justify-between bg-slate-200 p-2 rounded-lg mt-5"}>
                            <View>
                                <View className="flex-row items-center justify-between mr-10">
                                    <Text className={"font-bold text-2xl text-gray-800"}>Lane:</Text>
                                    <Text className={"ml-2"}>{shelf.lane}</Text>
                                </View>

                                <View className="flex-row items-center justify-between mr-10">
                                    <Text className={"font-bold text-2xl text-gray-800"}>Rack:</Text>
                                    <Text className={"ml-2"}>{shelf.rack}</Text>
                                </View>

                                <View className="flex-row items-center justify-between mr-10">
                                    <Text className={"font-bold text-2xl text-gray-800"}>Shelf:</Text>
                                    <Text className={"ml-2"}>{shelf.level}</Text>
                                </View>
                            </View>

                            <View className={"flex-col justify-center"}>
                                <Text className={`mr-10 text-5xl font-semibold ${textColor}`}>
                                    {shelf.currentQuant}/{shelf.maxQuant}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default ShelfAssignDisplayer;
