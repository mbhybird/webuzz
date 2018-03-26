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
var EventEmitterMixin = require('react-event-emitter-mixin');
var IconNumber = require('../IconNumber');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
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
})

var PeopleAround = React.createClass({
  mixins:[EventEmitterMixin],
  PropTypes:{
    thing:React.PropTypes.object,
    iconHeight:React.PropTypes.number,
    iconWidht:React.PropTypes.number,
    numberColor:React.PropTypes.string,
    iconColor:React.PropTypes.string,
  },
  getInitialState:function(){
    return{
      peopleAround:0
    }
  },
  _getpeopleAroundFromStorage:function(){
    let _this = this;
    let _storage = g_ConstInfo.WEBUZZ_STORAGE;
    _storage.load({
      key: 'heatChart',

      //autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的同步方法
      autoSync: true,

      //syncInBackground(默认为true)意味着如果数据过期，
      //在调用同步方法的同时先返回已经过期的数据。
      //设置为false的话，则始终强制返回同步方法提供的最新数据(当然会需要更多等待时间)。
      syncInBackground: true
    }).then( things => {
      if(!things){
        _this.setState({
          peopleAround:0
        })
        return;
      }
      if(things[_this.props.thing._id]){
        _this.setState({
          peopleAround:things[_this.props.thing._id]
        })
        return;
      }
      else {
        _this.setState({
          peopleAround:0
        })
        return;
      }

    }).catch( err => {
      console.warn(err);
    })
  },
  componentDidMount:function(){
    var _this = this;
    // this.eventEmitter('on','heatChart',(responseData,a)=>{
    //   console.log("kkk");
    // })
    this._getpeopleAroundFromStorage();
    this.eventEmitter('on','heatChart',(things,a)=>{
        // console.log("KKK");
        if(!things){
          _this.setState({
            peopleAround:0
          })
          return;
        }
        if(things[_this.props.thing._id]){
          _this.setState({
            peopleAround:things[_this.props.thing._id]
          })
          return;
        }
        else {
          _this.setState({
            peopleAround:0
          })
          return;
        }
    });
  },
  render:function(){

    let imageSource = require('image!icon-photobar-white-people');
    
    if(this.props.iconColor=="gray" || this.props.iconColor=="grey"){
      imageSource = require('image!icon-photobar-gray-people');
    } else if(this.props.iconColor=="yellow"  || this.props.iconColor=="orange"){
      imageSource = require('image!icon-photobar-yellow-people');
    }
    return(
      <IconNumber
          iconWidth={this.props.iconWidth}
          iconHeight={this.props.iconHeight}
          numberColor={this.props.numberColor}
          imageSource={imageSource}
          numberCount={this.state.peopleAround} />
    )
  }
})

module.exports = PeopleAround
