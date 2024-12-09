import {Platform} from "react-native";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {router} from "expo-router";

axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

export default class authService {

    static ip = process.env.EXPO_PUBLIC_IP;

    static handleLoginStatus = (error) => {
        switch (error.status) {
            case 401:
                return "Niepoprawne dane logowania";
            case 500:
                return "Blad serwera";
            default:
                return "Blad połączenia";
        }
    };

    static handeLogin = async (email, password, error, setError, setLoading) => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${this.ip}/login${Platform.OS === 'web' ? '?useCookies=true' : ''}`,

                {

                    email: email,
                    password: password
                }
            );


            if (Platform.OS !== 'web') {
                await SecureStore.setItemAsync('token', response.data.accessToken);

                router.push("/home");
            } else {
                setError("Zalogowano");

            }

            setLoading(false);

        } catch (error) {
            setError(this.handleLoginStatus(error));
            setLoading(false);
        }
    };

    static getUserInfo = async () => {

        const token = Platform.OS !== "web" ? SecureStore.getItem('token') : "";
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };

        try {
            let response;
            if (Platform.OS === "web") {
                response = await axios.get(`${this.ip}/api/User/getAuthorizedUser`);
            } else {
                response = await axios.get(`${this.ip}/api/User/getAuthorizedUser`, config);
            }

            console.log(response.data);
            return response;

        } catch (error) {
            console.log(error)

        }
    };
}