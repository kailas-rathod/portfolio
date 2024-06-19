import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Button,
  StyleSheet,
  Image,
  View,
  Text,
  Alert,
} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Realm from 'realm';
import {launchImageLibrary} from 'react-native-image-picker';
import {Card, Avatar, Title, TextInput, Paragraph} from 'react-native-paper';

// Realm Schemas
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

// Realm instance
const realm = new Realm({
  schema: [
    ResumeSchema,
    ExperienceSchema,
    EducationSchema,
    CertificationSchema,
  ],
  schemaVersion: 1,
});

// Custom Components
const CustomTextInput: React.FC<{
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}> = ({placeholder, value, onChangeText, multiline}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, multiline && styles.multiline]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
    />
  </View>
);

interface TemplateProps {
  resume: any;
  onDelete: (resume: any) => void;
  onEdit: (resume: any) => void;
}

const Template: React.FC<TemplateProps> = ({resume, onDelete, onEdit}) => (
  <Card style={styles.card}>
    <Card.Content>
      <View style={styles.row}>
        <Avatar.Image size={80} source={{uri: resume.profilePhoto}} />
        <View style={styles.details}>
          <Title>{resume.name}</Title>
          <Paragraph>{resume.email}</Paragraph>
          <Paragraph>{resume.phone}</Paragraph>
          <Paragraph>{resume.summary}</Paragraph>
          <Paragraph>{resume.skills}</Paragraph>
        </View>
      </View>
      <View style={styles.section}>
        <Title>Experience</Title>
        <ScrollView>
          {resume.experience.map((exp: any) => (
            <View key={exp._id} style={styles.item}>
              <Text>{exp.role}</Text>
              <Text>{exp.company}</Text>
              <Text>{`${exp.startDate.toDateString()} - ${exp.endDate.toDateString()}`}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Title>Education</Title>
        <ScrollView>
          {resume.education.map((edu: any) => (
            <View key={edu._id} style={styles.item}>
              <Text>{edu.degree}</Text>
              <Text>{edu.institution}</Text>
              <Text>{edu.graduationDate.toDateString()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Title>Certifications</Title>
        <ScrollView>
          {resume.certifications.map((cert: any) => (
            <View key={cert._id} style={styles.item}>
              <Text>{cert.name}</Text>
              <Text>{cert.institution}</Text>
              <Text>{cert.date.toDateString()}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Card.Content>
    <Card.Actions>
      <Button title="Delete" onPress={() => onDelete(resume)} />
      <Button title="Edit" onPress={() => onEdit(resume)} />
    </Card.Actions>
  </Card>
);

// Screens
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(1);
  const [resumes, setResumes] = useState<Realm.Results<any>>();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = () => {
    const allResumes = realm.objects('Resume');
    setResumes(allResumes);
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

  const clearFields = () => {
    setName('');
    setEmail('');
    setPhone('');
    setProfilePhoto('');
    setSummary('');
    setSkills('');
    setSelectedTemplate(1);
  };

  const deleteResume = (resume: any) => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete this resume?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            realm.write(() => {
              realm.delete(resume);
            });
            fetchResumes();
          },
        },
      ],
      {cancelable: true},
    );
  };

  const editResume = (resume: any) => {
    navigation.navigate('EditResume', {resumeId: resume._id});
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfilePhoto(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <CustomTextInput placeholder="Name" value={name} onChangeText={setName} />
      <CustomTextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <CustomTextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <CustomTextInput
        placeholder="Summary"
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      <CustomTextInput
        placeholder="Skills"
        value={skills}
        onChangeText={setSkills}
        multiline
      />
      <Button title="Pick Profile Photo" onPress={pickImage} />
      {profilePhoto ? (
        <Image source={{uri: profilePhoto}} style={styles.image} />
      ) : null}
      <View style={styles.templateContainer}>
        <Text>Select Template:</Text>
        {[1, 2, 3].map(templateId => (
          <Button
            key={templateId}
            title={`Template ${templateId}`}
            onPress={() => setSelectedTemplate(templateId)}
            color={selectedTemplate === templateId ? 'blue' : 'gray'}
          />
        ))}
      </View>
      <Button
        title="Add Resume"
        onPress={addResume}
        disabled={!selectedTemplate}
      />
      {resumes?.map((resume: any) => (
        <Template
          key={resume._id}
          resume={resume}
          onDelete={deleteResume}
          onEdit={editResume}
        />
      ))}
    </ScrollView>
  );
};

const EditResumeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resumeId} = route.params as {resumeId: string};
  const [editedResume, setEditedResume] = useState<any>(null);

  useEffect(() => {
    const resume = realm.objectForPrimaryKey(
      'Resume',
      new Realm.BSON.ObjectId(resumeId),
    );
    setEditedResume(resume);
  }, [resumeId]);

  const handleInputChange = (field: string, value: string) => {
    setEditedResume({...editedResume, [field]: value});
  };

  const saveChanges = () => {
    realm.write(() => {
      editedResume.name = editedResume.name;
      editedResume.email = editedResume.email;
      editedResume.phone = editedResume.phone;
      editedResume.profilePhoto = editedResume.profilePhoto;
      editedResume.summary = editedResume.summary;
      editedResume.skills = editedResume.skills;
    });
    navigation.goBack();
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setEditedResume({
          ...editedResume,
          profilePhoto: response.assets[0].uri,
        });
      }
    });
  };

  if (!editedResume) return null;

  return (
    <ScrollView style={styles.container}>
      <CustomTextInput
        placeholder="Name"
        value={editedResume.name}
        onChangeText={value => handleInputChange('name', value)}
      />
      <CustomTextInput
        placeholder="Email"
        value={editedResume.email}
        onChangeText={value => handleInputChange('email', value)}
      />
      <CustomTextInput
        placeholder="Phone"
        value={editedResume.phone}
        onChangeText={value => handleInputChange('phone', value)}
      />
      <CustomTextInput
        placeholder="Summary"
        value={editedResume.summary}
        onChangeText={value => handleInputChange('summary', value)}
        multiline
      />
      <CustomTextInput
        placeholder="Skills"
        value={editedResume.skills}
        onChangeText={value => handleInputChange('skills', value)}
        multiline
      />
      <Button title="Pick Profile Photo" onPress={pickImage} />
      {editedResume.profilePhoto ? (
        <Image source={{uri: editedResume.profilePhoto}} style={styles.image} />
      ) : null}
      <Button title="Save Changes" onPress={saveChanges} />
    </ScrollView>
  );
};

// Navigation Stack
const Stack = createStackNavigator();

const Demo: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditResume" component={EditResumeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  templateContainer: {
    marginVertical: 10,
  },
  card: {
    marginVertical: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});

export default Demo;
