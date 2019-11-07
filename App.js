import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';

import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducer, { firebaseInit } from './app/redux/index';

// Screens
import Welcome from './app/screens/Welcome';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import Home from './app/screens/Home';
import Menu from './app/screens/Menu';

const client = axios.create({
  method: 'GET',
  responseType: 'json'
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

const MainTabScreen = createMaterialTopTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: () => {
      return {
        tabBarIcon: () => {
          return (<Icon name='home'/>);
        }
      }
    }
  },
  Menu: {
    screen: Menu,
    navigationOptions: () => {
      return {
        tabBarIcon: () => {
          return (<Icon name='menu'/>);
        }
      }
    }
  }
},{
  swipeEnabled: true,
  navigationOptions: {
    header: null,
    style: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    gesturesEnabled: true
  },
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    labelStyle: {
      fontSize: 10,
      margin: 0
    },
    tabStyle: {
      height: 55
    },
    indicatorStyle: {
      opacity: 0
    }
  }
});

const AuthStack = createStackNavigator({
  Welcome: Welcome,
  Login: Login,
  Register: Register
});

const AppStack = createStackNavigator({
  Home: MainTabScreen
});

const RootStack = createSwitchNavigator({
  App: AppStack,
  Auth: AuthStack
},
{
  initialRouteName: 'Auth'
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  UNSAFE_componentWillMount = () => {
    firebaseInit();
  };

  render() {
    return (
      <Provider store={store}>
        <AppContainer/>
      </Provider>
    );
  }
}