// components/Template.tsx

import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Card, Button, Title, Paragraph} from 'react-native-paper';

interface TemplateProps {
  resume: any; // Adjust type as per your resume object structure
  onDelete: () => void;
  onEdit: () => void;
}

const Template: React.FC<TemplateProps> = ({resume, onDelete, onEdit}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Title>{resume.name}</Title>
          <Paragraph>{resume.email}</Paragraph>
          <Paragraph>{resume.phone}</Paragraph>
        </View>
        <View style={styles.section}>
          <Title>Summary</Title>
          <Paragraph>{resume.summary}</Paragraph>
        </View>
        <View style={styles.section}>
          <Title>Skills</Title>
          <Paragraph>{resume.skills}</Paragraph>
        </View>
        <View style={styles.section}>
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
        </View>
        <View style={styles.section}>
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
        </View>
        <View style={styles.section}>
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
        </View>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onDelete}>Delete</Button>
        <Button onPress={onEdit}>Edit</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    elevation: 3,
  },
  header: {
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 5,
  },
});

export default Template;
