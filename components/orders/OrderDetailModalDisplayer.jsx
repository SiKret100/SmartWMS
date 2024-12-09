import {
    Text,
    View
} from "react-native";
import CancelButton from "../buttons/CancelButton";
import {ScrollView} from "react-native-gesture-handler";
import {Feather} from "@expo/vector-icons";

const OrderDetailModalDisplayer = ({currentOrderDetail, setIsModalVisible}) => {
    return (

        <View>

            <View className="flex flex-col items-start justify-between mt-2 px-2">
                <CancelButton onPress={() => setIsModalVisible(false)}/>
                <Text className={"text-5xl font-bold mt-4"}>Order detail:</Text>
            </View>

            <ScrollView className={"px-2 shadow h-full"}>

                {
                    currentOrderDetail.map(item => {
                        return (
                            <View className={"flex flex-row justify-stretch bg-slate-200 p-2  rounded-lg mt-5"}>

                                <View className="flex-2 flex-row  items-center justify-center">

                                    <Feather color = "#3E86D8" className={"m-2"} name={"box"} size={24}></Feather>


                                    <View className=" flex-col items-center justify-between">
                                        <Text className={" font-bold text-2xl text-gray-800 "}>Product:</Text>
                                        <Text className={" font-bold text-2xl text-gray-800 "}>Quantity:</Text>
                                    </View>

                                </View>

                                <View className={"flex-1 flex-row justify-center"}>

                                    <View className=" flex-col items-center justify-between">
                                        <Text className={" justify-center text-2xl "}>{item.productName}</Text>
                                        <Text className={" text-2xl text-center"}>{item.quantity}</Text>
                                    </View>

                                </View>

                            </View>
                        )
                    })
                }

            </ScrollView>

        </View>
    )
}

export default OrderDetailModalDisplayer