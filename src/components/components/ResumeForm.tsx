import React, {useState} from 'react';
import {View, TextInput, Button, Image, StyleSheet} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

interface ResumeFormProps {
  onSubmit: (resumeData: any) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({onSubmit}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (!result.didCancel && result.assets && result.assets[0].uri) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      name,
      email,
      phone,
      profilePhoto,
      summary,
      skills,
      experience: [],
      education: [],
      certifications: [],
    });
    clearFields();
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProfilePhoto('');
    setSummary('');
    setSkills('');
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
      <Button mode="outlined" onPress={pickImage}>
        Pick a Profile Photo
      </Button>
      {profilePhoto ? (
        <Image source={{uri: profilePhoto}} style={styles.profilePhoto} />
      ) : null}
      <Button mode="contained" onPress={handleSubmit}>
        Add Resume
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default ResumeForm;
