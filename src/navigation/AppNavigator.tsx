import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider as PaperProvider} from 'react-native-paper';
import AlarmScreen from '../screens/Alarm/AlarmScreen';
import NotesScreen from '../screens/Notes/NotesScreen';
import TodoListScreen from '../screens/Todo/TodoListScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Todo"
            component={TodoListScreen}
            options={{
              tabBarLabel: 'Todo',
            }}
          />
          <Tab.Screen
            name="Alarm"
            component={AlarmScreen}
            options={{
              tabBarLabel: 'Alarm',
            }}
          />
          <Tab.Screen
            name="Notes"
            component={NotesScreen}
            options={{
              tabBarLabel: 'Notes',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
