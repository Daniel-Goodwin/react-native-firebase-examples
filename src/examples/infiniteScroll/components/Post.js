import React from 'react';
import { View, Text, Image } from 'react-native';

/**
 * 'Dumb' Stateless component to render a Card/ Post, styles are inline for usability.
 * You should break them out in anyway you prefer.
 * @param data
 * @param tapAction
 * @returns {XML}
 * @constructor
 */
function Post({ data, tapAction }) {
  const { title, excerpt, imgUrl, _key, user, avatar } = data;
  return (
    <View
      onPress={() => tapAction(_key)}
      style={{ height: 400, flex: 1, elevation: 4, backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16 }}
    >
      <View style={{ padding: 16, flexDirection: 'row' }}>
        <Image style={{ flex: 2, maxWidth: 60, borderRadius: 50, height: 60 }} source={{ uri: avatar }} />
        <View style={{ flex: 9, marginLeft: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{user}</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{_key}</Text>
        </View>
      </View>
      <Image style={{ flex: 1, maxHeight: 400, }} source={{ uri: imgUrl }} />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
        <Text>{excerpt}</Text>
      </View>
    </View>
  );
}

export default Post;
