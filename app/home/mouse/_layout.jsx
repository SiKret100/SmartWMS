import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'

const mouse_layout
 = () => {
  return (
    <Stack>
        <Stack.Screen name="mouse" options={{headerShown:false}} />
    </Stack>
  )
}

export default mouse_layout


const styles = StyleSheet.create({})