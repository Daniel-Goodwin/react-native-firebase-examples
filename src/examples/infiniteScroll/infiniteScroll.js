import React from 'react';
import { View, Text, ListView, StyleSheet } from 'react-native';
import firebase from '~/firebase';
import Message from './components/Message';

const REF = 'examples/chat';

class Chat extends React.Component {

  constructor() {
    super();

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1._key !== r2._key,
    });

    // Set refs
    this.typingRef = firebase.database().ref(`${REF}/typing`);
    this.messagesRef = firebase.database()
      .ref(`${REF}/messages`)
      .orderByKey()
      .limitToLast(50);

    // Keep a raw copy of the messages
    this.messages = {};

    this.state = {
      loading: true,
      typing: 0,
      dataSource: this.dataSource.cloneWithRows({}),
    };
  }

  componentDidMount() {
    this.typingRef.on('value', this.onTypingChange);
    this.messagesRef.on('child_added', this.onNewMessage);

    // const r = firebase.database().ref('examples/chat/messages').push()
    //
    // r.set({
    //   _key: r.key,
    //   timestamp: Date.now(),
    //   text: 'Message 2!',
    // })
  }

  componentWillUnmount() {
    this.typingRef.off('value', this.onTypingChange);
    this.messagesRef.off('child_added', this.onNewMessage);
  }

  /**
   * Set the current users currently typing a new message
   * @param snapshot
   */
  onTypingChange = (snapshot) => {
    this.setState({
      typing: snapshot.val() || 0,
    });
  };

  /**
   * When a new message is received, create a new ListView
   * dataSource.
   * @param snapshot
   */
  onNewMessage = (snapshot) => {
    this.messages = {
      ...this.messages,
      [snapshot.key]: snapshot.val(),
    };

    console.log('messages', this.messages)
    this.setState({
      loading: false,
      dataSource: this.dataSource.cloneWithRows(this.messages),
    });
  };

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <ListView
        style={styles.container}
        enableEmptySections
        dataSource={this.state.dataSource}
        renderRow={data => <Message data={data} />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
});

export default Chat;
