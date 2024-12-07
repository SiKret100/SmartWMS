import {Alert} from "react-native";


const NoPermissionAlert = () => {

        Alert.alert('Warning', 'You have no permission.', [
            {
                text: 'Ok',
                onPress: () => {},
                style: 'cancel'
            }
        ])

}

export default NoPermissionAlert