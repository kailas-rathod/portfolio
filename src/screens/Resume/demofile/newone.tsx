// import React, {useState, useEffect} from 'react';
// import {ScrollView, StyleSheet, Image, View, Text, Alert} from 'react-native';
// import {
//   NavigationContainer,
//   useNavigation,
//   useRoute,
// } from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import Realm from 'realm';
// import {launchImageLibrary} from 'react-native-image-picker';
// import {
//   Card,
//   Avatar,
//   Title,
//   TextInput,
//   Paragraph,
//   Button,
// } from 'react-native-paper';

// // Realm Schemas
// const ResumeSchema = {
//   name: 'Resume',
//   primaryKey: '_id',
//   properties: {
//     _id: 'objectId',
//     name: 'string',
//     email: 'string',
//     phone: 'string',
//     profilePhoto: 'string',
//     summary: 'string',
//     skills: 'string',
//     experience: {type: 'list', objectType: 'Experience'},
//     education: {type: 'list', objectType: 'Education'},
//     certifications: {type: 'list', objectType: 'Certification'},
//     templateId: 'int',
//   },
// };

// const ExperienceSchema = {
//   name: 'Experience',
//   properties: {
//     _id: 'objectId',
//     company: 'string',
//     role: 'string',
//     startDate: 'date',
//     endDate: 'date',
//   },
// };

// const EducationSchema = {
//   name: 'Education',
//   properties: {
//     _id: 'objectId',
//     institution: 'string',
//     degree: 'string',
//     location: 'string',
//     graduationDate: 'date',
//   },
// };

// const CertificationSchema = {
//   name: 'Certification',
//   properties: {
//     _id: 'objectId',
//     name: 'string',
//     institution: 'string',
//     date: 'date',
//   },
// };

// // Realm instance
// const realm = new Realm({
//   schema: [
//     ResumeSchema,
//     ExperienceSchema,
//     EducationSchema,
//     CertificationSchema,
//   ],
//   schemaVersion: 1,
// });

// // HomeScreen component
// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const [resumes, setResumes] = useState([]);

//   useEffect(() => {
//     fetchResumes();
//   }, []);

//   const fetchResumes = () => {
//     const allResumes = realm.objects('Resume');
//     setResumes(allResumes);
//   };

//   const handleAddResume = () => {
//     navigation.navigate('AddResume');
//   };

//   const handleEditResume = (resumeId: string) => {
//     navigation.navigate('EditResume', {resumeId});
//   };

//   const handleDeleteResume = (resume: any) => {
//     Alert.alert(
//       'Delete Resume',
//       'Are you sure you want to delete this resume?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           onPress: () => {
//             realm.write(() => {
//               realm.delete(resume);
//             });
//             fetchResumes();
//           },
//         },
//       ],
//       {cancelable: true},
//     );
//   };

//   const renderResumes = () => {
//     return resumes.map((resume: any) => (
//       <Card key={resume._id} style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Avatar.Image size={80} source={{uri: resume.profilePhoto}} />
//             <View style={styles.details}>
//               <Title>{resume.name}</Title>
//               <Paragraph>{resume.email}</Paragraph>
//               <Paragraph>{resume.phone}</Paragraph>
//               <Paragraph>{resume.summary}</Paragraph>
//               <Paragraph>{resume.skills}</Paragraph>
//             </View>
//           </View>
//           {/* Render experience, education, certifications */}
//         </Card.Content>
//         <Card.Actions>
//           <Button onPress={() => handleDeleteResume(resume)}>Delete</Button>
//           <Button onPress={() => handleEditResume(resume._id)}>Edit</Button>
//         </Card.Actions>
//       </Card>
//     ));
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {renderResumes()}
//       <Button
//         mode="contained"
//         onPress={handleAddResume}
//         style={styles.addButton}>
//         Add Resume
//       </Button>
//     </ScrollView>
//   );
// };

// // EditResumeScreen component
// const EditResumeScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const {resumeId} = route.params as {resumeId: string};
//   const [editedResume, setEditedResume] = useState<any>(null);

//   useEffect(() => {
//     const resume = realm.objectForPrimaryKey(
//       'Resume',
//       new Realm.BSON.ObjectId(resumeId),
//     );
//     setEditedResume(resume);
//   }, [resumeId]);

//   const handleInputChange = (field: string, value: string) => {
//     setEditedResume({...editedResume, [field]: value});
//   };

//   const saveChanges = () => {
//     realm.write(() => {
//       editedResume.name = editedResume.name;
//       editedResume.email = editedResume.email;
//       editedResume.phone = editedResume.phone;
//       editedResume.profilePhoto = editedResume.profilePhoto;
//       editedResume.summary = editedResume.summary;
//       editedResume.skills = editedResume.skills;
//     });
//     navigation.goBack();
//   };

//   const pickImage = () => {
//     launchImageLibrary({mediaType: 'photo'}, response => {
//       if (response.assets && response.assets.length > 0) {
//         setEditedResume({
//           ...editedResume,
//           profilePhoto: response.assets[0].uri,
//         });
//       }
//     });
//   };

