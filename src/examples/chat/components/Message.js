import React from 'react';
import { View, Text } from 'react-native';

function Message({ message }) {
  const { text } = message;

  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
}

export default Message;
