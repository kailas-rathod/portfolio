// components/CustomTextInput.tsx

import React from 'react';
import {TextInput, View, StyleSheet, TextInputProps} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  placeholder?: string;
  multiline?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  multiline,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholder={placeholder}
        multiline={multiline}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
});

export default CustomTextInput;
