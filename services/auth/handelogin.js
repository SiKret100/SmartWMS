import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

axios.defaults.withCredentials = true;

const handleLoginStatus = (error) => {
  switch (error.status) {
    case 401:
      return "Niepoprawne dane logowania";
    case 500:
      return "Blad serwera";
    default:
      return "Blad połączenia";
  }
};

const handelogin = async (email, password, error, setError, setLoading) => {
    const myip = process.env.EXPO_PUBLIC_IP;
  try {
    setLoading(true);

    

    const response = await axios.post(
      `${myip}/login${Platform.OS ==='web' ? '?useCookies=true' : ''}`,
      {
        email: email,
        password: password
      }
    );

    console.log(response);

    if(Platform.OS !== 'web'){
        await SecureStore.setItemAsync('token', response.data.accessToken);//saving token to securestore for IOS
        const token = await SecureStore.getItemAsync('token');//getting token from securestore for IOS
        //setError("token " + token);
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/home");
    }else{
        setError("Zalogowano");
        
    }
    
    setLoading(false);

  } catch (error) {
    console.log(error);
    setError(handleLoginStatus(error));
    setLoading(false);
  }
};

export default handelogin;
