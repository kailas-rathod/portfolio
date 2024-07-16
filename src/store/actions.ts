// store/actions.ts
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const ADD_NOTE = 'ADD_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SET_ALARM = 'SET_ALARM';
export const DELETE_ALARM = 'DELETE_ALARM';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Note {
  id: number;
  text: string;
}

export interface Alarm {
  id: number;
  time: string; // or use Date if preferred
}

export interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: string;
}

export interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  payload: number;
}

export interface DeleteTodoAction {
  type: typeof DELETE_TODO;
  payload: number;
}

export interface AddNoteAction {
  type: typeof ADD_NOTE;
  payload: string;
}

export interface DeleteNoteAction {
  type: typeof DELETE_NOTE;
  payload: number;
}

export interface SetAlarmAction {
  type: typeof SET_ALARM;
  payload: string;
}

export interface DeleteAlarmAction {
  type: typeof DELETE_ALARM;
  payload: number;
}

export type ActionTypes =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | AddNoteAction
  | DeleteNoteAction
  | SetAlarmAction
  | DeleteAlarmAction;

export const addTodo = (todo: string): AddTodoAction => ({
  type: ADD_TODO,
  payload: todo,
});

export const toggleTodo = (id: number): ToggleTodoAction => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const deleteTodo = (id: number): DeleteTodoAction => ({
  type: DELETE_TODO,
  payload: id,
});

export const addNote = (note: string): AddNoteAction => ({
  type: ADD_NOTE,
  payload: note,
});

export const deleteNote = (id: number): DeleteNoteAction => ({
  type: DELETE_NOTE,
  payload: id,
});

export const setAlarm = (alarm: string): SetAlarmAction => ({
  type: SET_ALARM,
  payload: alarm,
});

export const deleteAlarm = (id: number): DeleteAlarmAction => ({
  type: DELETE_ALARM,
  payload: id,
});
