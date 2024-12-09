import { Alert } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'


const DeleteButton = ({onDelete}) => {

  const createTwoButtonAlert = () => {
    Alert.alert('Warning', 'Are you sure you want to delete this?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => onDelete(),
        style: 'destructive'
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