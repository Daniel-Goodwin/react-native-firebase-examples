import React from 'react';
import { View, Text } from 'react-native';

function Message({ data }) {
  const { text } = data;

  return (
    <View style={{ height: 100, backgroundColor: 'red' }}>
      <Text>{text}</Text>
    </View>
  );
}

export default Message;
