import {Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React from "react";
import {ScrollView} from "react-native-gesture-handler";

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
                            <Text className="font-bold text-2xl">Quantity:</Text>
                            <Text className="ml-2">{product.quantity}</Text>
                        </View>

                        <View className="flex flex-row items-center justify-between mr-10">
                            <Text className="font-bold text-2xl">Barcode:</Text>
                            <Text className="ml-2">{product.barcode}</Text>
                        </View>


                        <View className="flex flex-row items-center justify-between mr-10">
                            <Text className="font-bold text-2xl">Price:</Text>
                            <Text className="ml-2">{product.price}</Text>
                        </View>

                    </View>

                </ScrollView>


            </View>
        </View>


    );
}

export default ProductMobileDetailDisplayer;