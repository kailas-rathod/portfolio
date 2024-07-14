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
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DatePicker from 'react-native-date-picker';

// Define Realm schema
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

// Home screen component
const HomeScreen = ({navigation}) => {
  const [resumes, setResumes] = useState([]);

  // Fetch resumes from Realm
  const fetchResumes = () => {
    const allResumes = realm.objects('Resume');
    setResumes(allResumes);
  };

  // Fetch resumes on component mount
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchResumes();
    });

    return unsubscribe;
  }, [navigation]);

  // Delete resume function
  const deleteResume = _id => {
    const resumeToDelete = realm.objectForPrimaryKey('Resume', _id);
    if (resumeToDelete) {
      realm.write(() => {
        realm.delete(resumeToDelete);
      });
      fetchResumes(); // Refresh list after deletion
    }
  };

  // Resume card component
  const ResumeCard = ({resume}) => {
    const Template1 = () => (
      <Card style={styles.card}>
        <Card.Title title="Template 1" />
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
          <Title>Experience</Title>
          <FlatList
            data={resume.experience}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Text>{item.role}</Text>
                <Text>{item.company}</Text>
                <Text>{`${item.startDate.toDateString()} - ${item.endDate.toDateString()}`}</Text>
              </View>
            )}
          />
          <Title>Education</Title>
          <FlatList
            data={resume.education}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Text>{item.degree}</Text>
                <Text>{item.institution}</Text>
                <Text>{item.graduationDate.toDateString()}</Text>
              </View>
            )}
          />
          <Title>Certifications</Title>
          <FlatList
            data={resume.certifications}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) => (
              <View style={styles.item}>
                <Text>{item.name}</Text>
                <Text>{item.institution}</Text>
                <Text>{item.date.toDateString()}</Text>
              </View>
            )}
          />
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => deleteResume(resume._id)}>Delete</Button>
          <Button onPress={() => navigation.navigate('EditResume', {resume})}>
            Edit
          </Button>
        </Card.Actions>
      </Card>
    );

    return <Template1 />;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Display each resume */}
      {resumes.map(resume => (
        <ResumeCard key={resume._id} resume={resume} />
      ))}

      {/* Add Resume button */}
      <Button
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate('AddResume')}
        style={styles.addButton}>
        Add Resume
      </Button>
    </ScrollView>
  );
};

