import {Platform, ActivityIndicator, FlatList, Modal, RefreshControl, SafeAreaView, Text, View} from "react-native";
import CancelButton from "../buttons/CancelButton";
import React from "react";


const ProductMobileTakeDeliveryModal = ({setIsModalVisible}) => {

    return (
        <View className="flex flex-col items-start justify-between mt-2 px-2">
            <CancelButton onPress={() => setIsModalVisible(false)} />
            <Text className={"text-3xl font-bold mt-4"}>Choose product for delivery:</Text>
        </View>


    )
}

export default ProductMobileTakeDeliveryModal