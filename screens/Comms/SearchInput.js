import React, { Component } from 'react'
import { TextInput, View, Image, StyleSheet } from 'react-native'
import configs from '../../utils/configs';

class SearchInput extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.InputContainer}> 
                <TextInput 
                value={this.props.SearchText}
                onChangeText={(text) => this.props.onChangeSearch(text)}
                placeholder={this.props.placeholderText}
                placeholderTextColor='#769CFF'
                style={{
                    fontFamily: configs.fontFamily.OPS600,
                    fontSize: 14,
                    paddingTop: 12,
                    paddingBottom: 13,
                    height: 44
                }}
                />
                <Image source={require('../../assets/icons/ic_search.png')} style={{ width: 20, height: 20, position: 'absolute', right: 13, top: 11}}  />
                
            </View>
        )
    }
}
export default SearchInput;
const styles = StyleSheet.create({
    InputContainer: {
        flexDirection: 'row',
        borderRadius: 20,
        backgroundColor: "#E9F0FD",
        width: '100%',
        height: 44,
        paddingLeft: 16
       
    }
})