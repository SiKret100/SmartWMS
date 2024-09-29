import { SafeAreaView, Text, View } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from "react-native";
import alertService from '../../services/dataServices/alertService';
import Feather from "react-native-vector-icons/Feather";
import { Button } from 'react-native-elements';
import DeleteButton from '../buttons/DeleteButton';
import EditButton from '../buttons/EditButton';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

const AlertMobileDisplayer = () => {
  const [data, setData] = useState([]);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeletedItem, setIsDeletedItem] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, [])

  const fetchData = async () => {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await alertService.GetAll();
      console.log(`Response: ${JSON.stringify(response)}`);
      setData(response.data);
      console.log(data);
      setLoading(true);
    }
    catch (err) {
      setError(err);
      console.log(`Wystąpił błąd: ${err}`);
    }
  };

  useEffect(() => {
    fetchData();
    if(isDeletedItem){
      setIsDeletedItem(false);
    }
  }, [isDeletedItem])

  const handleDelete = async (id) => {
    try{
      console.log(`id: ${id}`);
      const res = await alertService.Delete(id);
    }
    catch(err) {
      console.log(err);
    } 
    setIsDeletedItem(true);
  }
  
  
  return (
    <SafeAreaView className={'flex-1 justify-start align-center'}>
      <ScrollView refreshControl={
        <RefreshControl 
        refreshing={refreshing}
        onRefresh={onRefresh}
        />
      }>
      {!loading ? (
        <View className={'justify-center align-center'}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        data.map((object) => {
          return (
            <View key={object.alertId} className={' flex-row justify-between items-center flex-0.5 border-solid rounded-3xl border-2 px-2 py-2 mx-4 mt-4 bg-slate-200'}>
              <EditButton/>
              <View className={' px-2 py-2 mx-4 '}>
                <View>
                  <Text key={object.title} className={'text-center'}>{object.title}</Text>
                  <Text key={object.description} className={'text-center'}>{object.description}</Text>
                  <Text key={object.alertDate} className={'text-center'}>{object.alertDate}</Text>
                  <Text key={object.seen} className={'text-center'}> {object.seen === 0 ? ("Widziano") : ("Nie widziano")} </Text>
                </View>
              </View>
              <DeleteButton onDelete={() => handleDelete(object.alertId)}/>
            </View>
          )
        })
      )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AlertMobileDisplayer;