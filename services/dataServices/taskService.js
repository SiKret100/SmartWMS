import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {router} from "expo-router";

export default class taskService {
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
                response = await axios.get(`${this.ip}/api/Task`);
            } else {
                response = await axios.get(`${this.ip}/api/Task`, config);
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
                response = await axios.get(`${this.ip}/api/Task/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/Task/${id}`, config);
            }

            console.log("Response from service:" + response);
            return response;
        } catch (err) {
            console.log("Error from service: " + err);
            return err.response.data;
        }
    }

    static UserTasks = async () => {
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
                response = await axios.get(`${this.ip}/api/Task/usertasks`);
            } else {
                response = await axios.get(`${this.ip}/api/Task/usertasks`, config);
            }

            // console.log("From service:" + JSON.stringify(response));
            return response;
        } catch (err) {
            // console.log("Error from service: " + JSON.stringify(err));
            return err.response.data;
        }

    }

    static TaskOrderInfo = async (id) => {

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
                response = await axios.get(`${this.ip}/api/Task/orderInfo/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/Task/orderInfo/${id}`, config);
            }

            console.log("From service:" + JSON.stringify(response));
            return response;
        } catch (err) {
            console.log("Error from service: " + JSON.stringify(err));
            return err.response.data;
        }
    }

    static TakeTask = async (id) => {

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
                response = await axios.post(`${this.ip}/api/Task/take/${id}`, {});
            } else {
                response = await axios.post(`${this.ip}/api/Task/take/${id}`, {}, config);
            }

            console.log("Service response: "  + JSON.stringify(response));

            return response;
        } catch (err) {
            console.log(`Error from service: ${JSON.stringify(err)}`);
            throw err.response.data;
        }
    }

    static TaskUpdateQuantity = async (id) => {

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
                response = await axios.post(`${this.ip}/api/Task/UpdateQuantity/${id}`, {});
            } else {
                response = await axios.post(`${this.ip}/api/Task/UpdateQuantity/${id}`, {}, config);
            }

            console.log("Service response: "  + JSON.stringify(response));

            return response;
        } catch (err) {
            console.log(`Error from service: ${JSON.stringify(err)}`);
            return err.response.data;
        }
    }
}