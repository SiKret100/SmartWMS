import { useEffect, useState, useContext } from 'react';
import { Text, View } from 'react-native'
import axios from "axios";
import authService from '../../services/auth/authService';
import { UserDataContext } from './_layout.jsx';



const HomePage = () => {
  const userData = useContext(UserDataContext);
  const [error, setError] = useState("");

  return (
    <View>
        <Text> {userData.role} </Text> 
    </View>
  )
}

export default HomePage;