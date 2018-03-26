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
var summaryInfoWidth = Dimensions.get("window").width/2
var PeopleAround = require('./PeopleAround');
var IconNumber = require('../IconNumber');

var storageHandler = require('../../common/StorageHandler');
var EventEmitterMixin = require('react-event-emitter-mixin');
var ThingsRelated = require('./ThingsRelated');
const styles=StyleSheet.create({
  container:{
    flex:1,
    flexDirection:"row",
    // height:50,
    marginLeft:10,
    marginRight:10,
    justifyContent:"flex-start",
    alignItems:"center"
  },
  headerImage:{
    width:50,
    height:50,
    borderRadius:25,
    margin:5
  },
  summaryInfo:{
    justifyContent:"space-around",
    flexDirection:"row",
    alignItems:"center",
    width:summaryInfoWidth
  }
})

// var IconNumber = React.createClass({
//   PropTypes:{
//     imageSource:React.PropTypes.object,
//     numberCount:React.PropTypes.number,
//   },
//   render:function(){
//     return(
//       <View style={{flexDirection:"row",alignItems:"flex-end",alignItems:"center"}}>
//         <Image style={{height:30,width:30}} source={this.props.imageSource}/>
//         <Text style={{marginLeft:10,fontWeight:"bold"}}>{this.props.numberCount}</Text>
//       </View>
//     );
//   }
// });

var UserSummaryBar = React.createClass({
  mixins:[EventEmitterMixin],
  propTypes:{
    thing:React.PropTypes.object
  },
  getInitialState:function(){
    return{
      headerUri:{},
      ducksCount:0
    }
  },
  componentWillMount:function(){
    // this._getPhotoHeaderImg();
  },
  componentDidMount:function(){

  },

  _getPhotoHeaderImg:function(){

    let _thing = this.props.thing;

    var result = require('image!Webuzz');

    if(_thing){
      let owner = _thing.owner;
      if(owner)
      {
        if (owner.photo) {
          result = {uri:"data:image/jpeg;base64,"+owner.photo};
        }
        else if (owner.wechat && owner.wechat.headimgurl) {
          result = {uri:owner.wechat.headimgurl};
        }
        else if (_thing.facebook && owner.facebook.headimgurl) {
          result = {uri:owner.facebook.headimgurl};
        }
      }
    }
    return result;
  },

  render:function(){
    return(
      <View style={styles.container}>
        <Image style={styles.headerImage} source={this._getPhotoHeaderImg()}/>
        <View style={styles.summaryInfo}>
          {/*<IconNumber imageSource={require('image!follow')} numberCount={"100"} />*/}
          <PeopleAround navigator={this.props.navigator} iconWidth={30} iconHeight={30} thing={this.props.thing}/>
          <ThingsRelated navigator={this.props.navigator} iconWidth={30} iconHeight={30} thing={this.props.thing} />
        </View>
      </View>
    )
  }
});

module.exports = UserSummaryBar
