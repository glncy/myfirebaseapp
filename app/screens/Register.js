import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, ToastAndroid } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

// Styles
import styles from './styles/Styles';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const { width, height } = Dimensions.get('window');

class Register extends Component {
    static navigationOptions = {
        // title: 'Login',
        // headerStyle: {
        //     backgroundColor: 'rgba(0,0,0,0)',
        // },
        header: null
    };

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            user: null,
            errorCode: '',
            email: '',
            password: '',
            message: '',
            confirmResult: null,
            showAlert: false,
            showAlertError: false
        }
    }

    state = {};

    componentDidMount() {
        const { navigation } = this.props;
        this.unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
                this.props.navigation.navigate('App');
            } else {
                this.setState({
                    user: null,
                    email: navigation.getParam('email', ''),
                    password: '',
                    message: '',
                    firstName: '',
                    lastName: '',
                    confirmResult: null
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    signUp = () => {
        const { email, password, showAlert, firstName, lastName } = this.state;
        if ((email != "")&&(password != "")&&(firstName != "")&&(lastName != "")){
            console.log(this.unsubscribe());
            this.setState({
                showAlert: true
            });
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((confirmResult) => {
                    const uid = auth().currentUser.uid;
                    const ref = database().ref(`/users/${uid}`);
                    ref.set({
                        uid,
                        firstName: firstName,
                        lastName: lastName
                    })
                        .then(() => {
                            ToastAndroid.show('You are now Registered.', ToastAndroid.LONG);
                            this.setState({ confirmResult, showAlert: false })
                        })
                        .catch((error) => this.setState({showAlert: false, showAlertError: true, errorCode: error.code}));
            })
                .catch((error) => {
                    this.setState({showAlert: false, showAlertError: true, errorCode: error.message})
                });
        }
        else {
            this.setState({
                showAlertError: true,
                errorCode: 'no-fields'
            })
        }
    }

    renderErrorAlert = () => {
        const { errorCode } = this.state;
        let message;
        if (errorCode == 'auth/email-already-in-use'){
            message = "Email is Already in use";
        }
        else if (errorCode == 'auth/invalid-email'){
            message = "Email is Invalid";
        }
        else if (errorCode == 'no-fields'){
            message = "Please fill up all Fields";
        }
        else {
            message = "Invalid Registration. Please try Again."
        }
        return (
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <Image source={ require('./../assets/images/exclamation-mark.png') } style={{ width: 80, height: 80 }}/>
            </View>
            <View style={{ paddingTop: 10 }}>
                <Text>{message}</Text>
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
        const { email, password, firstName, lastName } = this.state;
        const { message, showAlert, showAlertError } = this.state;
        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg-next2.jpg')} style={{width: '100%', height: '100%', }}>
                    <ScrollView style={{  backgroundColor: 'rgba(255,255,255,0.0) '}}>
                        <View style={{ marginTop: 20, marginLeft: 20}}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack() }>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', width: width/5, alignItems: 'center', padding: width/60, borderRadius: 100 }}>
                                    <Image source={require('./../assets/images/left-arrow.png')} style={{width: width/12, height: height/12, resizeMode: 'contain'}} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.loginTitleText}>Register</Text>
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
                                placeholder='Last Name'
                                placeholderTextColor='rgba(0,0,0,0.2)'
                                onChangeText={(value) => this.setState({ lastName: value })}
                                value={lastName}
                            />
                        </View>
                        <View style={{ marginHorizontal: 40}}>
                            <Text style={styles.fieldTitleText}>Email</Text>
                            <TextInput
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    marginTop: 10
                                }}
                                placeholder='Email'
                                placeholderTextColor='rgba(0,0,0,0.2)'
                                onChangeText={(value) => this.setState({ email: value })}
                                value={email}
                            />
                        </View>
                        <View style={{ marginHorizontal: 40}}>
                            <Text style={styles.fieldTitleText}>Password</Text>
                            <TextInput
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    backgroundColor: 'rgba(255,255,255,0.5)',
                                    marginTop: 10
                                }}
                                secureTextEntry={true}
                                placeholder='Password'
                                placeholderTextColor='rgba(0,0,0,0.2)'
                                onChangeText={(value) => this.setState({ password: value })}
                                value={password}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                            <Text>{message}</Text>
                        </View>
                        <View style={{ alignItems: 'center'}}>
                            <TouchableOpacity onPress={this.signUp}>
                                <Text style={styles.loginButton}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center', marginVertical: 10, marginBottom: 50 }}>
                            <Text>Already have account?</Text>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                                <Text style={{ marginVertical: 5 }}>Click Here</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ImageBackground>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={true}
                    title="Registering..."
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

export default connect(mapStateToProps,mapDispatchToProps)(Register);