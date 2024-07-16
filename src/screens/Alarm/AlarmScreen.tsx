import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {List, TextInput, Button} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {setAlarm} from '../../store/actions';
// import {setAlarm, deleteAlarm} from '../store/actions';

const AlarmScreen: React.FC = () => {
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarms);
  const [time, setTime] = useState<string>('');

  const handleSetAlarm = () => {
    if (time.trim()) {
      dispatch(setAlarm(time));
      setTime('');
    }
  };

  const handleDeleteAlarm = (id: number) => {
    dispatch(deleteAlarm(id));
  };

  const renderItem = ({item}: {item: {id: number; time: string}}) => (
    <List.Item
      title={item.time}
      onPress={() => handleDeleteAlarm(item.id)}
      right={() => <List.Icon icon="alarm" />}
    />
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        label="Set alarm time"
        value={time}
        onChangeText={setTime}
        style={{margin: 10}}
      />
      <Button mode="contained" onPress={handleSetAlarm} style={{margin: 10}}>
        Set Alarm
      </Button>
      <FlatList
        data={alarms}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default AlarmScreen;
