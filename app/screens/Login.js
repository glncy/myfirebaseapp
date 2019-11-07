import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ToastAndroid } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

// Styles
import styles from './styles/Styles';

import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

class Login extends Component {
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
        this.unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                this.props.navigation.navigate('App');
            } else {
                this.setState({
                    user: null,
                    email: '',
                    password: '',
                    message: '',
                    confirmResult: null
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    signIn = () => {
        const { email, password, showAlert } = this.state;
        if ((email != "")&&(password != "")){
            this.setState({
                showAlert: true
            });
            auth()
                .signInWithEmailAndPassword(email, password)
                .then((confirmResult) => {
                    ToastAndroid.show('You are now Logged In.', ToastAndroid.LONG);
                    this.setState({ confirmResult, message: 'Validated', showAlert: false })
                })
                .catch((error) => this.setState({showAlert: false, message: `${error.message}`}));
        }
        else {
            this.setState({
                showAlertError: true
            })
        }
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
        const { email, password } = this.state;
        const { message, showAlert, showAlertError } = this.state;
        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg_next.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={{ marginTop: 20, marginLeft: 20}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack() }>
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', width: width/5, alignItems: 'center', padding: width/60, borderRadius: 100 }}>
                                <Image source={require('./../assets/images/left-arrow.png')} style={{width: width/12, height: height/12, resizeMode: 'contain'}} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.loginTitleText}>Login</Text>
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
                        <TouchableOpacity onPress={this.signIn}>
                            <Text style={styles.loginButton}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Text>Don't have account?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{ marginVertical: 5 }}>Click Here</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                <AwesomeAlert
                    show={showAlert}
                    showProgress={true}
                    title="Logging In..."
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

export default connect(mapStateToProps,mapDispatchToProps)(Login);