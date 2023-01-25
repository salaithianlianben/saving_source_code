import React, { Component, useRef } from 'react'
import { Alert, View, StyleSheet, Modal, Platform, StatusBar, Image, TouchableOpacity, Text, FlatList, Dimensions, TouchableWithoutFeedback} from 'react-native'
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width < height ? width : height;
const isSmallDevice = SCREEN_WIDTH <= 414;
//const numColumns = isSmallDevice ? 2 : 3;
const numColumns = 3;

const isIOS = Platform.OS === 'ios';
import { RNCamera } from 'react-native-camera';
// import { CropView } from 'react-native-image-crop-tools';
//for Camera
const flashModeOrder = {
    off: 'on',
    on: 'auto',
    auto: 'torch',
    torch: 'off',
  };

  const wbOrder = {
    auto: 'sunny',
    sunny: 'cloudy',
    cloudy: 'shadow',
    shadow: 'fluorescent',
    fluorescent: 'incandescent',
    incandescent: 'auto',
  };

 const landmarkSize = 2;
 
 //Camera

 class ImageModal extends Component {

    constructor(props) {
        super(props);
        this.cropViewRef = React.createRef();
        this.state = {
            selectedItems: [],
            fromCamera: [],
            newPhotos1: [],
            isSelected: false,
            CameraVisible: false,
            flash: 'off',
            zoom: 0,
            autoFocus: 'on',
            autoFocusPoint: {
              normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
              drawRectPosition: {
                x: Dimensions.get('window').width * 0.5 - 32,
                y: Dimensions.get('window').height * 0.5 - 32,
              },
            },
            
            depth: 0,
            type: 'back',
            whiteBalance: 'auto',
            ratio: '16:9',
            recordOptions: {
              mute: false,
              maxDuration: 5,
              quality: RNCamera.Constants.VideoQuality['288p'],
            },
            isRecording: false,
            canDetectFaces: false,
            canDetectText: false,
            canDetectBarcode: false,
            faces: [],
            textBlocks: [],
            barcodes: [],
            refreshing: true,
            start: 0,
            end: 30,
            maxSizeChooseAlert: (number) => 'You can only choose ' + number + ' photos at most'
            
        };
    }
  
    componentDidMount() {
      this.setState({ selectedItems: []});
      console.log(this.state.selectedItems.length);
    }
   static getDerivedStateFromProps(nextProps, prevState) {
    // do things with nextProps.someProp and prevState.cachedSomeProp
  //  let data = nextProps.photos.slice(prevState.start, prevState.end);
    return {
       newPhotos1: nextProps.photos,
      
    // ... other derived state properties
    };
    
}
   clearfromGallery = (list) => {
       const data = [...list];
       this.setState({
         selectedItems: []
       })
       return data;
   }
   clearfromCamera = (list) => {
    const data = [...list];
    this.setState({
      fromCamera: [],
      CameraVisible: false
    })
    return data;
}
   cancelTakenImage = () => {
    this.setState({
      fromCamera: []
    })
    }
    openCameraModal = () => {
        this.setState({ CameraVisible: true});
    }
    closeCameraModal = () => {
        this.setState({ CameraVisible: false});
        console.log(this.state.CameraVisible);
    }
   
    _clickCell = (itemuri) => {
        const isSelected = this.state.selectedItems.some(item => {
            if(item.node.image.uri == itemuri.node.image.uri)
            return true;
            console.log(item.node.image.uri + " ");
            console.log( itemuri.node.image.uri);
        });
       
        if (isSelected) {
            const selectedItems = this.state.selectedItems.filter(item => item.node.image.uri !== itemuri.node.image.uri);
            this.setState({
                selectedItems: [...selectedItems]
            });
            console.log('not same');
        } else if (this.state.selectedItems.length >= this.props.maxSize) {
            Alert.alert('', this.state.maxSizeChooseAlert(this.props.maxSize));
        } else {
            this.setState({
                selectedItems: [...this.state.selectedItems, itemuri]
            });
            console.log('hello');
        }
    };

    toggleFacing() {
        this.setState({
          type: this.state.type === 'back' ? 'front' : 'back',
        });
      }
    
      toggleFlash() {
        this.setState({
          flash: flashModeOrder[this.state.flash],
        });
      }
    
      toggleWB() {
        this.setState({
          whiteBalance: wbOrder[this.state.whiteBalance],
        });
      }
    
      toggleFocus() {
        this.setState({
          autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
        });
      }
    
      touchToFocus(event) {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const isPortrait = screenHeight > screenWidth;
    
        let x = pageX / screenWidth;
        let y = pageY / screenHeight;
        // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
        if (isPortrait) {
          x = pageY / screenHeight;
          y = -(pageX / screenWidth) + 1;
        }
    
        this.setState({
          autoFocusPoint: {
            normalized: { x, y },
            drawRectPosition: { x: pageX, y: pageY },
          },
        });
      }
    
      zoomOut() {
        this.setState({
          zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
        });
      }
    
      zoomIn() {
        this.setState({
          zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
        });
      }
    
      setFocusDepth(depth) {
        this.setState({
          depth,
        });
      }
    
      takePicture = async function() {
        if (this.camera) {
          const data = await this.camera.takePictureAsync();
          this.setState({
              fromCamera: [...this.state.fromCamera, data]
          })
         //   console.warn('takePicture ', data);
         
         
        }
      };
    
      takeVideo = async () => {
        const { isRecording } = this.state;
        if (this.camera && !isRecording) {
          try {
            const promise = this.camera.recordAsync(this.state.recordOptions);
    
            if (promise) {
              this.setState({ isRecording: true });
              const data = await promise;
              this.setState({
                fromCamera: [...this.state.fromCamera, data]
            })
             // console.warn('takeVideo ', data);
            }
          } catch (e) {
            console.error(e);
          }
        }
      };
      toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

      facesDetected = ({ faces }) => this.setState({ faces });
    
      renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => (
        <View
          key={faceID}
          transform={[
            { perspective: 600 },
            { rotateZ: `${rollAngle.toFixed(0)}deg` },
            { rotateY: `${yawAngle.toFixed(0)}deg` },
          ]}
          style={[
            styles.face,
            {
              ...bounds.size,
              left: bounds.origin.x,
              top: bounds.origin.y,
            },
          ]}
        >
          <Text style={styles.faceText}>ID: {faceID}</Text>
          <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
          <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
        </View>
      );

      renderLandmarksOfFace(face) {
        const renderLandmark = position =>
          position && (
            <View
              style={[
                styles.landmark,
                {
                  left: position.x - landmarkSize / 2,
                  top: position.y - landmarkSize / 2,
                },
              ]}
            />
          );
        return (
          <View key={`landmarks-${face.faceID}`}>
            {renderLandmark(face.leftEyePosition)}
            {renderLandmark(face.rightEyePosition)}
            {renderLandmark(face.leftEarPosition)}
            {renderLandmark(face.rightEarPosition)}
            {renderLandmark(face.leftCheekPosition)}
            {renderLandmark(face.rightCheekPosition)}
            {renderLandmark(face.leftMouthPosition)}
            {renderLandmark(face.mouthPosition)}
            {renderLandmark(face.rightMouthPosition)}
            {renderLandmark(face.noseBasePosition)}
            {renderLandmark(face.bottomMouthPosition)}
          </View>
        );
      }
    
      renderFaces = () => (
        <View style={styles.facesContainer} pointerEvents="none">
          {this.state.faces.map(this.renderFace)}
        </View>
      );
    
      renderLandmarks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
          {this.state.faces.map(this.renderLandmarksOfFace)}
        </View>
      );
    
      renderTextBlocks = () => (
        <View style={styles.facesContainer} pointerEvents="none">
          {this.state.textBlocks.map(this.renderTextBlock)}
        </View>
      );
    
      renderTextBlock = ({ bounds, value }) => (
        <React.Fragment key={value + bounds.origin.x}>
          <Text style={[styles.textBlock, { left: bounds.origin.x, top: bounds.origin.y }]}>
            {value}
          </Text>
          <View
            style={[
              styles.text,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}
          />
        </React.Fragment>
      );
    
      textRecognized = object => {
        const { textBlocks } = object;
        this.setState({ textBlocks });
      };
    
      barcodeRecognized = ({ barcodes }) => this.setState({ barcodes });
    
      renderBarcodes = () => (
        <View style={styles.facesContainer} pointerEvents="none">
          {this.state.barcodes.map(this.renderBarcode)}
        </View>
      );
    
      renderBarcode = ({ bounds, data, type }) => (
        <React.Fragment key={data + bounds.origin.x}>
          <View
            style={[
              styles.text,
              {
                ...bounds.size,
                left: bounds.origin.x,
                top: bounds.origin.y,
              },
            ]}
          >
            <Text style={[styles.textBlock]}>{`${data} ${type}`}</Text>
          </View>
        </React.Fragment>
      );
    
      renderRecording = () => {
        const { isRecording } = this.state;
        const backgroundColor = isRecording ? 'white' : 'darkred';
        const action = isRecording ? this.stopVideo : this.takeVideo;
        const button = isRecording ? this.renderStopRecBtn() : this.renderRecBtn();
        return (
          <TouchableOpacity
            style={[styles.picButton, { backgroundColor: '#fff', marginLeft: 20}]}
                
              
            onPress={() => action()}
          >
            {button}
          </TouchableOpacity>
        );
      };
    
      stopVideo = async () => {
        await this.camera.stopRecording();
        this.setState({ isRecording: false });
      };
    
      renderRecBtn() {
        return <Text style={[styles.flipText, { color: '#4075FF'}]}> REC </Text>;
      }
    
      renderStopRecBtn() {
        return <Image source={require('../../assets/icons/record.png')} style={{ width: 30, height: 30}}  />;
      }
    
      ChangePhotoContent = () => {
        
        console.log(this.props.photos.length);
        if(this.props.photos.length > this.state.end) {
          
           this.setState({ start: this.state.end+10});
           this.setState({ end: this.state.end+30});
           let newPhotos1 = this.props.photos.slice(this.state.start,this.state.end);
           console.log("Start "+ this.state.start+ " End " + this.state.end);
           this.setState({ refreshing: !this.state.refreshing});
           this.setState({ newPhotos1: [...newPhotos1]});
        }else {
           newPhotos = this.props.photos.slice((this.state.index - this.state.End),(this.state.End/2));
           this.setState({ newPhotos1: [...newPhotos]})
        }
        
       
       
      }
        _renderItem = ({item, index}) => {

       const isSelected  = this.state.selectedItems.some(obj => obj.node.image.uri === item.node.image.uri);
        return (
            <>

            {
                index === 0 ?
                <TouchableOpacity style={{ width: 120, height: 120, backgroundColor: '#fff',justifyContent: 'center', alignItems: 'center'}} onPress={this.openCameraModal}>
                <Image source={require('../../assets/icons/Camera.png')} style={{ width: 34, height: 34}}  />
               </TouchableOpacity> :
                
                <TouchableOpacity onPress={this._clickCell.bind(this, item)} key={index}>
                
                
                <View>
                    <Image
                      ///  key={index}
                        source={{uri: item.node.image.uri}}
                        style= {[{width: 120, height: 120, paddingLeft: -100}, isSelected ? { borderWidth: 5, borderColor: '#4075FF'} :  { borderWidth: 1, borderColor: '#fff'}  ]}  
                        resizeMode='cover'
                    />
                    
                        
                                {isSelected && (
                                    <View style={styles.ChooseCircle}>
                                        <Image source={require('../../assets/icons/select.png')} style={{ width: 14, height: 12}} />
                                    </View>
                                )}
                  
                </View>
            </TouchableOpacity> 
            }
           
            
            </>
        );
    }
    
    renderCamera() {
        const { canDetectFaces, canDetectText, canDetectBarcode } = this.state;
    
        const drawFocusRingPosition = {
          top: this.state.autoFocusPoint.drawRectPosition.y - 32,
          left: this.state.autoFocusPoint.drawRectPosition.x - 32,
        };
        return (
          <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style={{
              flex: 1,
              justifyContent: 'space-between', 
              marginTop: -12
            }}
            type={this.state.type}
            flashMode={this.state.flash}
            autoFocus={this.state.autoFocus}
            autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
            zoom={this.state.zoom}
            whiteBalance={this.state.whiteBalance}
            ratio={this.state.ratio}
            focusDepth={this.state.depth}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks
                ? RNCamera.Constants.FaceDetection.Landmarks.all
                : undefined
            }
            onFacesDetected={canDetectFaces ? this.facesDetected : null}
            onTextRecognized={canDetectText ? this.textRecognized : null}
            onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
          >
            <View style={StyleSheet.absoluteFill}>
              <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
              <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
            //    flex: 0.5,
                height: 60,
                backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
               <TouchableOpacity style={styles.flipButton}  onPress={this.closeCameraModal}>
                <Image source={require('../../assets/icons/Back.png')} style={{ width: 8, height: 16}}  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
                 { this.state.type === 'back' ? <Image source={require('../../assets/icons/backCamera.png')} style={{ width: 30, height: 30}} /> :  <Image source={require('../../assets/icons/front.png')}  style={{ width: 30, height: 30}} /> }
                </TouchableOpacity>
                <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
                  { flashModeOrder[this.state.flash] === 'off' ?  <Image source={require('../../assets/icons/flashOn.png')} style={{ width: 30, height: 30}} /> :  <Image source={require('../../assets/icons/flashOff.png')}  style={{ width: 30, height: 30}} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
                  <Image source={require('../../assets/icons/wb.png')} style={{ width: 30, height: 30}} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={this.zoomIn.bind(this)}
                >
                 <Image source={require('../../assets/icons/zoomIn.png')} style={{ width: 30, height: 30}}  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={this.zoomOut.bind(this)}
                >
                  <Image source={require('../../assets/icons/zoomOut.png')} style={{ width: 30, height: 30}}  />
                </TouchableOpacity>
              
              {/* <View
                style={{
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}
              >
                <TouchableOpacity onPress={this.toggle('canDetectFaces')} style={styles.flipButton}>
                  <Text style={styles.flipText}>
                    {!canDetectFaces ? 'Detect Faces' : 'Detecting Faces'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggle('canDetectText')} style={styles.flipButton}>
                  <Text style={styles.flipText}>
                    {!canDetectText ? 'Detect Text' : 'Detecting Text'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toggle('canDetectBarcode')} style={styles.flipButton}>
                  <Text style={styles.flipText}>
                    {!canDetectBarcode ? 'Detect Barcode' : 'Detecting Barcode'}
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
            <View style={{ bottom: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center' }}>
            
             
                <TouchableOpacity
                  style={styles.picButton}
                  onPress={this.takePicture.bind(this)}
                >
                  <Text style={styles.flipText}> PHOTO </Text>
                </TouchableOpacity>
                <View
                    style={{
                    height: 56,
                    backgroundColor: 'transparent',
                    //  flexDirection: 'row',
                    //alignSelf: 'flex-end',
                    }}>
                    {this.renderRecording()}
                </View>
             
             
               
               
             
            </View>
          
          </RNCamera>
        );
      }
    render() {

        return(
            <>
            <Modal visible={this.props.IsVisible} transparent={false} statusBarTranslucent={true}  onRequestClose={() => this.state.selectedItems.length > 0 ? this.props.closeModal(this.clearfromGallery(this.state.selectedItems)) :  this.state.fromCamera.length > 0 ?  this.props.closeModal(this.clearfromCamera(this.state.fromCamera)) :  this.props.closeModal()}>
            {   

                this.state.fromCamera.length != 0 ?
                <>
                <View style={[styles.Container, { marginTop: isIOS ? statusbar.currentHeight : 0}]}>
                    
                    <View style={{ flex: 1}}>
                      <Image source={{uri: this.state.fromCamera[0].uri}} resizeMode='cover' style={{ flex: 1}} />
                    </View>
                    <View
                      style={styles.Edit}
                      >
                     
                      <TouchableOpacity onPress={this.cancelTakenImage}>
                          <Text style={{ fontSize: 18}}>CANCEL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { 
                        this.props.closeModal(this.clearfromCamera(this.state.fromCamera))}}>
                          <Text style={{ fontSize: 18}}>OK</Text>
                      </TouchableOpacity>
                     
                    </View>
                </View>
                
              
                  
                
                    {/* <CropView 
                  sourceUrl={this.state.fromCamera[0].uri}
                  style={styles.cropView}
                  ref={this.cropViewRef}
                  onImageCrop={(res) => console.warn(res)}
                  keepAspectRatio
                  aspectRatio={{width: 2, height: 2}} 
                /> */}
                  
                </>
                :
                this.state.CameraVisible ?  
                <View style={styles.container}>{this.renderCamera()}</View>
                :
                
                
                    <View style={styles.fullContainer}>
                        <View style={styles.Header}>
                            <TouchableOpacity onPress={() => this.props.closeModal(this.clearfromGallery(this.state.selectedItems))}>
                                <Image source={require('../../assets/icons/Back.png')} style={{ width: 13, height: 16}}  />
                            </TouchableOpacity>
                            
                            <Text style={{ fontSize: 18, fontWeight: '700'}}>Select Image</Text>
                            <TouchableOpacity onPress={this.ChangePhotoContent}>
                            <Text style={{ fontSize: 18, color: "#4075FF", fontWeight: '700'}}>Next</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                        <FlatList
                        initialNumToRender={20}
                        //contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap'}}
                        columnWrapperStyle={{ flexWrap: 'wrap', flex: 1}}
                        numColumns={numColumns}
                        renderItem={this._renderItem}
                        data={this.state.newPhotos1}
                        keyExtractor={(item) => item.node.image.uri}
                        extraData={this.state.refreshing}
                        
                        />
                    </View>
               

            }
        
        </Modal>
            </>
        )
    }
}
export default ImageModal;
const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: "#F6F6F6"
    },
    Container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#000',
      },
    Header: {
        marginTop: isIOS ? StatusBar.currentHeight : 0,
        height: 63,
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6
    },
    ChooseCircle: {
        width: 40, 
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4075FF',
        borderRadius: 40,
        position: 'absolute',
        right: 40,
        top: 40

    },
    flipButton: {
     
        width: 50,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
       
      },
      autoFocusBox: {
        position: 'absolute',
        height: 64,
        width: 64,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
        opacity: 0.4,
      },
      flipText: {
        color: 'white',
        fontSize: 15,
      },
      zoomText: {
        position: 'absolute',
        bottom: 70,
        zIndex: 2,
        left: 2,
      },
      picButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#4075FF',
        marginBottom: 10,
        borderRadius: 50,
        backgroundColor: '#4075FF',
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
      },
      facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
      },
      face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
      },
      faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
      },
      text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
      },
      textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
      cropView: {
        marginTop: 35,
        marginBottom: 35,
        flex: 1,
      //  backgroundColor: 'red'
      },
      Edit: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50,
        backgroundColor: '#fff',
        flexDirection: 'row',
      },
    
})