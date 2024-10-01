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
        borderWidth: 2,
        height: 56,
        borderRadius: 13,
        alignItems: 'center'
      }}
      inputStyles={{ fontSize: 16 }}
      dropdownTextStyles={{ fontSize: 16 }}
      defaultOption = {defaultOption}
    />
  )
}

export default CustomSelectList

const styles = StyleSheet.create({})