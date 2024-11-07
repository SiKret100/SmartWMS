import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

export default class laneService {

    static ip = process.env.EXPO_PUBLIC_IP;

    static GetAllWithRacksShelves = async () => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let response;
            if (Platform.OS === "web") {
                response = await axios.get(`${this.ip}/api/Lane/getAllWithRacksShelves`);
            } else {
                response = await axios.get(`${this.ip}/api/Lane/getAllWithRacksShelves`, config);
            }

            //console.log("From service:" + JSON.stringify(response.data));
            return response;
        } catch (err) {
            return err.response.data;
        }
    };


}