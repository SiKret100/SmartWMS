import {Platform} from "react-native";
import {getItem} from "expo-secure-store";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default class orderHeaderService {
    static ip = process.env.EXPO_PUBLIC_IP;
    static userDto;

    static Add = async (data) => {
        const token = Platform.OS !== "web" ? getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            let response;
            if (Platform.OS === "web") {
                response = await axios.post(`${this.ip}/api/OrderHeader/createOrder`, data);
            } else {
                response = await axios.post(`${this.ip}/api/OrderHeader/createOrder`, data, config);
            }

            // console.log("Data from service: " + JSON.stringify(data));
            // console.log("Service response: "  + JSON.stringify(response));

            return response;
        } catch (err) {
            // console.log(`errory z serwisu: ${JSON.stringify(err)}`);
            return err.response.data;
        }

    }

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
                response = await axios.get(`${this.ip}/api/OrderHeader`);
            } else {
                response = await axios.get(`${this.ip}/api/OrderHeader`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    };

    static GetWithDetails = async () => {
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
                response = await axios.get(`${this.ip}/api/OrderHeader/withDetails`);
            } else {
                response = await axios.get(`${this.ip}/api/OrderHeader/withDetails`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    }


    static Delete = async (id) => {

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
                response = await axios.delete(`${this.ip}/api/OrderHeader/cancelOrder/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/OrderHeader/cancelOrder/${id}`, config);
            }

            // console.log("Delete response: " + JSON.stringify(response.data));
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }

};
