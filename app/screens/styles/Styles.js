import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#00b894'
    },
    appTitle: {
        textAlign: 'center',
        alignItems: 'center',
        paddingTop: height/10,
        paddingBottom: height/10,
    },
    appTitleText: {
        fontSize: 30,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        marginHorizontal: 70,
        textAlign: 'center'
    },
    loginButton: {
        fontSize: 20,
        padding: 15,
        margin: 10,
        borderRadius: 100,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#2d3436',
        backgroundColor: '#fab1a0',
        width: width/1.8
    },
    registerButton: {
        fontSize: 20,
        padding: 15,
        margin: 10,
        borderRadius: 100,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
        color: '#2d3436',
        backgroundColor: '#81ecec',
        width: width/1.8
    },
    loginTitleText: {
        fontSize: 35,
        margin: 30,
        fontFamily: 'Montserrat-Bold',
        color: '#2d3436',
        textAlign: 'center'
    },
    fieldTitleText: {
        fontSize: 16,
        marginTop: 15,
        fontFamily: 'Montserrat-Regular',
        color: '#2d3436'
    },
    profileNameText: {
        fontSize: 22,
        marginTop: 15,
        fontFamily: 'Montserrat-Medium',
        color: '#2d3436'
    },
    profileNameEmail: {
        fontSize: 14,
        marginTop: 2,
        fontFamily: 'Montserrat-Regular',
        color: '#2d3436'
    },
});