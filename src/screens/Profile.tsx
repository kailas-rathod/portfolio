import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Resume} from './realmConfig'; // Import Resume schema

// Template 1 component
const Template1: React.FC<{resume: Resume}> = ({resume}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{resume.name}</Text>
      <Text>{resume.email}</Text>
      <Text>{resume.phone}</Text>
      {resume.profilePhoto && (
        <Image
          source={{uri: resume.profilePhoto}}
          style={styles.profilePhoto}
        />
      )}
      <Text>{resume.summary}</Text>
      <Text>{resume.skills}</Text>
      {/* Additional sections like experience, education, certifications */}
    </View>
  );
};

// Template 2 component
const Template2: React.FC<{resume: Resume}> = ({resume}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{resume.name}</Text>
      <Text>{resume.email}</Text>
      <Text>{resume.phone}</Text>
      {resume.profilePhoto && (
        <Image
          source={{uri: resume.profilePhoto}}
          style={styles.profilePhoto}
        />
      )}
      <Text>{resume.summary}</Text>
      <Text>{resume.skills}</Text>
      {/* Additional sections like experience, education, certifications */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
});

export {Template1, Template2};
