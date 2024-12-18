import axios from "axios";
import {Platform} from "react-native";
import * as SecureStore from "expo-secure-store";

axios.defaults.withCredentials = true;

export default class crudService {
    static ip = process.env.EXPO_PUBLIC_IP;

    static Post = async (data, url) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

           return await axios.post(`${this.ip}/api/${url}`, data, config);

        } catch (err) {

            throw err.response.data;
        }
    };

    static GetAll = async (url) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            return await axios.get(`${this.ip}/api/${url}`, config);

        } catch (err) {

            throw err.response.data;

        }
    };

    static Update = async (id, data, url) => {

        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            return await axios.put(`${this.ip}/api/${url}/${id}`, data, config);

        } catch (err) {

            throw err.response.data;

        }
    };

    static Delete = async (id, url) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }

        try {

            return await axios.delete(`${this.ip}/api/${url}/${id}`, config);

        } catch(err) {

            throw err.response.data;

        }
    }

    static Get = async (id, url) => {

        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {

            return await axios.get(`${this.ip}/api/${url}/${id}`, config);

        } catch (err) {

            return err.response.data;

        }
    }
}