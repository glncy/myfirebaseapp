import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

// Styles
import styles from './styles/Styles';

import firebase from '@react-native-firebase/app';

const { width, height } = Dimensions.get('window');

class Home extends Component {
    static navigationOptions = {
        title: 'Home',
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
            showAlert: false,
            showAlertError: false
        }
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
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
        const { message, showAlert, showAlertError } = this.state;
        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg_main.jpg')} style={{width: '100%', height: '100%', }}>
                    <ScrollView style={{  backgroundColor: 'rgba(255,255,255,0.8) '}}>
                        <Text>Test Content</Text>
                    </ScrollView>
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

export default connect(mapStateToProps,mapDispatchToProps)(Home);