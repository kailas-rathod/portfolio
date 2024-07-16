// store/reducers.ts
import {combineReducers} from 'redux';
import {
  Todo,
  ActionTypes,
  ADD_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
  Note,
  ADD_NOTE,
  DELETE_NOTE,
  Alarm,
  SET_ALARM,
  DELETE_ALARM,
} from './actions';

//   ADD_TODO,
//   TOGGLE_TODO,
//   DELETE_TODO,
//   ADD_NOTE,
//   DELETE_NOTE,
//   SET_ALARM,
//   DELETE_ALARM,
//   ActionTypes,
//   Todo,
//   Note,
//   Alarm,
// } from './actions';

const todosReducer = (state: Todo[] = [], action: ActionTypes): Todo[] => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {id: Date.now(), text: action.payload, completed: false},
      ];
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id === action.payload
          ? {...todo, completed: !todo.completed}
          : todo,
      );
    case DELETE_TODO:
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

const notesReducer = (state: Note[] = [], action: ActionTypes): Note[] => {
  switch (action.type) {
    case ADD_NOTE:
      return [...state, {id: Date.now(), text: action.payload}];
    case DELETE_NOTE:
      return state.filter(note => note.id !== action.payload);
    default:
      return state;
  }
};

const alarmsReducer = (state: Alarm[] = [], action: ActionTypes): Alarm[] => {
  switch (action.type) {
    case SET_ALARM:
      return [...state, {id: Date.now(), time: action.payload}];
    case DELETE_ALARM:
      return state.filter(alarm => alarm.id !== action.payload);
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  todos: todosReducer,
  notes: notesReducer,
  alarms: alarmsReducer,
});

export default rootReducer;
