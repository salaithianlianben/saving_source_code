import React, { Component } from 'react';
import { ScrollView,View,StyleSheet,Text } from 'react-native';
import { Space } from '../../../components/space';
import configs from '../../../utils/configs';
import TermsAndCondition from '../TermsAndCondition';
 
class PrivacyPolicy extends Component {
    render() { 
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor:configs.colors.backgroundColor,
                }}
            >
                <View style={styles.container}>
                    <Text style={{fontSize:18,fontWeight:'bold',}}>Data Protection Policy</Text>
                    <Space height={10} />
                    <Text>At Morning Star Community Services Limited (MSCS), the privacy of your personal data is important to us and we are committed to safeguarding the information you provide us with, as detailed in this Policy, in line with the Singapore Personal Data Protection Act (PDPA) effective from 2 July 2014.</Text>
                    <Space height={10} />
                    <Text style={{fontWeight:'700'}}>1. Collection, Use & Disclosure of Personal Data</Text>
                    <Space height={10} />
                    <Text>MSCS may collect, use and disclose personal data for the one or more of the following purposes:</Text>
                    <Space height={10}/>
                    <View style={{marginLeft:15}}>
                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To provide programmes and services to our clients</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To engage volunteers and donors</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To work with partners</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>For employment matters</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To generate internal reports</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To carry out third-party research, analysis and development activities</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To perform policy and process reviews, including but not limited to data analytics, surveys, research, development activities and student and family profiling to improve any of MSCS’ programmes and support services</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To report to relevant regulatory authorities and for purposes required by law, regulations and guidelines</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <View style={[styles.dot,{ marginTop:5,}]}/>
                            <Space width={5}/>
                            <View>
                                <Text>To conduct temperature screening with facial recognition features</Text>
                            </View>
                        </View>
                    </View>

                    <Space height={20}/>
                    <Text>For these purposes, we may contact you via mail, email, telephone, SMS or other communication means.</Text>

                    <Space height={10} />
                    <Text>Examples of personal data are, but not limited to, name, age, citizenship, identification number, academic status and results, medical and disability information, residential address, mobile and residential telephone number, personal email address, bank account, photograph or video image.</Text>

                    <Space height={10}/>
                    <Text>As our mission is to build vibrant communities through empowering families and individuals, we frequently organise community and third-party activities that are open to the public. Photographs and videos taken during the activities and events might be shared or published by MSCS or third-parties. Individuals may inform if they would prefer their image not to be used.</Text>

                    <Space height={10} />
                    <Text style={{fontWeight:'700'}}>2. Access, Correction & Withdrawal</Text>

                    <Space height={10}/>
                    <Text>You may request for access and amendment to your personal information by informing the service staff whom you know about your request</Text>

                    <Space height={10}/>
                    <Text>For access, withdrawal, correction, you may contact our Data Protection Officer at contactus@morningstar.org.sg</Text>

                    <Space height={10}/>
                    <Text>We may refute your access in cases if and when such related personal data is under legal proceeding, no proper identification or request is carried out with suspected fraudulent intent.</Text>

                    <Space height={10} />
                    <Text style={{fontWeight:'700'}}>3. Protection & Retention</Text>

                    <Space height={10}/>
                    <Text>MSCS will take all reasonable precautions to protect your Personal Data from misuse, loss, unauthorised access, modification or disclosure. We will not disclose any extent greater than necessary which we determine in good faith.</Text>

                    <Space height={10}/>
                    <Text>We will retain your Personal Data for a reasonable period for the purposes as cited or until you request for us to delete the Personal Data, or as required by law.</Text>

                    <Space height={10} />
                    <Text style={{fontWeight:'700'}}>4. Changes to Policy</Text>

                    <Space height={10}/>
                    <Text>MSCS reserves the right to amend this Data Protection Policy at any time. If we make any changes to this Data Protection Policy, we will post these changes on our website. Please check our website from time to time for any changes or updates to our Data Protection Policy.</Text>

                    <Space height={10}/>
                    <Text>For queries regarding this Policy, you may contact our Data Protection Officer at contactus@morningstar.org.sg</Text>

                    <Space height={10}/>
                    <Text>Morning Star Community Services HQ</Text>
                    <Text>Pu Tian Building #04-01</Text>
                    <Text>25 Lorong 33 Geylang</Text>
                    <Text>Singapore 387985</Text>
                </View>
            </ScrollView>
        );
    }
}
 
export default PrivacyPolicy;

const styles = StyleSheet.create({
    container:{
        margin: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: 'white',
        shadowOffset: {width: 0, height: 0.5},
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    dot:{
        backgroundColor:'black',
        height:8,width:8,borderRadius:8,
    }
})