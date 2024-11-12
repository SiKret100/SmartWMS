import {Platform} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default class productService {
    static ip = process.env.EXPO_PUBLIC_IP

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
                response = await axios.get(`${this.ip}/api/Product`);
            } else {
                response = await axios.get(`${this.ip}/api/Product`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }

    }

    static GetOneWithShelves = async (id) => {

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
                response = await axios.get(`${this.ip}/api/Product/withShelves/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/Product/withShelves/${id}`, config);
            }

            console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }

    }

    static GetAllWithShelves = async () => {

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
                response = await axios.get(`${this.ip}/api/Product/withShelves`);
            } else {
                response = await axios.get(`${this.ip}/api/Product/withShelves`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    }

}