import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, ToastAndroid } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Avatar, Icon } from 'react-native-elements';
// Styles
import styles from './styles/Styles';

import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

class Menu extends Component {
    static navigationOptions = {
        title: 'Menu',
    };

    state = {};

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            user: null,
            email: '',
            password: '',
            message: '',
            confirmResult: null,
            showLogout: false,
            showAlertError: false
        }
    }

    componentDidMount() {
        this.unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                this.setState({
                    user: null,
                    email: '',
                    password: '',
                    message: '',
                    firstName: '',
                    lastName: '',
                    confirmResult: null
                });
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
            this.props.navigation.navigate('Auth');
        })
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
        const { email, password, firstName, lastName } = this.state;
        const { message, showLogout, showAlertError } = this.state;
        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg_main.jpg')} style={{width: '100%', height: '100%', }}>
                    <ScrollView style={{  backgroundColor: 'rgba(255,255,255,0.95) '}}>
                    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                        <Avatar
                            rounded
                            source={{
                                uri:
                                    'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                            }} 
                            size="xlarge"
                            iconStyle={{
                                width: 100,
                                height: 100
                            }}
                        />
                        <Text style={styles.profileNameText}>Juan Dela Cruz</Text>
                        <Text style={styles.profileNameEmail}>juandelacruz@gmail.com</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10 }}>
                                <Icon name='user' type='antdesign' size={30}/>
                                <Text style={{ fontSize: 24 }}>  Profile</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.signOut}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 25, paddingHorizontal: 10 }}>
                                <Icon name='log-out' type='feather' size={30}/>
                                <Text style={{ fontSize: 24 }}>  Logout</Text>
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

export default connect(mapStateToProps,mapDispatchToProps)(Menu);