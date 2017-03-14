import React, { Component } from 'react';
import { ListView, ActivityIndicator, RefreshControl, Text } from 'react-native';
import firebase from '~/firebase';
import Post from './components/Post';

const REF = 'examples/infiniteScroll';

/**
 * Infinite scrolling ListView implemented using Firebase
 * All styles are inline, you should break them out however you prefer.
 */

class infiniteScroll extends Component {
  /**
   * Build the dataSource using the method from ListView
   * Open the subscription to the posts ref in firebase
   * Init state
   */
  constructor() {
    super();
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
    });
    this.postsRef = firebase.database()
      .ref(`${REF}/posts`);
    this.posts = null;
    this.state = {
      refreshing: false,
      dataSource: this.dataSource.cloneWithRows({}),
    };
  }
  
  /**
   * Get the first 5 posts from firebase
   */
  componentDidMount() {
    this.postsRef.orderByKey().limitToFirst(5).once('value', this.renderPosts.bind(this));
  }
  
  /**
   * Safeguard against overlapping subscriptions, we don't need it in this example.
   * It is however best practise.
   */
  componentWillUnmount() {
    this.postsRef.off('value', this.renderPosts);
  }
  
  /**
   * When pull to refresh happens, refresh the currently loaded posts.
   */
  onRefresh() {
    this.setState({ refreshing: true });
    // this.addNewPost();
    this.postsRef.orderByKey().limitToFirst(this.state.dataSource.rowIdentities[0].length).once('value', this.renderPosts.bind(this));
  }
  /**
   * Get the next posts from Firebase, add them to the dataSource and render them using that logic.
   */
  getNextPosts() {
    const lastItemRenderedInList = this.state.dataSource.rowIdentities[0][this.state.dataSource.rowIdentities[0].length - 1];
    this.postsRef.startAt(lastItemRenderedInList).orderByKey().limitToFirst(5).once('value', this.renderPosts.bind(this));
  }
  
  /**
   * Do something when a post is clicked on
   * i.e. go to a new route
   */
  handlePostPress() {
    // Add any item pressed here
  }
  
  /**
   * Helper for the example, to enable goto onRefresh and uncomment the call to this function.
   */
  addNewPost() {
    const r = firebase.database().ref('examples/infiniteScroll/posts').push()
    r.set({
      _key: r.key,
      body: 'This is a short desciption of what the post is going to contain, the full post can be read after you click read more. The actual post should still contain the excerpt so we don\'t disrupt the user journey.',
      excerpt: 'This is a short desciption of what the post is going to contain, the full post can be read after you click read more.',
      imgUrl: 'https://unsplash.it/400/300',
      title: 'hello',
      user: `Pearly Gates`,
      avatar: 'https://pbs.twimg.com/profile_images/558109954561679360/j1f9DiJi.jpeg',
    });
  }
  
  /**
   * Renders the Activity Indicator that is displayed under the last card.
   * @returns {XML}
   */
  renderFooter() {
    return <ActivityIndicator style={{ marginVertical: 20 }}/>;
  }
  
  /**
   * Pass a snapshot of the data returned from our firebase calls, loop
   * over the keys and add them to add them to dataSource
   * @param snapshot
   */
  renderPosts(snapshot) {
    for (let i = 0; i < snapshot.childKeys.length; i++) {
      const key = snapshot.childKeys[i];
      this.posts = {
        ...this.posts || {},
        [key]: snapshot.value[key],
      };
    }
    this.setState({
      refreshing: false,
      dataSource: this.dataSource.cloneWithRows(this.posts),
    });
  }
  
  render() {
    if (this.posts) {
      return (
        <ListView
          style={{ flex: 1, backgroundColor: '#dadada' }}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={(data) => <Post data={data} tapAction={this.handlePostPress} />}
          renderFooter={this.renderFooter.bind(this)}
          onEndReached={this.getNextPosts.bind(this)}
          onEndReachedThreshold={20}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        />
      );
    } else {
      return (
        // Necessary as onEndReached is called before we have the data, bug with React Native
        <Text>~</Text>
      );
    }
  }
}

export default infiniteScroll;
