import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'


const CustomSelectList = ({ selectKey, setForm, alertTypeMap }) => {
  return (
    <SelectList
      key={selectKey}
      setSelected={(val) => setForm((prevForm) => ({ ...prevForm, alertType: val }))}
      data={alertTypeMap}
      save="key"
      placeholder="Select type..."
      boxStyles={{
        borderColor: 'black',
        borderWidth: 2,
        height: 56,
        borderRadius: 13,
        alignItems: 'center'
      }}
      inputStyles={{ fontSize: 16 }}
      dropdownTextStyles={{ fontSize: 16 }}
    />
  )
}

export default CustomSelectList

const styles = StyleSheet.create({})