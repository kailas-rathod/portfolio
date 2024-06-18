// ResumeManager.tsx

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Realm from 'realm';
import {RealmProvider, useRealm, useQuery} from '@realm/react';
import {
  Resume,
  ContactInformation,
  Experience,
  Education,
  config,
} from '../config/Config';

const ResumeManager: React.FC = () => {
  const realm = useRealm();
  const resumes = useQuery<Resume>(Resume);

  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [resumesData, setResumesData] = useState<Realm.Results<Resume> | null>(
    null,
  );

  useEffect(() => {
    setResumesData(realm.objects<Resume>('Resume'));
  }, [realm]);

  const addOrUpdateResume = (): void => {
    realm.write(() => {
      realm.create(
        'Resume',
        {
          _id: selectedResume ? selectedResume._id : new Realm.BSON.ObjectId(),
          format: selectedResume
            ? selectedResume.format
            : 'Classic Chronological', // Default format
          contactInformation: {
            name: 'Bentley Campbell',
            email: 'bcampbell@gmail.com',
            address: '12 Main Street, Washington DC 20229',
            phone: '(212) 555-1212',
            dateOfBirth: new Date('1985-06-23'),
            nationality: 'American',
            website: 'www.bcampbell.com',
          },
          objective:
            'Certified public accountant with 6+ years of experience...',
          skills: [
            'Business Strategies',
            'Budget Management',
            'Event Research and Reporting',
            'Team Building',
            'Time Management',
          ],
          languages: [
            'English (Native)',
            'Italian (Advanced)',
            'Spanish (Elementary)',
            'German (Elementary)',
          ],
          experience: [],
          education: [],
          profilePhoto: '', // Placeholder for profile photo URL or base64 encoded image
        },
        selectedResume ? Realm.UpdateMode.Modified : Realm.UpdateMode.Never,
      );
    });
  };

  const selectResume = (resume: Resume): void => {
    setSelectedResume(resume);
    // Additional logic for selecting a resume
  };

  const renderResumeFormat = (resume: Resume): JSX.Element => {
    switch (resume.format) {
      case 'Classic Chronological':
        return renderClassicChronologicalResume(resume);
      // Add cases for other formats as needed
      default:
        return <Text>Unsupported Resume Format</Text>;
    }
  };

  const renderClassicChronologicalResume = (resume: Resume): JSX.Element => {
    return (
      <ScrollView style={styles.container}>
        <Text>Contact Information</Text>
        <Text>Name: {resume.contactInformation.name}</Text>
        <Text>Email: {resume.contactInformation.email}</Text>
        <Text>Address: {resume.contactInformation.address}</Text>
        <Text>Phone: {resume.contactInformation.phone}</Text>
        {/* Render other contact information fields */}

        <Text>Objective</Text>
        <Text>{resume.objective}</Text>

        <Text>Skills</Text>
        <FlatList
          data={resume.skills}
          renderItem={({item}) => <Text>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text>Experience</Text>
        <FlatList
          data={resume.experience}
          renderItem={({item}) => (
            <View>
              <Text>{item.company}</Text>
              <Text>{item.role}</Text>
              <Text>{`${item.startDate.toDateString()} - ${item.endDate.toDateString()}`}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <Text>Education</Text>
        <FlatList
          data={resume.education}
          renderItem={({item}) => (
            <View>
              <Text>{item.institution}</Text>
              <Text>{item.degree}</Text>
              <Text>{item.location}</Text>
              <Text>{item.graduationDate.toDateString()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Render other sections like languages, profile photo, etc. */}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* UI for managing resumes */}
      <Button title="Add or Update Resume" onPress={addOrUpdateResume} />

      {/* Render list of resumes */}
      <FlatList
        data={resumesData}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => selectResume(item)}>
            <Text>{item.format}</Text>
            {/* Add more UI elements for preview */}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Render selected resume format */}
      {selectedResume && renderResumeFormat(selectedResume)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default ResumeManager;
