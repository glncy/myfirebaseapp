import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Dimensions, TouchableOpacity, ImageBackground, Image } from 'react-native';

// Styles
import styles from './styles/Styles';

import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

class Welcome extends Component {
    static navigationOptions = {
        header: null
    };

    state = {};

    constructor(props) {
        super(props);
        this.unsubscribe = auth().onAuthStateChanged((user) => {
            if (user){
                this.props.navigation.navigate('App');
            }
        });
    }
    
    render() {
        return(
            <View style={styles.mainView}>
                <ImageBackground source={require('./../assets/images/bg.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={styles.appTitle}>
                        <Image source={require('./../assets/images/firebase.png')} style={{ width: 350, height: 350, resizeMode: 'contain'}}/>
                        {/* <Text style={styles.appTitleText}>My Firebase App</Text> */}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                            <Text style={styles.loginButton}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={styles.registerButton}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps,mapDispatchToProps)(Welcome);