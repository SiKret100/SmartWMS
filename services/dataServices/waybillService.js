import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";


export default class waybillService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static GetAll = async () => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try{
            let response

            if (Platform.OS === "web") {
                response = await axios.get(`${this.ip}/api/Waybill`);
            } else {
                response = await axios.get(`${this.ip}/api/Waybill`, config);
            }

            //console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }


}