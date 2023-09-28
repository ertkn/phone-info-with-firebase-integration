import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import InfoScreen from '../screens/InfoScreen/InfoScreen';
import navStrings from '../constants/navStrings';

const Stack = createNativeStackNavigator();

function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={navStrings.HOME}>
        <Stack.Screen
          options={homeScreenOption}
          name={navStrings.HOME}
          component={HomeScreen}
        />
        <Stack.Screen
          options={phoneInfoScreenOption}
          name={navStrings.INFO}
          component={InfoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function homeScreenOption() {
  return (options = {
    headerBackButtonMenuEnabled: true,
    headerShown: false,
    title: 'Home',
  });
}

function phoneInfoScreenOption() {
  return (options = {
    headerBackButtonMenuEnabled: true,
    headerShown: true,
    title: 'Phone Info',
  });
}
export default Route;
