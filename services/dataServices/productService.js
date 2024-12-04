import {Platform} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";
import AlertDto from "../../data/DTOs/alertDto";
import ProductDto from "data/DTOs/productDto.js";

export default class productService {
    static ip = process.env.EXPO_PUBLIC_IP

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
                response = await axios.get(`${this.ip}/api/Product/${id}`);
            } else {
                response = await axios.get(`${this.ip}/api/Product/${id}`, config);
            }

            //console.log(response);
            return response;
        } catch (err) {
            return err.response.data;
        }
    }

    static GetByBarcode = async (barcode) => {

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
                response = await axios.get(`${this.ip}/api/Product/byBarcode/${barcode}`);
            } else {
                response = await axios.get(`${this.ip}/api/Product/byBarcode/${barcode}`, config);
            }

            // console.log("Response from service: " + JSON.stringify(response));
            return response;
        } catch (err) {
            // console.log("Error from service: " + err);
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

    static AddProductAndAssignShelves = async (data) =>{
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
                response = await axios.post(`${this.ip}/api/Product/createAndAssignToShelves`, data);
            } else {
                response = await axios.post(`${this.ip}/api/Product/createAndAssignToShelves`, data, config);
            }

            console.log("Service response: "  + JSON.stringify(response));
            router.push(`/home/products`);

            return response;
        } catch (err) {
            // console.log(`errory z serwisu: ${JSON.stringify(err)}`);
            return err.response.data;
        }
    }

    static ProductDeliveryDistribution = async(data) => {
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
                response = await axios.post(`${this.ip}/api/Product/takeDeliveryAndDistribute`, data);
            } else {
                response = await axios.post(`${this.ip}/api/Product/takeDeliveryAndDistribute`, data, config);
            }

            console.log("Service response: "  + JSON.stringify(response));
            router.push(`/home/products`);

            return response;
        } catch (err) {
            console.log(`errory z serwisu: ${JSON.stringify(err)}`);
            throw err.response.data;
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
                response = await axios.delete(`${this.ip}/api/Product/${id}`);
            } else {
                response = await axios.delete(`${this.ip}/api/Product/${id}`, config);
            }

            console.log(response);
            return response;
        }catch(err){
            console.log("Error from service" + err);
            return err.response.data;

        }
    }

    static Update = async (id, productData) => {
        const token = Platform.OS !== "web" ? SecureStore.getItem("token") : "";
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const productDto = new ProductDto(productData);

            let response;
            if (Platform.OS === "web") {
                response = await axios.put(`${this.ip}/api/Product/${id}`, productDto);
            } else {
                response = await axios.put(
                    `${this.ip}/api/Product/${id}`,
                    productDto,
                    config
                );
            }

            console.log("Response from service" + JSON.stringify(response));
            return response;
        } catch (err) {
            console.log("Error from service" + JSON.stringify(err));
            return err.response.data;
        }
    };

    static GetProductsWithQuantityAbove0 = async () => {
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
                response = await axios.get(`${this.ip}/api/Product/quantityGtZero`);
            } else {
                response = await axios.get(
                    `${this.ip}/api/Product/quantityGtZero`,
                    config
                );
            }

            console.log("Response from service" + JSON.stringify(response));
            return response;
        } catch (err) {
            console.log("Error from service" + JSON.stringify(err));
            return err.response.data;
        }
    }


}