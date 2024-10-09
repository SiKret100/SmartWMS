import { SafeAreaView, Text, View, Modal, Platform, ActivityIndicator, FlatList } from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { SelectList } from 'react-native-dropdown-select-list';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from "../buttons/CustomButton";
import userService from "services/dataServices/userService.js";
import UserDto from "data/DTOs/userDto.js";
import userTypeMap from "data/Mappers/userType.js";
import { RefreshControl } from "react-native-gesture-handler";
import FallingTiles from "../FallingTiles";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import Feather from "react-native-vector-icons/Feather";
import CustomSelectList from "../selects/CustomSelectList";

const UserMobileDisplayer = () => {
  const [errors, setErrors] = useState([]);
  const [selected, setSelected] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [defaultOption, setDefaultOption] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [err, setError] = useState("");
  const [isDeletedItem, setIsDeletedItem] = useState(false);




  const fetchData = async () => {
    try {
      setLoading(false);
      const response = await userService.GetAll();
      setData(response.data.reverse());

      loadSelected();

      if (selected !== null) {
        const parsedSelected = parseInt(selected);
        setSelected(parsedSelected);

        if (parsedSelected !== -1)
          setFilteredData(response.data.filter(record => record.role === getRole(selected)));
        else
          setFilteredData(response.data);
      }
      else
        setFilteredData(response.data);
      console.log("Fetched data");
      //console.log(filteredData);

      setLoading(true);
    } catch (err) {
      setError(err);
      console.log(`Error ${err}`);
    }
  };

  const handleDelete = async (id) => {

    try {
      await userService.Delete(id);
    } catch (err) {
      console.log(err);
    }
    setIsDeletedItem(true);
  }

  useEffect(() => {
    fetchData();
    if (isDeletedItem) setIsDeletedItem(false);
  }, [isDeletedItem]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [isModalVisible])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const getRole = (selected) => {
    const roleObject = userTypeMap.find(item => item.key === selected);
    return roleObject ? roleObject.value : "Unknown role";
  }

  useEffect(() => {

    const parsedSelected = parseInt(selected);
    setSelected(parsedSelected);

    if (selected !== -1)
      setFilteredData(data.filter(record => record.role === getRole(selected)));

    else
      setFilteredData(data);

    if (selected !== undefined && selected !== null && !isNaN(selected)) {
      saveSelected();
    }
  }, [selected]);

  const loadSelected = async () => {
    try {
      const savedSelected = await AsyncStorage.getItem('selectedFilter');

      if (savedSelected !== null && savedSelected !== undefined && savedSelected !== NaN && !isNaN(savedSelected)) {
        const parsedSelected = parseInt(savedSelected);

        setSelected(parsedSelected);
        console.log('Selected value after loading:', savedSelected);

        const foundOption = userTypeMap.find(user => user.key === parsedSelected);

        setDefaultOption(foundOption)

      } else {
        setDefaultOption({ key: -1, value: "Test pokazywania" });
        setSelected(-1);
      }
    } catch (error) {
      console.log('Error loading selected filter: ', error);
    }
  };

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

  const renderItem = ({ item }) => (
    <FallingTiles>
      {item.role === "Admin" ? null : (
        <View className={"flex-row justify-between items-center flex-0.5 px-2 py-2 mx-2 my-2 shadow rounded-lg bg-slate-200"}>
          <Feather name="user" size={24} color={"black"} />
          <View className={"px-2 py-2 mx-4"}>
            <View>
              <Text className={"text-center"}>{item.email}</Text>
              <Text className={"text-center"}>{item.userName}</Text>
              <Text className={"text-center"}>{item.role}</Text>
            </View>
          </View>
          <DeleteButton onDelete={() => handleDelete(item.id)} />
        </View>
      )}
    </FallingTiles>
  );

  return (
    <View>
      <View className={"mx-2 mt-2 mb-10"}>
        <CustomSelectList 
          setSelected={val => setSelected(val)}
          typeMap={[{ key: -1, value: 'All' }, ...userTypeMap]}
          defaultOption={defaultOption}
        />
      </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
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
                <Text className={"text-center my-5"}>No users</Text>
              </View>
            )
          }
        />


    </View>
  );
};


export default UserMobileDisplayer;
