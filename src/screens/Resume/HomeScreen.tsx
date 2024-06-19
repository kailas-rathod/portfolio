// screens/HomeScreen.tsx

import React, {useState, useEffect} from 'react';
import {ScrollView, Image, View, Alert, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import Realm from 'realm';
import CustomTextInput from '../../components/components/CustomTextInput';
import Template from '../../components/components/Template';

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

const HomeScreen: React.FC = () => {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
    summary: '',
    skills: '',
    selectedTemplate: null,
  });
  const [resumes, setResumes] = useState<Realm.Results<any>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = () => {
    const allResumes = realm.objects('Resume');
    setResumes(allResumes);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setResumeData({...resumeData, [field]: value});
  };

  const addResume = () => {
    realm.write(() => {
      realm.create('Resume', {
        _id: new Realm.BSON.ObjectId(),
        ...resumeData,
        experience: [],
        education: [],
        certifications: [],
        templateId: resumeData.selectedTemplate || 1,
      });
    });

    clearFields();
    fetchResumes();
  };

  const clearFields = () => {
    setResumeData({
      name: '',
      email: '',
      phone: '',
      profilePhoto: '',
      summary: '',
      skills: '',
      selectedTemplate: null,
    });
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
    // Navigate to edit screen
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
          value={resumeData[field]}
          onChangeText={value => handleInputChange(field, value)}
          multiline={field === 'summary' || field === 'skills'}
        />
      ))}
      <Button mode="outlined" onPress={pickImage}>
        Pick a Profile Photo
      </Button>
      {resumeData.profilePhoto ? (
        <Image
          source={{uri: resumeData.profilePhoto}}
          style={screenStyles.profilePhoto}
        />
      ) : null}
      <View style={screenStyles.templateSelection}>
        {[1, 2].map(templateId => (
          <Button
            key={templateId}
            style={screenStyles.templateButton}
            mode="contained"
            onPress={() =>
              setResumeData({...resumeData, selectedTemplate: templateId})
            }
            disabled={resumeData.selectedTemplate === templateId}>
            Template {templateId}
          </Button>
        ))}
      </View>
      <Button
        mode="contained"
        onPress={addResume}
        disabled={!resumeData.selectedTemplate}>
        Add Resume
      </Button>

      {!loading &&
        resumes?.map(resume => (
          <Template
            key={resume._id.toString()}
            resume={resume}
            deleteResume={deleteResume}
            editResume={editResume}
          />
        ))}
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
  templateSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  templateButton: {
    flex: 1,
    margin: 5,
  },
});

export default HomeScreen;
