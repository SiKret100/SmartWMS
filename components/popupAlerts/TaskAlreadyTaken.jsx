import {Alert} from "react-native";


const CustomAlert = (message) => {

    Alert.alert('Warning', message, [
        {
            text: 'Ok',
            onPress: () => {},
            style: 'cancel'
        }
    ])

}

export default CustomAlert