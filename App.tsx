// App.tsx

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import EditResumeScreen from './src/screens/Resume/EditResumeScreen';
import HomeScreen from './src/screens/Resume/HomeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditResume" component={EditResumeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
