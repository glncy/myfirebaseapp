import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Modal, ToastAndroid } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Icon, Card } from 'react-native-elements';

import uuid from 'uuid';
import moment from 'moment';

// Styles
import styles from './styles/Styles';

import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

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
            user: [],
            email: '',
            password: '',
            message: '',
            confirmResult: null,
            showAlert: false,
            showAlertError: false,
            showNewNote: false,
            notes: [],
            addNote: "",
            isNoNotes: false
        }
    }

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user });
                this.fetchData(user.uid);
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

    saveNote = (uid) => {
        const { addNote } = this.state;
        const id = uuid();
        if (addNote != ""){
            const ref = database().ref(`/notes/${uid}/${id}`);
            ref.set({
                body: addNote,
                date: moment().format('MMMM D, YYYY')
            })
                .then(() => {
                    this.setState({ showNewNote: false, addNote: "" });
                    ToastAndroid.show('Added Note.', ToastAndroid.LONG);
                    this.fetchData(uid);
                });
        }
        else {
            ToastAndroid.show('No note. Nothing to Save.', ToastAndroid.LONG);
        }
    }
    
    // cardNote = (body, date, id) => {
    //     return ();
    // }

    fetchData = (uid) => {
        const ref = database().ref(`/notes/${uid}`);
        ref.once('value')
            .then((response) => {
                console.log(response.val());
                if (response.val() != null){
                    const obj = JSON.parse(JSON.stringify(response));
                    this.setState({
                        notes: obj
                    });
                    const noteContainer = Object.entries(obj);
                    if (noteContainer.length > 0){
                        this.setState({
                            isNoNotes: true
                        });
                    }
                    else {
                        this.setState({
                            isNoNotes: false
                        });
                    }
                }
                else {
                    this.setState({
                        isNoNotes: false,
                        notes: null
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isNoNotes: false,
                    notes: null
                });
            })
    }

    deleteNote = (uid) => {
        const { user } = this.state;
        const ref = database().ref(`/notes/${user.uid}/${uid}`);
        ref.remove()
            .then(() => {
                ToastAndroid.show('Deleted Note.', ToastAndroid.LONG);
            })
            .then(() => {
                this.fetchData(user.uid);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    renderContent = () => {
        const { isNoNotes, notes } = this.state;
        let content;
        if(isNoNotes){
            const obj = Object.entries(notes);
            obj.slice(0).reverse().map((x) => {
                content = [
                    <Card key={x[0]}>
                        <Text>
                            {x[1].body}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ textAlignVertical: 'center' }}>{x[1].date}</Text>
                            <TouchableOpacity onPress={() => {
                                this.deleteNote(x[0]);
                            }}>
                                <Icon name='trash' type='feather' reverse color="#ff7675" size={18}/>
                            </TouchableOpacity>
                        </View>
                    </Card>
                , content];
            });
            return content;
        }
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
        const { message, showAlert, showAlertError, showNewNote, user, notes, addNote } = this.state;

        return(
            <View style={ styles.mainView }>
                <ImageBackground source={require('./../assets/images/bg_main.jpg')} style={{width: '100%', height: '100%', }}>
                    <ScrollView style={{  backgroundColor: 'rgba(255,255,255,0.8) '}}>
                        <Text style={styles.loginTitleText}>Notes</Text>
                        {this.renderContent()}
                        <View style={{ paddingVertical: 30 }}></View>
                    </ScrollView>
                    <TouchableOpacity style={{ position: 'absolute', backgroundColor: '#74b9ff', padding: 15, borderRadius: 100, top: height/1.25, left: width/1.25 }} onPress={() => {
                        this.setState({ showNewNote: true });
                    }}>
                        <View>
                            <Icon name='plus' type='entypo' color='#FFFFFF' size={30}></Icon>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showNewNote}
                    onRequestClose={() => {
                        this.setState({ showNewNote: false });
                    }}
                >
                    <View style={{backgroundColor: "rgba(0,0,0,0.5)", height: height, width: width,}}>
                        <View style={{backgroundColor: "rgba(255,255,255,1)", marginHorizontal: 50, marginTop: 200, padding: 20, borderRadius: 10}}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ justifyContent: 'center', textAlignVertical: 'center' }}>Add Note</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ showNewNote: false });
                                    }}
                                    style={{ alignItems: 'center'}}
                                >
                                    <Icon name="closecircle" type="antdesign"/>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <TextInput 
                                    multiline={true}
                                    numberOfLines={10}
                                    placeholder='Note'
                                    placeholderTextColor='rgba(0,0,0,0.2)'
                                    onChangeText={(value) => this.setState({ addNote: value })}
                                    value={addNote}
                                    style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 10, textAlignVertical: 'top' }}
                                />
                                <TouchableOpacity style={{ marginTop: 20, backgroundColor: "#81ecec", borderRadius: 100}} onPress={() => {
                                    this.saveNote(user.uid);
                                }}>
                                    <Text style={{ textAlign: 'center', color: 'white', paddingVertical: 10 }}>Add Note</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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