'use strict';

var React = require('react-native');
var RegisterVeiw = require("../RegisterPage/RegisterMainPage");
var MyThingsList = require("../RegisterPage/MyThingsList");
var AppLogin = require('react-native').NativeModules.AppLogin;
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ScrollView,
  Image
} = React;
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    flexDirection:"column",
    justifyContent:"center"
  },
  button:{
    height:32,
    width:100,
    flexDirection:"column",
    borderBottomWidth:1,
    alignItems:"center"
  },
  buttontext:{
    fontSize:20
  }
});
var SettingPage = React.createClass({
  getInitialState:function()
  {
    return {
      userid:"",
    }
  },
  componentDidMount:function(){
    this._getUserId();
  },
  _junpToRegisterVeiw:function()
  {
    this.props.navigator.push({component:RegisterVeiw})
  },
  _junpToMyThingsList:function(){
    this.props.navigator.push({component:MyThingsList,params:{nextSence:RegisterVeiw,ownerId:this.state.userid}});
  },
  _getUserId:function(){
    let _this = this;
    AppLogin.getUserIdFromNative(function(data){
        _this.setState({
          userid:data,
        })
    })
  },
  render:function()
  {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          onPress={this._junpToRegisterVeiw}
        >
          <Text style={styles.buttontext}>Register</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this._junpToMyThingsList}
        >
          <Text style={styles.buttontext}>My Things</Text>
        </TouchableHighlight>
      </View>
    )
  }
});

module.exports = SettingPage;
