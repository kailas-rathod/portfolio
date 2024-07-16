import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {List, TextInput, Button, Checkbox} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {addTodo, toggleTodo, deleteTodo} from '../../store/actions';

const TodoListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const [text, setText] = useState<string>('');

  const handleAddTodo = () => {
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const handleToggleTodo = (id: number) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };

  const renderItem = ({
    item,
  }: {
    item: {id: number; text: string; completed: boolean};
  }) => (
    <List.Item
      title={item.text}
      onPress={() => handleToggleTodo(item.id)}
      right={() => (
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => handleToggleTodo(item.id)}
        />
      )}
      left={() => <List.Icon icon={item.completed ? 'check' : 'cancel'} />}
      onLongPress={() => handleDeleteTodo(item.id)}
    />
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        label="Add a new todo"
        value={text}
        onChangeText={setText}
        style={{margin: 10}}
      />
      <Button mode="contained" onPress={handleAddTodo} style={{margin: 10}}>
        Add Todo
      </Button>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default TodoListScreen;
