import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {SelectList} from 'react-native-dropdown-select-list'


const CustomSelectList = ({selectKey, setSelected, typeMap, defaultOption, otherRawCSS, ...props}) => {

    return (
        <View style={{...otherRawCSS}}>
            {props.title && (
                <Text>{props.title}</Text>
            )}
            <SelectList
                key={selectKey}
                setSelected={setSelected}
                data={typeMap}
                save="key"
                placeholder="Select type..."
                boxStyles={

                    {
                        borderColor: 'black',
                        borderWidth: 0,
                        height: 56,
                        borderRadius: 13,
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5, // Dla Androida
                        backgroundColor: '#E2E8F0',
                    }
                }
                dropdownStyles={{
                    backgroundColor: '#E2E8F0',
                    borderWidth: 1,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5,
                }}
                inputStyles={{fontSize: 16}}
                dropdownTextStyles={{fontSize: 16}}
                defaultOption={defaultOption}
                onSelect={props.onSelect}
            />
        </View>


    )
}

export default CustomSelectList

const styles = StyleSheet.create({})