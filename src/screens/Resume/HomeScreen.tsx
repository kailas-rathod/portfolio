// screens/HomeScreen.tsx

import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {Button, Text, Avatar, Card, Title, Paragraph} from 'react-native-paper';
import Realm from 'realm';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

// Realm schema definitions (same as in App.tsx)

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [resumes, setResumes] = useState<Realm.Results<any>>();

  // Fetch resumes from Realm on component mount
  useEffect(() => {
    const allResumes = realm.objects('Resume');
    setResumes(allResumes);
  }, []);

  const addOrUpdateResume = () => {
    if (selectedResumeId) {
      // Update existing resume
      updateResume(selectedResumeId);
    } else {
      // Add new resume
      addResume();
    }
  };

  const addResume = () => {
    realm.write(() => {
      realm.create('Resume', {
        _id: new Realm.BSON.ObjectId(),
        name,
        email,
        phone,
        profilePhoto,
        summary,
        skills,
        experience: [],
        education: [],
        certifications: [],
        templateId: selectedTemplate || 1,
      });
    });

    clearFields();
    fetchResumes();
  };

  const updateResume = (resumeId: string) => {
    const existingResume = realm.objectForPrimaryKey('Resume', resumeId);

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

      clearFields();
      fetchResumes();
    } else {
      Alert.alert('Error', 'Resume not found for editing.');
    }
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProfilePhoto('');
    setSummary('');
    setSkills('');
    setSelectedTemplate(null);
  };

  const fetchResumes = () => {
    const allResumes = realm.objects('Resume');
    setResumes(allResumes);
  };

  const deleteResume = (resume: any) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this resume?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: () => {
            realm.write(() => {
              realm.delete(resume);
            });
            fetchResumes();
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const editResume = (resume: any) => {
    navigation.navigate('EditResume', {resume});
  };

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (!result.didCancel && result.assets && result.assets[0].uri) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input fields and buttons */}
      <TextInput
        style={styles.input}
        placeholder="kailas"
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
      <Button mode="outlined" onPress={pickImage}>
        Pick Profile Photo
      </Button>
      {profilePhoto ? (
        <Image source={{uri: profilePhoto}} style={styles.profileImage} />
      ) : null}
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
      <Text>Select Template:</Text>
      <View style={styles.templateContainer}>
        <Button
          mode={selectedTemplate === 1 ? 'contained' : 'outlined'}
          onPress={() => setSelectedTemplate(1)}
          style={styles.templateButton}>
          Template 1
        </Button>
        <Button
          mode={selectedTemplate === 2 ? 'contained' : 'outlined'}
          onPress={() => setSelectedTemplate(2)}
          style={styles.templateButton}>
          Template 2
        </Button>
      </View>
      <Button
        mode="contained"
        onPress={addOrUpdateResume}
        disabled={!name || !email || !phone || !selectedTemplate}>
        {selectedResumeId ? 'Update Resume' : 'Add Resume'}
      </Button>

      {/* Display resumes */}
      <Text style={styles.sectionTitle}>Resumes</Text>
      {resumes && resumes.length > 0 ? (
        resumes.map((resume: any) => (
          <View key={resume._id.toString()}>
            {resume.templateId === 1 ? (
              <Template1 resume={resume} />
            ) : (
              <Template2 resume={resume} />
            )}
          </View>
        ))
      ) : (
        <Text>No resumes found.</Text>
      )}
    </ScrollView>
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
  profileImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  templateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  templateButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;
