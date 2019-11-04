import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import reducer, { firebaseInit } from './app/redux/index';

// Screens
import Index from './app/screens/index';

const client = axios.create({
  method: 'GET',
  responseType: 'json'
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

const RootStack = createStackNavigator({
  Index: {
    screen: Index
  }
},
{
  initialRouteName: 'Index'
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