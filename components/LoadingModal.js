import React, { Component } from 'react';
import {
    ActivityIndicator,
    View,
    Modal,
    Text,
    Platform
} from 'react-native';
import configs from '../utils/configs';


class LoadingModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (Platform.OS == 'android') {
            return (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.props.show}
                    onRequestClose={() => { }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            paddingTop: configs.hHeight * 0.4
                        }}>
                        <ActivityIndicator
                            size='large'
                            color='#fff'
                        />
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                                marginTop: 10
                            }}>Please wait</Text>
                    </View>
                </Modal>
            );
        }
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1000,
                    position: 'absolute',
                    alignItems: 'center',
                    width: configs.wWidth,
                    height: configs.hHeight
                }}>
                <View
                    style={{
                        flex: 1,
                        paddingTop: configs.hHeight * 0.4
                    }}>
                    <ActivityIndicator
                        size='large'
                        color='#fff'
                    />
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#fff',
                            textAlign: 'center',
                            marginTop: 10
                        }}>Please_Wait</Text>
                </View>
            </View>
        );
    }
}
export default LoadingModal;
