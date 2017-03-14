import React from 'react';
import { View, Text } from 'react-native';

function Item({ data }) {
  const { body, title } = data;

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>{title}</Text>
      <Text>{body}</Text>
    </View>
  );
}

export default Item;
