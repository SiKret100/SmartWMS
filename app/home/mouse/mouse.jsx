import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'

const mouse = () => {
  return (
    <View>
      <Text>mouse</Text>
      <Link href="/home/mouse/keybord">Go to keybord </Link>
    </View>
  )
}

export default mouse

const styles = StyleSheet.create({})