import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'


const CustomSelectList = ({selectKey, setForm, alertTypeMap, form}) => {

  const defaultOption = form.alertType !== -1 ? alertTypeMap.find(item => item.key === form.alertType) : null;

  return (
    <SelectList
      key={selectKey}
      setSelected={(val) => setForm((prevForm) => ({ ...prevForm, alertType: val }))}
      data={alertTypeMap}
      save="key" 
      placeholder="Select type..."
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
      inputStyles={{ fontSize: 16 }}
      dropdownTextStyles={{ fontSize: 16 }}
      defaultOption = {defaultOption}
    />
  )
}

export default CustomSelectList

const styles = StyleSheet.create({})