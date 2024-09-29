import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'
import alertService from '../../services/dataServices/alertService'

const DeleteButton = (id) => {
    let removeAlert = async () => {
        let res = await alertService.Delete(id);
    }

  return (
    <Button type='clear' icon={
        <Feather name="trash" size={24} color="red" />
      }
      />
  )
}

export default DeleteButton