import { SafeAreaView, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { ActivityIndicator } from "react-native";
import alertService from '../../services/dataServices/alertService';


const AlertMobileDisplayer = () => {
  const [data, setData] = useState([]);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try{
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await alertService.GetAll();
      console.log(`Response: ${JSON.stringify(response)}`);
      setData(response.data);
      console.log(data);
      setLoading(true);
    }
    catch(err){
      setError(err);
      console.log(`Wystąpił błąd: ${err}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <SafeAreaView className={'flex-1 justify-start align-center'}>
      { !loading ? (
        <View className={'justify-center align-center'}>
          <ActivityIndicator size="small" color="#000"/>
        </View>
      ) : (
        data.map((object) => {
          return( 
          <View className={' flex-0.5 border-solid rounded-3xl border-2 px-2 py-2 mx-4 mt-4'}> 
            <Text key={object.title} className={'text-center'}>{object.title}</Text>
            <Text key={object.description} className={'text-center'}>{object.description}</Text>
            <Text key={object.alertDate} className={'text-center'}>{object.alertDate}</Text>
            <Text key={object.seen} className={'text-center'}> {object.seen === 0 ? ("Widziano") : ("Nie widziano") } </Text>
          </View>
          )
        })
      )}
    </SafeAreaView>
  )
}

export default AlertMobileDisplayer;