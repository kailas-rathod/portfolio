// App.tsx

import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {Button, Text, Avatar, Card, Title, Paragraph} from 'react-native-paper';
import Realm from 'realm';
import {launchImageLibrary} from 'react-native-image-picker';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import EditResumeScreen from './EditResumeScreen';
import HomeScreen from './HomeScreen';

// Realm schema definitions
const ResumeSchema = {
  name: 'Resume',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    name: 'string',
    email: 'string',
    phone: 'string',
    profilePhoto: 'string',
    summary: 'string',
    skills: 'string',
    experience: {type: 'list', objectType: 'Experience'},
    education: {type: 'list', objectType: 'Education'},
    certifications: {type: 'list', objectType: 'Certification'},
    templateId: 'int',
  },
};

const ExperienceSchema = {
  name: 'Experience',
  properties: {
    _id: 'objectId',
    company: 'string',
    role: 'string',
    startDate: 'date',
    endDate: 'date',
  },
};

const EducationSchema = {
  name: 'Education',
  properties: {
    _id: 'objectId',
    institution: 'string',
    degree: 'string',
    location: 'string',
    graduationDate: 'date',
  },
};

const CertificationSchema = {
  name: 'Certification',
  properties: {
    _id: 'objectId',
    name: 'string',
    institution: 'string',
    date: 'date',
  },
};

// Initialize Realm instance
const realm = new Realm({
  schema: [
    ResumeSchema,
    ExperienceSchema,
    EducationSchema,
    CertificationSchema,
  ],
  schemaVersion: 1,
});

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
