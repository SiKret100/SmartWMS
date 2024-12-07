import axios from "axios";
import {Platform} from "react-native";
import AlertDto from "../../data/DTOs/alertDto";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

axios.defaults.withCredentials = true;

export default class countryService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static GetAll = async () => {
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
                response = await axios.get(`${this.ip}/api/Country`);
            } else {
                response = await axios.get(`${this.ip}/api/Country`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    };

    static Get = async (id) => {
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
                response = await axios.get(`${this.ip}/api/Country/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/Country/${id}`, config);
            }

            console.log("Response from service: " + JSON.stringify(response.data));
            return response;
        } catch (err) {
            console.log("Error from service" + JSON.stringify(err));
            return err.response.data;
        }
    };

}