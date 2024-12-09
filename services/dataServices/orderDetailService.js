import {Platform} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default class orderDetailService {
    static ip = process.env.EXPO_PUBLIC_IP;
    static userDto;

    static GetAllByOrderHeader = async (id) => {
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
                response = await axios.get(`${this.ip}/api/OrderDetail/byOrderHeader/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/OrderDetail/byOrderHeader/${id}`, config);
            }

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
                response = await axios.get(`${this.ip}/api/OrderDetail/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/OrderDetail/${id}`, config);
            }

            return response;
        } catch (err) {
            return err.response.data;
        }
    }

};
