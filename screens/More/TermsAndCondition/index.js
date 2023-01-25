import React, { Component } from 'react';
import { ScrollView,View,StyleSheet,Text } from 'react-native';
import { Space } from '../../../components/space';
import configs from '../../../utils/configs';
import { HighlightedText } from  'react-native-highlighted-text'
 
class TermsAndCondition extends Component {
    render() { 
        return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor:configs.colors.backgroundColor,
                }}
            >
                <View style={styles.container}>
                    <Text style={{fontSize:18,fontWeight:'bold'}}>Terms and Conditions</Text>
                    <Space height={10} />
                    <Text style={{fontWeight:'bold'}}>1. Introduction</Text>
                    <Space height={10}/>
                    <HighlightedText
                        highlightedTextStyles={[
                            {
                                fontWeight:  'bold',
                            },
                        ]}
                    >
                        Welcome to [[Morning Star Community Services Limited (MSCS)]] (“Company”, “we”, “our”, “us”)!
                    </HighlightedText>
                    <Space height={10}/>
                    <Text>
                        These Terms of Service and our Privay Policy (collectively “Terms”, “Terms of Service”) govern your use of the application (together or individually “Service”) operated by us.
                    </Text>

                    <Space height={10}/>
                    <Text>To be clear, your agreement with us includes these Terms and our Privacy Policy (“Agreements”). You acknowledge that you have read and understood Agreements, and agree to be bound by them.</Text>

                    <Space height={10}/>
                    <HighlightedText
                    highlightedTextStyles={[
                        {
                            fontWeight:  'bold',
                        },
                    ]}
                    >
                    If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by sending an email to [[contactus@morningstar.org.sg]] so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
                    </HighlightedText>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>
                        2. Communications
                    </Text>

                    <Space height={10}/>
                    <Text>By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by sending an email to contactus@morningstar.org.sg to inform us of your option.</Text>
                    
                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>3. Purchases</Text>

                    <Space height={10}/>
                    <Text>If you wish to purchase any product or service made available through Service (“Purchase”), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.</Text>

                    <Space height={10}/>
                    <Text>You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</Text>

                    <Space height={10}/>
                    <Text>We may use third party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.</Text>

                    <Space height={10}/>
                    <Text>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.</Text>

                    <Space height={10}/>
                    <Text>We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>4. Contests, Sweepstakes and Promotions</Text>

                    <Space height={10}/>
                    <Text>Any contests, sweepstakes or other promotions (collectively, “Promotions”) made available through Service may be governed by rules that are separate from these Terms of Service. If you participate in any Promotions, please review the applicable rules as well as our Privacy Policy. If the rules for a Promotion conflict with these Terms of Service, the Promotion rules shall apply.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>5. Refunds</Text>

                    <Space height={10}/>
                    <Text>We issue refunds for Contracts within 0 days of the original purchase of the Contract.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>5. Content</Text>

                    <Space height={10}/>
                    <Text>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (“Content”). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.</Text>

                    <Space height={10}/>
                    <Text>By posting Content on or through Service, you represent and warrant that: (i) you own the Content and/or you have the owner's authority to use the Content to grant us the right and license to use the Contentual as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to have infringed or continue to be infringing on any copyright.</Text>

                    <Space height={10}/>
                    <Text>You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.</Text>

                    <Space height={10}/>
                    <Text>We have the right but not the obligation to monitor and edit all Content provided by users.</Text>

                    <Space height={10}/>
                    <Text>In addition, Content found on or through this Service is our property or used by us with the owner's permission. Save where you own the content, you may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>6. Prohibited Uses</Text>

                    <Space height={10}/>
                    <Text>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</Text>

                    <Space height={10}/>
                    <Text>0.1. In any way that violates any applicable law or regulation.</Text>

                    <Space height={10}/>
                    <Text>0.2. For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way be it by exposing them to inappropriate content or otherwise.</Text>

                    <Space height={10}/>
                    <Text>0.3. To transmit, or procure the sending of, any advertising or promotional material, including any “junk mail”, “chain letter,” “spam,” or any other similar solicitation.</Text>

                    <Space height={10}/>
                    <Text>0.4. To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</Text>

                    <Space height={10}/>
                    <Text>0.5. In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</Text>

                    <Space height={10}/>
                    <Text>0.6. To engage in any other conduct that restricts or inhibits anyone’s use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</Text>

                    <Space height={10}/>
                    <Text>Additionally, you agree not to:</Text>

                    <Space height={10}/>
                    <Text>0.1. Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with any other party’s use of Service, including their ability to engage in real time activities through Service.</Text>

                    <Space height={10}/>
                    <Text>0.2. Use any robot, spider, or other automatic device, process, or means to access Service for any purpose, including monitoring or copying any of the material on Service.</Text>

                    <Space height={10}/>
                    <Text>0.3. Use any manual process to monitor or copy any of the material on Service or for any other unauthorized purpose without our prior written consent.</Text>

                    <Space height={10}/>
                    <Text>0.4. Use any device, software, or routine that interferes with the proper working of Service</Text>

                    <Space height={10}/>
                    <Text>0.5. Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</Text>

                    <Space height={10}/>
                    <Text>0.6. Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the server on which Service is stored, or any server, computer, or database connected to Service.</Text>

                    <Space height={10}/>
                    <Text>0.7. Attack Service via a denial-of-service attack or a distributed denial-of-service attack.</Text>

                    <Space height={10}/>
                    <Text>0.8. Take any action that may damage or falsify Company rating.</Text>

                    <Space height={10}/>
                    <Text>0.9. Otherwise attempt to interfere with the proper working of Service.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>8. Analytics</Text>

                    <Space height={10}/>
                    <Text>We may use third-party Service Providers to monitor and analyze the use of our Service.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>9. No Use By Minors</Text>
                    
                    <Space height={10}/>
                    <Text>Service is intended only for access and use by individuals at least eighteen (18) years old. By accessing or using Service, you warrant and represent that you are at least eighteen (18) years of age and have the full authority, right, and capacity to enter into this agreement and abide by all of the terms and conditions of Terms. If you are not at least eighteen (18) years old, you are prohibited from both the access to and usage of Service.</Text>


                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>10. Account</Text>

                    <Space height={10}/>
                    <Text>When you create an account with us, you guarantee that you are at least 18 years old, and that the information you provide us is accurate, complete, and current at the material time. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on Service.</Text>

                    <Space height={10}/>
                    <Text>You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or are enabled by using your password in, our Service or a third-party service. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</Text>

                    <Space height={10}/>
                    <Text>Your username shall not be (i) the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you, without appropriate authorization,(ii) offensive, vulgar or obscene.</Text>

                    <Space height={10}/>
                    <Text>We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders in our sole discretion.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>11. Intellectual Property</Text>

                    <Space height={10}/>
                    <Text>Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Company and/or its licensors. Service is protected by copyright, trademark, and other applicable laws in and outside of Singapore. Our trademarks may not be used in connection with any product or service without our prior written consent.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>12 . Copyright Policy</Text>

                    <Space height={10}/>
                    <Text >We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on Service infringes on the copyright or other intellectual property rights (“Infringement”) of any person or entity.</Text>

                    <Space height={10}/>
                    <HighlightedText highlightedTextStyles={[
                        {
                            fontWeight:'bold'
                        }
                    ]}>If you are a copyright owner, or authorized on behalf of one, and you believe that copyrighted work has been used or copied in a way that constitutes copyright infringement, please submit your claim ("Copyright Infringement Claim") via email to [[contactus@morningstar.org.sg]], with the subject line: “Copyright Infringement” and include in your claim a detailed description of the alleged Infringement as detailed below, under “Notice and Procedure for Copyright Infringement Claims”</HighlightedText>

                    <Space height={10}/>
                    <Text>However, we reserve the right to hold you accountable for damages any damage or loss arising from any Copyright Infringement Claim lodged by you.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>13. Notice and Procedure for Copyright Infringement Claims</Text>

                    <Space height={10}/>
                    <HighlightedText highlightedTextStyles={[
                        {
                            fontWeight:'bold'
                        }
                    ]}>You may submit a Copyright Infringement Claim to us at [[contactus@morningstar.org.sg]] by providing us with the following information in writing:</HighlightedText>

                    <Space height={10}/>
                    <Text>0.1. an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright’s interest;</Text>

                    <Space height={10}/>
                    <Text>0.2. a description of the copyrighted work that you claim has been infringed, including the URL (i.e., web page address) of the location where the copyrighted work exists or a copy of the copyrighted work</Text>

                    <Space height={10}/>
                    <Text>0.3. identification of the URL or other specific location on Service where the material that you claim is infringing is located</Text>

                    <Space height={10}/>
                    <Text>0.4. your address, telephone number, and email address;</Text>

                    <Space height={10}/>
                    <Text>0.5. a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;</Text>

                    <Space height={10}/>
                    <Text>0.6. a statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.</Text>


                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>14. Error Reporting and Feedback</Text>

                    <Space height={10}/>
                    <HighlightedText highlightedTextStyles={[
                        {
                            fontWeight:'bold',
                        }
                    ]}>You may provide us either directly at [[contactus@morningstar.org.sg]] or via third party sites and tools with information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and other matters related to our Service (“Feedback”). You acknowledge and agree that: (i) you shall not retain, acquire or assert any intellectual property right or other right, title or interest in or to the Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain confidential information or proprietary information from you or any third party; and (iv) Company is not under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the ownership to the Feedback is not possible for whatever reason(s), you irrevocably grant Company and its affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and perpetual right to use (including copy, modify, create derivative works, publish, distribute and commercialize) Feedback in any manner and for any purpose.</HighlightedText>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>15. Links To Other Web Sites</Text>

                    <Space height={10}/>
                    <Text>Our Service may contain links to third party web sites or services that are not owned or controlled by us.</Text>

                    <Space height={10}/>
                    <Text>We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third party web sites or services. We do not make any warranty whatsoever regarding - the offerings of any of these entities/individuals or their websites and recommend that you read their terms and policies (if any).</Text>

                    
                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>16. Disclaimer Of Warranty</Text>

                    <Space height={10}/>
                    <Text>THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE” BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.</Text>

                    <Space height={10}/>
                    <Text>NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.</Text>

                    <Space height={10}/>
                    <Text>COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.</Text>

                    <Space height={10}/>
                    <Text>THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>17. Limitation Of Liability</Text>
                    
                    <Space height={10}/>
                    <Text>EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS’ FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES.</Text>

                    
                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>18. Termination</Text>

                    <Space height={10}/>
                    <Text>We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever , including but not limited to a breach of Terms.</Text>

                    <Space height={10}/>
                    <Text>If you wish to terminate your account, you may simply discontinue using Service.</Text>

                    <Space height={10}/>
                    <Text>All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>19. Governing Law</Text>

                    <Space height={10}/>
                    <Text>These Terms shall be governed and construed in accordance with the laws of Singapore, which governing law applies to agreement without regard to its conflict of law provisions.</Text>

                    <Space height={10}/>
                    <Text>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding Service.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>20. Changes To Service</Text>

                    <Space height={10}/>
                    <Text>We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period. From time to time, we may restrict access to some parts of Service, or the entire Service, to users, including registered users.</Text>


                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>21. Amendments To Terms</Text>

                    <Space height={10}/>
                    <Text>We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.</Text>

                    <Space height={10}/>
                    <Text>Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.</Text>

                    <Space height={10}/>
                    <Text>By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use Service.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>22. Waiver And Severability</Text>

                    <Space height={10}/>
                    <Text>No waiver by Company of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure of Company to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.</Text>

                    <Space height={10}/>
                    <Text>If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be invalid, illegal or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of these Terms will continue in full force and effect.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>23. Acknowledgemen</Text>

                    <Space height={10}/>
                    <Text>BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.</Text>

                    <Space height={10}/>
                    <Text style={{fontWeight:'bold'}}>24. Contact Us</Text>

                    <Space height={10}/>
                    <HighlightedText highlightedTextStyles={[
                        {
                            fontWeight:'bold'
                        }
                    ]}>
                        Please send your feedback, comments, requests for technical support by email: [[contactus@morningstar.org.sg]].
                    </HighlightedText>
                </View>
            </ScrollView>
        );
    }
}
 
export default TermsAndCondition;

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
    }
})