import { SafeAreaView, Text, View, Modal, Platform } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Animated, FlatList } from "react-native";
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

const AlertMobileDisplayer = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [err, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDeletedItem, setIsDeletedItem] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selected, setSelected] = useState();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(false);
      const response = await alertService.GetAll();
      setData(response.data.reverse());

      loadSelected();

      if (selected !== null) {
        const parsedSelected = parseInt(selected);
        setSelected(parsedSelected);
        if (parsedSelected !== -1) {
          setFilteredData(response.data.filter(record => record.alertType === parsedSelected));
        } else {
          setFilteredData(response.data);
        }
      } else {
        setFilteredData(response.data);
      }
      console.log("Fetched data");//POBIERANIE DANYCH NIE POWIODŁO SIĘ !!!!!!!!! - jednak w koncu sie powiodlo 

      setLoading(true);
    } catch (err) {
      setError(err);
      console.log(`Error ${err}`);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      //loadSelected(); 
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

    saveSelected(); 
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
      if (savedSelected !== null) {
        setSelected(parseInt(savedSelected));
        console.log('Selected value after loading:', savedSelected);
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
        <EditButton onEdit={() => handleModalEdit(item)} />
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
        <DeleteButton onDelete={() => handleDelete(item.alertId)} />
      </View>
    </FallingTiles>
  );

  return (
    <SafeAreaView className={"flex-1 justify-start align-center"}>
      <View>
        <View className={"mx-2 mt-2 mb-10"}>
          <SelectList
            boxStyles={{
              borderColor: 'black',
              borderWidth: 0,
              height: 56,
              borderRadius: 13,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5, // Dla Androida
              backgroundColor: '#E2E8F0',
            }}
            inputStyles={{ fontSize: 16 }}
            dropdownTextStyles={{ fontSize: 16 }}
            dropdownStyles={{
              backgroundColor: '#E2E8F0',
              borderWidth: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              backgroundColor: '#E2E8F0',
            }}

            data={[{ key: -1, value: 'All' }, ...alertTypeMap]}
            setSelected={(val) => setSelected(val)}
            save="key"
          />
        </View>
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
              <Text className={"text-center my-5"}>Brak alertów</Text>
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
