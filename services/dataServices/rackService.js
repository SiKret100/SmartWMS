import axios from "axios";
import { Platform } from "react-native";
import RackDto from "../../data/DTOs/alertDto";
import * as SecureStore from "expo-secure-store";

const getCookieByName = (name) => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (let c of cookies) {
        let cookie = c.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
};

export default class rackService {
    static ip = process.env.EXPO_PUBLIC_IP;
}