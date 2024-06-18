// screens/EditResumeScreen.tsx

import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import Realm from 'realm';
import {useNavigation, useRoute} from '@react-navigation/native';

// Realm schema definitions (same as in App.tsx)

const EditResumeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resume} = route.params;

  const [name, setName] = useState(resume.name);
  const [email, setEmail] = useState(resume.email);
  const [phone, setPhone] = useState(resume.phone);
  const [profilePhoto, setProfilePhoto] = useState(resume.profilePhoto);
  const [summary, setSummary] = useState(resume.summary);
  const [skills, setSkills] = useState(resume.skills);
  const [selectedTemplate, setSelectedTemplate] = useState(resume.templateId);

  const realm = new Realm({
    schema: [
      ResumeSchema,
      ExperienceSchema,
      EducationSchema,
      CertificationSchema,
    ],
    schemaVersion: 1,
  });

  const updateResume = () => {
    const existingResume = realm.objectForPrimaryKey('Resume', resume._id);

    if (existingResume) {
      realm.write(() => {
        existingResume.name = name;
        existingResume.email = email;
        existingResume.phone = phone;
        existingResume.profilePhoto = profilePhoto;
        existingResume.summary = summary;
        existingResume.skills = skills;
        existingResume.templateId = selectedTemplate || 1;
      });

      Alert.alert('Success', 'Resume updated successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } else {
      Alert.alert('Error', 'Resume not found for editing.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Photo"
        value={profilePhoto}
        onChangeText={setProfilePhoto}
      />
      <TextInput
        style={styles.input}
        placeholder="Summary"
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Skills"
        value={skills}
        onChangeText={setSkills}
        multiline
      />
      <Button
        title="Update Resume"
        onPress={updateResume}
        disabled={!name || !email || !phone || !selectedTemplate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default EditResumeScreen;
