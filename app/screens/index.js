import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity } from 'react-native';

import firebase from 'react-native-firebase';
const { width, height } = Dimensions.get('window');

class Index extends Component {
    static navigationOptions = {
        title: 'Home'
    };

    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            user: null,
            email: '',
            password: '',
            message: '',
            confirmResult: null
        }
    }

    state = {};

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
                    confirmResult: null
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe) this.unsubscribe();
    }

    signIn = () => {
        const { email, password } = this.state;
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((confirmResult) => this.setState({ confirmResult, message: 'Validated'}))
            .catch((error) => this.setState({ message: `${error.message}`}));
    }
    
    render() {
        const { email, password } = this.state;
        const { message } = this.state;
        return(
            <View style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Email</Text>
                    <TextInput
                        style={{
                            width: width/1.2,
                            textAlign: 'center',
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                        placeholder='Email'
                        placeholderTextColor='#ffffff'
                        onChangeText={(value) => this.setState({ email: value })}
                        value={email}
                    />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Password</Text>
                    <TextInput
                        style={{
                            width: width/1.2,
                            textAlign: 'center',
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                        secureTextEntry={true}
                        placeholder='Email'
                        placeholderTextColor='#ffffff'
                        onChangeText={(value) => this.setState({ password: value })}
                        value={password}
                    />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <Text>{message}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={this.signIn}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps,mapDispatchToProps)(Index);