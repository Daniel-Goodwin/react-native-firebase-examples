import React from 'react';
import { ListView } from 'react-native';
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
    // this.typing = firebase.ref(`${REF}/online`);
    // this.messages = firebase
    //   .ref(`${REF}/online`)
    //   .orderByKey()
    //   .limitToLast(50);

    this.state = {
      loading: true,
      typing: 0,
      messages: this.dataSource.cloneWithRows([]),
    };
  }

  componentDidMount() {
    // this.typing.on('value', this.onTypingChange);
    // this.typing.on('child_added', this.onNewMessage);
    // firebase.database().ref('examples/chat').set({
    //   online: 0,
    //   typing: 0,
    //   messages: ['foobar'],
    // });
  }

  componentWillUnmount() {
    // this.typing.off('value', this.onTypingChange);
    // this.messages.off('child_added', this.onNewMessage);
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
    this.setState({
      loading: false,
      messages: this.dataSource.cloneWithRows([
        ...this.state.messages,
        ...snapshot.val() || {},
      ]),
    });
  };

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.state.messages}
        renderRow={message => <Message message={message} />}
      />
    );
  }
}

export default Chat;
