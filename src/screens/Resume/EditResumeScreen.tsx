// screens/EditResumeScreen.tsx

import React, {useState} from 'react';
import {ScrollView, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import Realm from 'realm';
import CustomTextInput from '../../components/components/CustomTextInput';

const EditResumeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resume} = route.params;

  const [editedResumeData, setEditedResumeData] = useState({
    name: resume.name,
    email: resume.email,
    phone: resume.phone,
    profilePhoto: resume.profilePhoto,
    summary: resume.summary,
    skills: resume.skills,
  });

  const handleInputChange = (field: string, value: string) => {
    setEditedResumeData({...editedResumeData, [field]: value});
  };

  const saveChanges = () => {
    Realm.write(() => {
      Object.assign(resume, editedResumeData);
    });

    navigation.goBack();
  };

  const pickImage = async () => {
    // Implement pick image logic
  };

  return (
    <ScrollView style={screenStyles.container}>
      {['name', 'email', 'phone', 'summary', 'skills'].map(field => (
        <CustomTextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={editedResumeData[field]}
          onChangeText={value => handleInputChange(field, value)}
          multiline={field === 'summary' || field === 'skills'}
        />
      ))}
      <Button mode="outlined" onPress={pickImage}>
        Pick a Profile Photo
      </Button>
      {editedResumeData.profilePhoto ? (
        <Image
          source={{uri: editedResumeData.profilePhoto}}
          style={screenStyles.profilePhoto}
        />
      ) : null}
      <Button mode="contained" onPress={saveChanges}>
        Save Changes
      </Button>
    </ScrollView>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
});

export default EditResumeScreen;
