import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, ToastAndroid, ActivityIndicator, TextInput } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Avatar, Icon } from 'react-native-elements';
import uuid from 'uuid';
// Styles
import styles from './styles/Styles';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'

import ImagePicker from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

class Profile extends Component {
    static navigationOptions = {
        title: 'Edit Profile',
    };

    state = {
        imgSource: ''
    };

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            user: null,
            uid: '',
            email: '',
            password: '',
            message: '',
            imageProfile: '',
            fileName: '',
            confirmResult: null,
            showLogout: false,
            showAlertError: false,
            isInfoFetched: false
        }
    }

    componentDidMount() {
        this.unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({isInfoFetched: false, uid: user.uid });
                const ref = database().ref(`/users/${user.uid}`);
                ref.once('value')
                    .then((response) => {
                        const userInfo = response.val()
                        this.setState({
                            firstName: userInfo.firstName,
                            lastName: userInfo.lastName,
                            email: user.email,
                            fileName: userInfo.imageProfile
                        });
                        return userInfo.imageProfile
                    })
                    .then((imgLink) => {
                        const img = storage().ref(imgLink);
                        img.getDownloadURL()
                            .then((response) => {
                                this.setState({ imageProfile: response, isInfoFetched: true });
                            });
                    });
            } else {
                this.props.navigation.navigate('Auth');
            }
        });
    }

    signOut = () => {
        this.setState({
            showLogout: true
        });
        auth().signOut().then(() => {
            this.setState({
                showLogout: false
            });
            ToastAndroid.show('You are been Logged Out.', ToastAndroid.LONG);
        })
    }

    imagePick = () => {
        const options = {
            title: 'Select Profile Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            let source;
            //console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                if (source != null){
                    this.setState({ imgSource: source });
                }
                source = { uri: response.uri };
                const ext = response.fileName.split('.').pop();
                const filename = `${uuid()}.${ext}`;
                storage().ref(`${filename}`).putFile(response.uri).then((r) => {
                    const ref = database().ref(`/users/${this.state.uid}`);
                    ref.set({
                        imageProfile: filename,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                    })
                        .then(() => {
                            storage().ref(filename).getDownloadURL().then(
                                (response) => {
                                    this.setState({
                                        imageProfile: response,
                                        fileName: filename
                                    });
                                }
                            );
                        })
                        .then(() => {
                            ToastAndroid.show('Profile Picture saved Successfully.', ToastAndroid.LONG);
                        });
                });
            }
        });
    }

    saveInfo = () => {
        const ref = database().ref(`/users/${this.state.uid}`);
        const uid = this.state.uid;
        ref.set({
            imageProfile: this.state.fileName,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        })
            .then(() => {
                ToastAndroid.show('User Info saved Successfully.', ToastAndroid.LONG);
            });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    renderErrorAlert = () => {
        const { showAlertError } = this.state;
        return (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <Image source={ require('./../assets/images/exclamation-mark.png') } style={{ width: 80, height: 80 }}/>
            </View>
            <View style={{ paddingTop: 10 }}>
                <Text>Please fill up all fields.</Text>
            </View>
            <View style={{ paddingTop: 10 }}>
                <TouchableOpacity onPress={ () => this.setState({ showAlertError: false }) }>
                    <View style={{ backgroundColor: '#dfe6e9', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 100 }}>
                        <Text>Okay</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
    
    render() {
        const { email, password, firstName, lastName, imageProfile  } = this.state;
        const { message, showLogout, showAlertError, isInfoFetched } = this.state;
        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg_main.jpg')} style={{width: '100%', height: '100%', }}>
                    <ScrollView style={{  backgroundColor: 'rgba(255,255,255,0.95) '}}>
                    <View style={{ alignItems: 'center', paddingVertical: 50 }}>
                        <TouchableOpacity onPress={this.imagePick}>
                            <Avatar
                                rounded
                                source={{ uri: imageProfile }} 
                                size="xlarge"
                                iconStyle={{
                                    width: 100,
                                    height: 100
                                }}
                                showEditButton
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 40}}>
                        <Text style={styles.fieldTitleText}>First Name</Text>
                        <TextInput
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: 1,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                marginTop: 10
                            }}
                            placeholder='First Name'
                            placeholderTextColor='rgba(0,0,0,0.2)'
                            onChangeText={(value) => this.setState({ firstName: value })}
                            value={firstName}
                        />
                    </View>
                    <View style={{ marginHorizontal: 40}}>
                        <Text style={styles.fieldTitleText}>Last Name</Text>
                        <TextInput
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: 1,
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                marginTop: 10
                            }}
                            placeholder='First Name'
                            placeholderTextColor='rgba(0,0,0,0.2)'
                            onChangeText={(value) => this.setState({ lastName: value })}
                            value={lastName}
                        />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={this.saveInfo}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10 }}>
                                <Icon name='save' type='feather' size={20}/>
                                <Text style={{ fontSize: 16 }}>  Save Info</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60}}>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10 }}>
                                <Icon name='lock' type='feather' size={20}/>
                                <Text style={{ fontSize: 16 }}>  Change Password</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </ImageBackground>

                <AwesomeAlert
                    show={showLogout}
                    showProgress={true}
                    title="Logging Out..."
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />

                <AwesomeAlert
                    show={showAlertError}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    customView={this.renderErrorAlert()}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps,mapDispatchToProps)(Profile);