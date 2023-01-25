import React, { Component } from 'react'
import { View, Text, StatusBar, Linking, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, FlatList, Alert} from 'react-native'
import BackgroundImage from '../../assets/images/Group.png'
import Profile1 from '../../assets/images/profile1.png'
import Profile2 from '../../assets/images/profile2.png'
import configs from '../../utils/configs'
import MessageCard from './MessageCard'
import SearchInput from './SearchInput'
import RBSheet from "react-native-raw-bottom-sheet";
import ReciperList from './ReciperList'
import CheckBox from './RectangleCheckBox';
import { connect } from 'react-redux';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { getStatusBarHeight } from 'react-native-status-bar-height';
//import ImagePicker, { launchImageLibrary} from 'react-native-image-picker'
import SuccessfulModal from './SuccessfulModal'
import homeAction from '../../actions/homeAction'
import ContactLists from './ContactLists'
import Loading from '../../components/Loading'
class CommsScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
              searchValue: '',
              response: null,
              description: "",
              isChecked: false,
              statusTrans: true,
              statusBg: 'transparent',
              userpick: true,
              bottomSheetHeight: configs.height,
              ReciperSelected: '#DADADA',
              ReciperSelectedIcon: false,
              USER_ROLE: true,
              selectedIndex: 0,
              isVisible: false,
              roomList: []
        }
    }
    componentDidMount() {
        this.props.getRoomList(this.props.userInfo.id);
       
    }
    static getDerivedStateFromProps(nextProps, prevState) {
       
        return {
            roomList: nextProps.roomList,
         
        };
        
    }
    openModal = () => {
        this.setState({ isVisible: true});
        this.RBSheet.close();
    }
    closeModal = () => {
        this.setState({ isVisible: false});
    }
    handleIndexChange = index => {
        this.setState({
          ...this.state,
          selectedIndex: index
        });
      };
    ChangeColor = () => {
        this.setState({ ReciperSelected: configs.colors.primaryColor});
        this.setState({ ReciperSelectedIcon: true});
    }
    OpenReciperList = () => {
        this.setState({ userpick: false});
    //    this.setState({ bottomSheetHeight: configs.height / 1.6})
    }
    Uploading = () => {
      
        ImagePicker.launchImageLibrary({mediaType: 'mixed'}, (response) => {
            console.log(response.error);
            this.setState({ response: response});
          })
    }

    DeleteUploading = () => {
        this.setState({
            ...this.state,
            response: null
        })
    }
    CloseReciperList = () => {
        this.setState({ userpick: true});
     //   this.setState({ bottomSheetHeight: configs.height})
    }
    StatusBarColorChange = () => {
        this.RBSheet.open();
        this.setState({ userpick: false});
       // this.setState({ statusTrans: false});
     //   StatusBar.setBackgroundColor('grey');
        
       
    }
    
    CheckHandler = (Checked) => {
       
        this.setState({ isChecked: Checked});
    }
    DescriptionHandler = (value) => {
        this.setState({ description: value});
    }
    SearchHandler = (value) => {
        this.setState({ searchValue: value});
    }
       render() {
        // let roomLength = this.state.roomList.filter(r => 
        //      r.last_message !== ""
        // );
 
        // console.log(roomLength);
        const renderItem = ({item, index }) => (
            
         
            
            (item.last_message) ?
            
         <MessageCard 
         key={index}
         ProfileImage={item.receiver.img} 
         Name={item.receiver.name}
         DurationTime={item.receiver.last_updated}
         Title="Child’s injury"
         Content={item.last_message}
         NoBottom={true}
         Active={true}
         urgent={true} 
         id={item.receiver.id}
         role={item.receiver.children ? `${item.receiver.children[0].name.split(' ')[0]}'s ${item.receiver.role}` : item.receiver.role}
         navigation={this.props.navigation}
      /> 
         : null    
        
        )
        return(
            <>
            {
                this.props.room_list_loading &&
                <Loading loading={true} />
            }
            
            <SuccessfulModal  isSuccessVisible={this.state.isVisible} GoToSeeHandler={this.closeModal} />
            <View style={{ flex: 1, backgroundColor: configs.colors.loginColor}}>
            
               <View style={{ 
                backgroundColor: configs.colors.primaryColor, 
                height: configs.height / 3.5, borderBottomStartRadius: 20, 
                borderBottomEndRadius: 20, 
                flexDirection: 'row' }}>
                   <StatusBar barStyle="dark-content"  translucent={true} backgroundColor='transparent'/>
                   <Text style={styles.Header}>Comms</Text>
                   <Image source={BackgroundImage} style={{  height: 247.28, width: 331, position: 'absolute', top: -(StatusBar.currentHeight+3), right: -20}} resizeMode='center' />
                 
                    
               </View>
               <View style={{ flexDirection: 'row', paddingHorizontal: 17, justifyContent: 'space-between', paddingVertical: 16, marginTop: -40}}>
                       <TouchableOpacity style={styles.button} onPress={() => this.contactLists.open()} >
                            <Image source={require('../../assets/icons/ic_message.png')} style={{ width: 17, height: 16, marginTop: 3}}/>
                            <Text style={{fontSize: 14, fontFamily: configs.fontFamily.OPS700, lineHeight: 19, marginLeft: 6, color: configs.colors.primaryColor}}>New message</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={styles.button} onPress={() => {Linking.openURL(`tel:+6562851377`);}}>
                            <Image source={require('../../assets/icons/ic_phone.png')} style={{ width: 16, height: 16}} />
                            <Text style={{fontSize: 14, fontFamily: configs.fontFamily.OPS700, lineHeight: 19, marginLeft: 6, color: configs.colors.primaryColor}}>Call hotline</Text>
                       </TouchableOpacity>  
                </View>
               
               <View style={{ marginHorizontal: 16, marginBottom: 20}}>
                        <SearchInput 
                        SearchText={this.state.searchValue}
                        onChangeSearch={this.SearchHandler}
                        placeholderText="Search "
                         />
                </View>
                {
                    this.state.roomList &&
                    <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{      
                        marginHorizontal: 16, 
                        backgroundColor: '#fff', 
                        borderRadius: 20, 
                        paddingHorizontal: 24,
                        paddingTop: 30,
                        paddingBottom: 30,
                        marginTop: 10,}}
                        data={this.state.roomList}
                        renderItem={renderItem}
                        keyExtractor={(item, index) =>  item.id.toString()}
                        extraData={this.state}
                    /> 
                }
                
             
            </View>
            <ContactLists
              navigation={this.props.navigation}
              onCancels={() => {
                this.contactLists.close();
              }}
              refRBSheet={(ref) => {
                this.contactLists = ref;
              }}
             />
            </>
        )
    }
}
const bindState = state => {
    return {
     
      roomList: state.homeState.room_list,
      room_list_loading: state.homeState.room_list_loading,
      userInfo: state.authState.userInfo,
    };
  };
  const bindDispatch = dispatch => {
    return {
      
     
      getRoomList: (sender) => dispatch((homeAction.getRoomList(sender)))
    };
  };

