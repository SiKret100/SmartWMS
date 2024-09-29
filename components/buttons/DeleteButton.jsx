import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import alertService from '../../services/dataServices/alertService'

const DeleteButton = ({onDelete}) => {

  return (
    <Button onPress={onDelete} type='clear' icon={
        <Feather name="trash" size={24} color="red" />
      }
      />
  )
}

export default DeleteButton