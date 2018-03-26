'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  DeviceEventEmitter,
  Switch,
  TouchableHighlight
} = React;
var LoadingPage = React.createClass({
  render:function(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Loading....
        </Text>
      </View>
    );
  }

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
module.exports = LoadingPage;
