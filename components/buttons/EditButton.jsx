import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { Feather } from '@expo/vector-icons'

const EditButton = () => {
  return (
    <Button type='clear' icon={
        <Feather name="edit" size={24} color="#3E86D8" />
      }
    />
  )
}

export default EditButton