export default connect(bindState, bindDispatch)(CommsScreen);

const styles = StyleSheet.create({
    Header: {
        fontSize: 18,
        color: "#fff",
        fontFamily: configs.fontFamily.OPS700,
        lineHeight: 25,
        marginTop: getStatusBarHeight()+20,
        marginLeft: 18
    },
    button: {
        paddingHorizontal: 23,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: "#9DA5F150",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
       // shadowRadius: 3.84,
        elevation: 1,
    },
    SendingBox: {
        flexDirection: 'row', 
        marginTop: 24, 
        justifyContent: 'space-between', 
        marginBottom: 16
    },
    PhotoPicker: {
        backgroundColor: '#DADADA',
        height: 160,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: 22
    },
    Cancel: {
        width: 150,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: configs.colors.primaryColor,
        borderWidth: 1
    },
    Send: {
        width: 150,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: configs.colors.primaryColor,
        borderRadius: 8,
        borderWidth: 1
    },
    ContactTitle: {
        flexDirection: 'row',
        marginLeft: 5,
        marginBottom: 24
    },
    Active: {
        width: 12,
        height: 12,
        borderRadius: 12,
        marginRight: 6,
        backgroundColor: configs.colors.primaryColor,
        marginTop: 5
    },
    Receiper: {
        backgroundColor: '#D1EAFF',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 4,
        marginBottom: 4
        
        
    },
    DeletePhoto: {
        width: 24,
        height: 24,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 9,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: configs.colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabStyle: {
        height:40,
        borderRadius:25,
        borderColor:configs.colors.primaryColor,
        marginHorizontal:10,
    },
    firstTabStyle: {
        //custom styles
        borderTopLeftRadius:25,
        borderBottomLeftRadius:25,
        borderEndWidth:1,
      },
      lastTabStyle: {
        //custom styles
        marginLeft:0,
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        borderStartWidth:1,
      },
    tabTextStyle: {
        fontSize: 14,
        fontWeight: '600',
        color: configs.colors.primaryColor
    },
    activeTabStyle: {
        backgroundColor: configs.colors.primaryColor,
      },
    activeTabTextStyle: {
        color: '#fff'
    },
})