// Edit resume screen component
const EditResumeScreen = ({route, navigation}) => {
  const {resume} = route.params;

  const [editedResume, setEditedResume] = useState({
    name: resume.name,
    email: resume.email,
    phone: resume.phone,
    profilePhoto: resume.profilePhoto,
    summary: resume.summary,
    skills: resume.skills,
    experience: resume.experience,
    education: resume.education,
    certifications: resume.certifications,
    templateId: resume.templateId,
  });

  // Update resume function
  const updateResume = () => {
    realm.write(() => {
      resume.name = editedResume.name;
      resume.email = editedResume.email;
      resume.phone = editedResume.phone;
      resume.profilePhoto = editedResume.profilePhoto;
      resume.summary = editedResume.summary;
      resume.skills = editedResume.skills;
      resume.experience = editedResume.experience;
      resume.education = editedResume.education;
      resume.certifications = editedResume.certifications;
    });

    navigation.goBack();
  };

  // Pick image function
  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    if (!result.didCancel && result.assets && result.assets[0].uri) {
      setEditedResume({
        ...editedResume,
        profilePhoto: result.assets[0].uri,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editedResume.name}
        onChangeText={text => setEditedResume({...editedResume, name: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={editedResume.email}
        onChangeText={text => setEditedResume({...editedResume, email: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={editedResume.phone}
        onChangeText={text => setEditedResume({...editedResume, phone: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Summary"
        value={editedResume.summary}
        onChangeText={text => setEditedResume({...editedResume, summary: text})}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Skills"
        value={editedResume.skills}
        onChangeText={text => setEditedResume({...editedResume, skills: text})}
        multiline
      />
      <Button mode="outlined" onPress={pickImage}>
        Pick a Profile Photo
      </Button>
      {editedResume.profilePhoto && (
        <Image
          source={{uri: editedResume.profilePhoto}}
          style={styles.profilePhoto}
        />
      )}
      <Button mode="contained" onPress={updateResume}>
        Save Changes
      </Button>
    </ScrollView>
  );
};

// Add resume screen component
const AddResumeScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Save resume function
  const saveResume = () => {
    realm.write(() => {
      realm.create('Resume', {
        _id: new Realm.BSON.ObjectId(),
        name,
        email,
        phone,
        profilePhoto,
        summary,
        skills,
        experience,
        education,
        certifications,
        templateId: selectedTemplate,
      });
    });

    Alert.alert('Success', 'Resume saved successfully');
    navigation.goBack();
  };

  // Pick image function
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
      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={text => setPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Summary"
        value={summary}
        onChangeText={text => setSummary(text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Skills"
        value={skills}
        onChangeText={text => setSkills(text)}
        multiline
      />
      <Button mode="outlined" onPress={pickImage}>
        Pick a Profile Photo
      </Button>
      {profilePhoto && (
        <Image source={{uri: profilePhoto}} style={styles.profilePhoto} />
      )}

      {/* Select template */}

      {/* Experience section */}
      <Text style={styles.sectionLabel}>Experience</Text>
      <Button
        icon="plus"
        mode="outlined"
        onPress={() => navigation.navigate('AddExperience', {setExperience})}>
        Add Experience
      </Button>
      <FlatList
        data={experience}
        keyExtractor={(item, index) => `${item.company}-${index}`}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.role}</Title>
              <Paragraph>{item.company}</Paragraph>
              <Paragraph>{`${item.startDate.toDateString()} - ${item.endDate.toDateString()}`}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      {/* Education section */}
      <Text style={styles.sectionLabel}>Education</Text>
      <Button
        icon="plus"
        mode="outlined"
        onPress={() => navigation.navigate('AddEducation', {setEducation})}>
        Add Education
      </Button>
      <FlatList
        data={education}
        keyExtractor={(item, index) => `${item.institution}-${index}`}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.degree}</Title>
              <Paragraph>{item.institution}</Paragraph>
              <Paragraph>{item.graduationDate.toDateString()}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />

      {/* Certifications section */}
      <Text style={styles.sectionLabel}>Certifications</Text>
      <Button
        icon="plus"
        mode="outlined"
        onPress={() =>
          navigation.navigate('AddCertification', {setCertifications})
        }>
        Add Certification
      </Button>
      <FlatList
        data={certifications}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({item}) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>{item.institution}</Paragraph>
              <Paragraph>{item.date.toDateString()}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      <Text style={styles.templateLabel}>Select Template:</Text>
      <View style={styles.templateButtons}>
        <Button
          mode={selectedTemplate === 1 ? 'contained' : 'outlined'}
          onPress={() => setSelectedTemplate(1)}>
          Template 1
        </Button>
        <Button
          mode={selectedTemplate === 2 ? 'contained' : 'outlined'}
          onPress={() => setSelectedTemplate(2)}>
          Template 2
        </Button>
        <Button
          mode={selectedTemplate === 3 ? 'contained' : 'outlined'}
          onPress={() => setSelectedTemplate(3)}>
          Template 3
        </Button>
      </View>

      {/* Save button */}
      <Button mode="contained" onPress={saveResume}>
        Save Resume
      </Button>
    </ScrollView>
  );
};

// Add experience screen component
const AddExperienceScreen = ({route, navigation}) => {
  const {setExperience} = route.params;
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Save experience function
  const saveExperience = () => {
    setExperience(prevExperience => [
      ...prevExperience,
      {
        _id: new Realm.BSON.ObjectId(),
        company,
        role,
        startDate,
        endDate,
      },
    ]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Company"
        value={company}
        onChangeText={text => setCompany(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={role}
        onChangeText={text => setRole(text)}
      />
      <Text style={styles.label}>Start Date:</Text>
      <DatePicker date={startDate} onDateChange={setStartDate} mode="date" />
      <Text style={styles.label}>End Date:</Text>
      <DatePicker date={endDate} onDateChange={setEndDate} mode="date" />
      <Button mode="contained" onPress={saveExperience}>
        Save Experience
      </Button>
    </ScrollView>
  );
};

// Add education screen component
const AddEducationScreen = ({route, navigation}) => {
  const {setEducation} = route.params;
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [location, setLocation] = useState('');
  const [graduationDate, setGraduationDate] = useState(new Date());

  // Save education function
  const saveEducation = () => {
    setEducation(prevEducation => [
      ...prevEducation,
      {
        _id: new Realm.BSON.ObjectId(),
        institution,
        degree,
        location,
        graduationDate,
      },
    ]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Institution"
        value={institution}
        onChangeText={text => setInstitution(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Degree"
        value={degree}
        onChangeText={text => setDegree(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => setLocation(text)}
      />
      <Text style={styles.label}>Graduation Date:</Text>
      <DatePicker
        date={graduationDate}
        onDateChange={setGraduationDate}
        mode="date"
      />
      <Button mode="contained" onPress={saveEducation}>
        Save Education
      </Button>
    </ScrollView>
  );
};

// Add certification screen component
const AddCertificationScreen = ({route, navigation}) => {
  const {setCertifications} = route.params;
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [date, setDate] = useState(new Date());

  // Save certification function
  const saveCertification = () => {
    setCertifications(prevCertifications => [
      ...prevCertifications,
      {
        _id: new Realm.BSON.ObjectId(),
        name,
        institution,
        date,
      },
    ]);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Institution"
        value={institution}
        onChangeText={text => setInstitution(text)}
      />
      <Text style={styles.label}>Date:</Text>
      <DatePicker date={date} onDateChange={setDate} mode="date" />
      <Button mode="contained" onPress={saveCertification}>
        Save Certification
      </Button>
    </ScrollView>
  );
};

// Main stack navigator
const Stack = createStackNavigator();

const HomePage = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddResume" component={AddResumeScreen} />
        <Stack.Screen name="EditResume" component={EditResumeScreen} />
        <Stack.Screen name="AddExperience" component={AddExperienceScreen} />
        <Stack.Screen name="AddEducation" component={AddEducationScreen} />
        <Stack.Screen
          name="AddCertification"
          component={AddCertificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  addButton: {
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    marginLeft: 10,
  },
  item: {
    marginBottom: 5,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  templateLabel: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  templateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
});

export default HomePage;
