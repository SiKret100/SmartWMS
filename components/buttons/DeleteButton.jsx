import { View, Text, Alert } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import alertService from '../../services/dataServices/alertService'

const DeleteButton = ({onDelete}) => {

  const createTwoButtonAlert = () => {
    Alert.alert('Warning', 'Are you sure you want to delete this alert?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Ok',
        onPress: () => onDelete()
      }
    ])
  }

  return (
    <Button onPress={createTwoButtonAlert} type='clear' icon={
        <Feather name="trash" size={24} color="red" />
      }
      />
  )
}

export default DeleteButton