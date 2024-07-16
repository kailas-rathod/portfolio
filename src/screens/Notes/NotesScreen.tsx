import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {List, TextInput, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {addNote, deleteNote} from '../../store/actions';
import {RootState} from '../store/reducers';
// import {addNote, deleteNote} from '../store/actions';

const NotesScreen: React.FC = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.notes);
  const [noteText, setNoteText] = useState<string>('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      dispatch(addNote(noteText));
      setNoteText('');
    }
  };

  const handleDeleteNote = (id: number) => {
    dispatch(deleteNote(id));
  };

  const renderItem = ({item}: {item: {id: number; text: string}}) => (
    <List.Item
      title={item.text}
      onPress={() => handleDeleteNote(item.id)}
      left={() => <List.Icon icon="note" />}
    />
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        label="Add a new note"
        value={noteText}
        onChangeText={setNoteText}
        style={{margin: 10}}
      />
      <Button mode="contained" onPress={handleAddNote} style={{margin: 10}}>
        Add Note
      </Button>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default NotesScreen;
