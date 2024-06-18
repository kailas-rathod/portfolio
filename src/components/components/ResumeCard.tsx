import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, Avatar, Card, Title, Paragraph} from 'react-native-paper';

interface ResumeCardProps {
  resume: any;
  onDelete: () => void;
  onEdit: () => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({resume, onDelete, onEdit}) => {
  return (
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
        {/* Render Education and Certifications similarly */}
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

export default ResumeCard;
