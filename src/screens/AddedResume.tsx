import React, {useState} from 'react';
import {
  ScrollView,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Text, Avatar, Card, Title, Paragraph} from 'react-native-paper';
import Realm from 'realm';
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';

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

// Define AddedResume component
const AddedResume = () => {
  // State variables using useState hook
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumes, setResumes] = useState(realm.objects('Resume'));

  // Function to add a new resume
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

    // Clear input fields after adding resume
    setName('');
    setEmail('');
    setPhone('');
    setProfilePhoto('');
    setSummary('');
    setSkills('');
    setSelectedTemplate(null);
    setResumes(realm.objects('Resume')); // Update resumes list
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

  // Template 1 component
  const Template1 = ({resume}) => (
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
    </Card>
  );

  // Template 2 component
  const Template2 = ({resume}) => (
    <Card style={styles.card}>
      <Card.Title title="Template 2" />
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
              <Text>{item.company}</Text>
              <Text>{item.role}</Text>
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
              <Text>{item.institution}</Text>
              <Text>{item.degree}</Text>
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
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.templateSelection}>
        <Button
          style={styles.templateButton}
          mode="contained"
          onPress={() => setSelectedTemplate(1)}
          disabled={selectedTemplate === 1}>
          Template 1
        </Button>
        <Button
          style={styles.templateButton}
          mode="contained"
          onPress={() => setSelectedTemplate(2)}
          disabled={selectedTemplate === 2}>
          Template 2
        </Button>
      </View>
      <Button mode="contained" onPress={addResume} disabled={!selectedTemplate}>
        Add Resume
      </Button>

      {/* Display resumes */}
      {resumes.map(resume => {
        switch (resume.templateId) {
          case 1:
            return <Template1 key={resume._id} resume={resume} />;
          case 2:
            return <Template2 key={resume._id} resume={resume} />;
          default:
            return null;
        }
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  templateSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  templateButton: {
    flex: 1,
    marginHorizontal: 5,
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
  item: {
    marginBottom: 5,
  },
});

export default AddedResume;
