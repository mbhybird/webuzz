'use strict';
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} = React;
var Dimensions = require('Dimensions');
var Icon = require('react-native-vector-icons/FontAwesome');
var UnderLine = require('../UnderLine');
var FlexDescription = require('../FlexDescription');
var UserSummaryBar = require('../Users/UserSummaryBar');
var FriendsHorizontalBar = require('../Users/FriendsHorizontalBar');
var ThingDetailToolBar = require('../ToolsBar');
var ThingToolBar = require('../ThingToolBar.js');
var AppLogin = require('react-native').NativeModules.AppLogin;
var Navigation = require('../Comment/Navigation');
var ThingLocation = require('../Location/ThingLocation');
// var TestUrl = "http://arts.things.buzz:2397/api/things/56e6bde28290a0ac11000005";
var TestPhoto;

var storageHandler = require('../../common/StorageHandler');

var marginWidth = 5;

var windowWidth = Dimensions.get('window').width;
const MainPhotoHeight = windowWidth/72*47-marginWidth*2
var styles=StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"column",
    // alignItems:"center",
    // justifyContent:"center"
  },
  photo:{
    height:MainPhotoHeight-marginWidth*2,
    // flex:1,
    width:Dimensions.get('window').width-marginWidth*2,

    margin:marginWidth,

  },
  navBar1: {
    backgroundColor: 'white',
    height:60
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  toolBar:{
    height:45,
    width:Dimensions.get("window").width,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
  },
  toolBarIcon:{
    margin:5,
  },
  toolBarIconPng:{
    height:30,
    width:30,
    margin:5,
  },
});

var thingsProfileDTO={
  user:{},
  thing:{},
  userPhoto:{}
};

var ThingDetail = React.createClass({
  getInitialState:function(){
    return{
      Refresh:false,
      mainScrollEnabled:false
    }
  },
  _setDescriptionHeight:function(){
    let windowHeight = Dimensions.get('window').height;
    // alert(windowHeight);
    if(windowHeight==667) {
        return 150;
    }
    else if (windowHeight==736) {
      return 195;
    }
    else {
      return 0;
    }
  },
  _getPhotoFromUrl:function(){
    fetch(TestUrl)
      .then((response)=>response.json())
      .catch((error)=>{
        alert(error);
      })
      .then((responseData)=>{
        if(responseData && responseData.photo)
        {
          TestPhoto = responseData.photo;
          this.setState({
            Refresh:!this.state.Refresh
          });
        }
      })
      .done();
  },
  _getPhotoFromProps:function(){
    let thing = this.props.thingItem;
    // alert(this.props.thingItem);
    if(thing && thing.photo)
    {

      TestPhoto=thing.photo;
      this.setState({
        Refresh:!this.state.Refresh
      });
    }
  },
  componentDidMount:function(){
    this._getPhotoFromProps();
    AppLogin.getUserInfoFromNative(function(data){
      thingsProfileDTO.user = data;
    });
    let _thing = this.props.thingItem;

    storageHandler.getThingFromStorage(_thing._id,function(data){
      _thing = data;
      console.log(data._id);
    })
  },
  _jumpToThingLocation:function(){

    let _thing = this.props.thingItem;

    if(!_thing.location){
      alert("This thing hasn't share location yet!");
      return
    }

    this.props.navigator.push({component:ThingLocation,name:_thing.name,params:{thing:_thing}});

  },
  render:function(){
    return(
      <ScrollView scrollEnabled={this.state.mainScrollEnabled} style={styles.container}>
        {/*<View style={[styles.navBar1,{backgroundColor:"black"}]}></View>*/}
        <Image resizeMode={'cover'} style={styles.photo} source={{uri:'data:image/jpeg;base64,'+this.props.thingItem.photo}}/>
        <View style={{marginLeft:marginWidth}}>
          <ThingToolBar selected={"information"} navigator={this.props.navigator} thing={this.props.thingItem}/>
        </View>

        <View style={{height:40,flexDirection:"row",marginLeft:10,alignItems:"center"}}>
          <Text style={{fontSize:15,fontWeight:"normal",marginLeft:10,marginTop:10,marginBottom:5}}>{this.props.thingItem.name}</Text>
        </View>
        <UnderLine/>

        <View style={{height:40,flexDirection:"row",marginLeft:10,alignItems:"center"}}>
          <Image style={{width:10,height:13,marginLeft:10}} source={require('image!img-things-location')}/>
          <Text style={{fontSize:12,color:"#A7A9AC",fontWeight:"normal",marginLeft:5}}>{this.props.thingItem.name}</Text>
        </View>

        <UnderLine/>


        <FlexDescription
          descriptionHeight = {this._setDescriptionHeight()}
          onMoreButtonClick={(showmore)=>{
            this.setState({
              mainScrollEnabled:showmore
            });
          }}
          description={this.props.thingItem.description}/>


        {/*<UnderLine/>
        <UserSummaryBar navigator={this.props.navigator} thing={this.props.thingItem}/>
        <FriendsHorizontalBar/>*/}


        {this.state.mainScrollEnabled?<View style={{height:48}}/>:null}
      </ScrollView>
    );
  }
});

module.exports = ThingDetail;
