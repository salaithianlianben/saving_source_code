import React, { Component, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import configs from '../../utils/configs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconButton from '../../components/icon_button';
import { Space } from '../../components/space';
import VideoPlayer from 'react-native-video-player';
import { createThumbnail } from 'react-native-create-thumbnail';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function FilePreviews({ image, receivername, onSendingAction, message, onChangeMessage, onClickBack, pickLibrary }) {

    const [thumbnail, setThumbnail] = useState({});
    const [fileType, setFileType] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        var type = image.mime.endsWith("mp4");
        setFileType(type);

        async function generateThumbnial() {
            const timeStamp = 1000;
            // var thumbnail_url = null;
            await createThumbnail({
                url: image.uri,
                timeStamp,
            })
                .then((response) => {
                    var x = response.path;
                    var tempList = x.split('/');
                    var tempFileName = tempList[tempList.length - 1];
                    var i = tempFileName.indexOf('.');
                    var type =
                        'image/' +
                        tempFileName.substring(parseInt(i) + 1, tempFileName.length);

                    setThumbnail({
                        uri: x,
                        name: tempFileName,
                        type: type,
                    });
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log({ err });
                    setIsLoading(false);
                });
        }

        if (type) {
            setIsLoading(true);
            generateThumbnial();
        }

    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton icon={<Ionicons name="arrow-back" size={22} color={"white"} style={{}} />} onPress={onClickBack} />
                <Space width={10} />
                <Text style={{ color: 'white', flex: 6, }}>{receivername}</Text>
                {/* <View style={{ flex: 1, }}>
                    <IconButton icon={<MaterialIcons name="library-add" size={20} color={"white"} />} onPress={pickLibrary} />
                </View> */}
            </View>
            {
                fileType ?
                    <View>
                        <VideoPlayer
                            video={{ uri: image.uri }}
                            style={{
                                height: configs.height,
                                width: configs.width,
                            }}
                            onShowControl={true}
                            resizeMode="cover"
                            thumbnail={{ uri: thumbnail.uri }}
                        />
                    </View>
                    : <Image style={styles.image} source={image} />
            }
            <TouchableOpacity style={styles.button}
                onPress={() => onSendingAction(fileType, thumbnail)}
            >
                <Ionicons name="send" size={22} color={"white"} />
            </TouchableOpacity>
            {/* <View style={styles.bottomContainer}>
                <IconButton icon={<MaterialIcons name="library-add" size={20} color={"white"} />} onPress={pickLibrary} style={{flex:1,}} />
                <View style={{height:'70%',width:1,backgroundColor:'#EEEDEA',marginHorizontal:4,}}></View>
                <TextInput value={message} onChangeText={(value)=> onChangeMessage(value) } placeholder="Add a caption ..." style={{backgroundColor:'transparent',flex:10,color:'white'}} placeholderTextColor={"#EEEDEA"}/>
            </View> */}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        height: configs.height,
        width: configs.width,
    },
    header: {
        backgroundColor: 'black',
        flexDirection: 'row',
        // justifyContent:'center',
        alignItems: 'center',
        height: 50,
        marginTop: getStatusBarHeight(),
    },
    bottomContainer: {
        backgroundColor: '#00000040',
        // paddingHorizontal:0,
        width: configs.width,
        height: 50,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: configs.width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 50,
        width: 50,
        borderRadius: 60,
        position: 'absolute',
        bottom: 20,
        right: 10,
        shadowColor: "#9DA5F150",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 1,
        backgroundColor: configs.colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
