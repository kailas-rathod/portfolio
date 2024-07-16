import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TodoListScreen from './TodoListScreen';
import AlarmScreen from './AlarmScreen';
import NotesScreen from './NotesScreen';
import {Provider as PaperProvider} from 'react-native-paper';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => {
  return (
    <PaperProvider>
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
    </PaperProvider>
  );
};

export default MainTabs;