//   if (!editedResume) return null;

//   return (
//     <ScrollView style={styles.container}>
//       <TextInput
//         label="Name"
//         value={editedResume.name}
//         onChangeText={text => handleInputChange('name', text)}
//       />
//       <TextInput
//         label="Email"
//         value={editedResume.email}
//         onChangeText={text => handleInputChange('email', text)}
//       />
//       <TextInput
//         label="Phone"
//         value={editedResume.phone}
//         onChangeText={text => handleInputChange('phone', text)}
//       />
//       <TextInput
//         label="Summary"
//         value={editedResume.summary}
//         onChangeText={text => handleInputChange('summary', text)}
//         multiline
//       />
//       <TextInput
//         label="Skills"
//         value={editedResume.skills}
//         onChangeText={text => handleInputChange('skills', text)}
//         multiline
//       />
//       <Button onPress={pickImage}>Pick Profile Photo</Button>
//       {editedResume.profilePhoto && (
//         <Image source={{uri: editedResume.profilePhoto}} style={styles.image} />
//       )}
//       <Button mode="contained" onPress={saveChanges} style={styles.saveButton}>
//         Save Changes
//       </Button>
//     </ScrollView>
//   );
// };

// // Navigation Stack
// const Stack = createStackNavigator();

// const App: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="EditResume" component={EditResumeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   card: {
//     marginVertical: 10,
//     elevation: 3,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   details: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   addButton: {
//     marginTop: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     marginVertical: 10,
//   },
//   saveButton: {
//     marginTop: 10,
//   },
// });

// export default App;
import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Image, View, Text, Alert} from 'react-native';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Realm from 'realm';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  Card,
  Avatar,
  Title,
  TextInput,
  Paragraph,
  Button,
} from 'react-native-paper';

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
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}> = ({label, value, onChangeText, multiline}) => (
  <View style={styles.inputContainer}>
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      style={[styles.input, multiline && styles.multiline]}
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
      <Button onPress={() => onDelete(resume)}>Delete</Button>
      <Button onPress={() => onEdit(resume)}>Edit</Button>
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
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = () => {
    const allResumes = realm.objects('Resume');
    setResumes(Array.from(allResumes));
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
    navigation.navigate('EditResume', {resumeId: resume._id.toString()});
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
      <CustomTextInput label="Name" value={name} onChangeText={setName} />
      <CustomTextInput label="Email" value={email} onChangeText={setEmail} />
      <CustomTextInput label="Phone" value={phone} onChangeText={setPhone} />
      <CustomTextInput
        label="Summary"
        value={summary}
        onChangeText={setSummary}
        multiline
      />
      <CustomTextInput
        label="Skills"
        value={skills}
        onChangeText={setSkills}
        multiline
      />
      <Button onPress={pickImage}>Pick Profile Photo</Button>
      {profilePhoto ? (
        <Image source={{uri: profilePhoto}} style={styles.image} />
      ) : null}
      <View style={styles.templateContainer}>
        <Text>Select Template:</Text>
        {[1, 2, 3].map(templateId => (
          <Button
            key={templateId}
            onPress={() => setSelectedTemplate(templateId)}
            mode="contained"
            style={[
              styles.templateButton,
              selectedTemplate === templateId && styles.selectedTemplateButton,
            ]}>
            Template {templateId}
          </Button>
        ))}
      </View>
      <Button
        onPress={addResume}
        disabled={!selectedTemplate}
        mode="contained"
        style={styles.addButton}>
        Add Resume
      </Button>
      {resumes.map(resume => (
        <Template
          key={resume._id.toString()}
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
        label="Name"
        value={editedResume.name}
        onChangeText={text => handleInputChange('name', text)}
      />
      <CustomTextInput
        label="Email"
        value={editedResume.email}
        onChangeText={text => handleInputChange('email', text)}
      />
      <CustomTextInput
        label="Phone"
        value={editedResume.phone}
        onChangeText={text => handleInputChange('phone', text)}
      />
      <CustomTextInput
        label="Summary"
        value={editedResume.summary}
        onChangeText={text => handleInputChange('summary', text)}
        multiline
      />
      <CustomTextInput
        label="Skills"
        value={editedResume.skills}
        onChangeText={text => handleInputChange('skills', text)}
        multiline
      />
      <Button onPress={pickImage}>Pick Profile Photo</Button>
      {editedResume.profilePhoto && (
        <Image source={{uri: editedResume.profilePhoto}} style={styles.image} />
      )}
      <Button mode="contained" onPress={saveChanges} style={styles.saveButton}>
        Save Changes
      </Button>
    </ScrollView>
  );
};

// Navigation
const Stack = createStackNavigator();

const App: React.FC = () => {
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
    marginTop: 20,
  },
  item: {
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#e0e0e0',
    height: 40,
    padding: 10,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 10,
  },
  templateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  templateButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectedTemplateButton: {
    backgroundColor: '#2196F3',
  },
});

export default App;
