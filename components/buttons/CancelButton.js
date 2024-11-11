import {TouchableOpacity, View, Text} from "react-native";

const CancelButton = ({onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View className= "flex-row">
                <Text className={"color-red-600 font-bold f"}>
                    Cancel
                </Text>
            </View>


        </TouchableOpacity>
    )
}

export default CancelButton;