import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  EditResume: {resume: any};
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type EditResumeScreenRouteProp = RouteProp<
  RootStackParamList,
  'EditResume'
>;

export type EditResumeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditResume'
>;
