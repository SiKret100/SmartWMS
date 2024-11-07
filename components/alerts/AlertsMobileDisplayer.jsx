import { SafeAreaView, Text, View, Modal, Platform, ActivityIndicator, FlatList } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import alertService from "../../services/dataServices/alertService";
import Feather from "react-native-vector-icons/Feather";
import { Button } from "react-native-elements";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import { RefreshControl } from "react-native-gesture-handler";
import { useFocusEffect } from "expo-router";
import alertTypeMap from "../../data/Mappers/alertType";
import AlertMobileForm from "components/alerts/AlertMobileForm.jsx";
import { SelectList } from 'react-native-dropdown-select-list';
import moment from 'moment-timezone';
import FallingTiles from "../FallingTiles";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import CustomSelectList from "../selects/CustomSelectList";

const AlertMobileDisplayer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeletedItem, setIsDeletedItem] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selected, setSelected] = useState(undefined);
  const [defaultOption, setDefaultOption] = useState();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    setLoading(false);
    await alertService.GetAll()
        .then(response => {
          setData(response.data.reverse());
          loadSelected();
          if (selected !== null) {
            const parsedSelected = parseInt(selected);
            setSelected(parsedSelected);

            if (parsedSelected !== -1)
              setFilteredData(response.data.filter(record => record.alertType === parsedSelected));
            else
              setFilteredData(response.data);
          }
          else
            setFilteredData(response.data);

          console.log("Fetched data");
          setLoading(true);
        })
        .catch(err => {
          setError(err);
          console.log(`Error ${err}`);
        })
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [isModalVisible])
  );

  useEffect(() => {
    fetchData();
    if (isDeletedItem) setIsDeletedItem(false);
  }, [isDeletedItem]);
  
  useEffect(() => {
    if (selected !== -1)
      setFilteredData(data.filter(record => record.alertType === selected));
    else
      setFilteredData(data);

    if (selected !== undefined && selected !== null && !isNaN(selected)) {
    saveSelected();
  } 
  }, [selected]);

 // Save selected value to AsyncStorage
const saveSelected = async () => {
  try {
    if (selected !== undefined && selected !== null) {
      await AsyncStorage.setItem('selectedFilter', selected.toString());
      console.log('Selected value after saving:', selected); 

    } else {
      console.log('Selected is undefined or null, not saving to AsyncStorage'); 
    }
  } catch (error) {
    console.log('Error saving selected filter: ', error);
  }
};



  const loadSelected = async () => {
    try {
      const savedSelected = await AsyncStorage.getItem('selectedFilter');
      
      if (savedSelected !== null && savedSelected !== undefined && savedSelected !== NaN && !isNaN(savedSelected)) {
        const parsedSelected = parseInt(savedSelected);

        setSelected(parsedSelected);
        console.log('Selected value after loading:', savedSelected);
        
        const foundOption = alertTypeMap.find(alert => alert.key === parsedSelected );

        setDefaultOption( foundOption )
        
      } else {
        setDefaultOption({ key: -1, value: "Test pokazywania" });
        setSelected(-1);
      }
    } catch (error) {
      console.log('Error loading selected filter: ', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await alertService.Delete(id);
    } catch (err) {
      console.log(err);
    }
    setIsDeletedItem(true);
  };

  const handleModalEdit = async (object) => {
    setCurrentEditItem(object);
    setIsModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <FallingTiles>
      <View className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
        <DeleteButton onDelete={() => handleDelete(item.alertId)} />
        <View className={"px-2 py-2 mx-4"}>
          <View>
            <Text className={"text-center"}>{item.title}</Text>
            <Text className={"text-center"}>{item.description}</Text>
            <Text className={"text-center"}>{moment(item.alertDate).format("DD MMMM YYYY")}</Text>
            <Text className={"text-center"}>
              {item.seen === 0 ? "Widziano" : "Nie widziano"}
            </Text>
            <Text className={"text-center"}>
              {alertTypeMap.find(alert => alert.key === item.alertType)?.value || "Unknown"}
            </Text>
          </View>
        </View>
        <EditButton onEdit={() => handleModalEdit(item)} />

      </View>
    </FallingTiles>
  );

  return (
    <SafeAreaView className={"flex-1 justify-start align-center"}>
        <View className={"flex-col justify-center mx-2 my-2"} >
          <CustomSelectList
            typeMap={[{ key: -1, value: 'All' }, ...alertTypeMap]}
            defaultOption={defaultOption}
            setSelected={(val) => setSelected(val)}
            otherRawCSS={{marginBottom: 19, marginTop:19}}
          />
        </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.alertId.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <View className={"justify-center align-center"}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : (
            <View className={"justify-center align-center"}>
              <Text className={"text-center my-5"}>No alerts</Text>
            </View>
          )
        }
      />

      <Modal
        visible={isModalVisible}
        animationType={Platform.OS !== "ios" ? "" : "slide"}
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-auto mt-5">
          <AlertMobileForm
            object={currentEditItem}
            header="Edit"
            setIsModalVisible={setIsModalVisible}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AlertMobileDisplayer;
