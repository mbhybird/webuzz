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
var summaryInfoWidth = Dimensions.get("window").width/2;
var EventEmitterMixin = require('react-event-emitter-mixin');
var IconNumber = require('../IconNumber');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var storageHandler = require('../../common/StorageHandler');

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

var ThingsRelated = React.createClass({
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
      ducksCount:0,
      isSameOwner:false,
    }
  },
  componentDidMount:function(){
    this._getDucks();
    this.eventEmitter('on','ducks'+this.props.thing._id,this._getDucks);
    this.eventEmitter('on','HomeTabed',this._getDucks);
    this._setRelateState();
  },
  _getDucks:function(){
    let _this = this;
    storageHandler.refreshDucksHashFromURL(this.props.thing._id,function(data){
      if(data){
        _this.setState({
          ducksCount:data
        })
      }
    })

  },
  _setRelateState:function(){

    let _thing = this.props.thing;

    if(_thing.owner==undefined) return;
    
    let ownerId = _thing.owner._id ? _thing.owner._id : _thing.owner;
    if ( this.props.ownerId && this.props.ownerId==ownerId){
      this.setState({
        isSameOwner:true
      });
    }
  },
  _jumpToOwnerThingsList:function(){

    if(this.state.isSameOwner) return;

    let _thing = this.props.thing;

    if(_thing.owner==undefined){
      alert("This thing has no owner");
      return;
    }
    let ownerId = _thing.owner._id ? _thing.owner._id : _thing.owner;
    var OwnerThingsList = require("./OwnerThingsList");
    this.props.navigator.push({component:OwnerThingsList,name:"Thing's Relation",params:{ownerId:ownerId,thingItem:this.props.thing}});
  },
  render:function(){

    let imageSource = require('image!icon-photobar-white-webuzz');

    if(this.props.iconColor=="gray" || this.props.iconColor=="grey"){
      imageSource = require('image!icon-photobar-gray-webuzz');
    } else if(this.props.iconColor=="yellow" || this.props.iconColor=="orange"){
      imageSource = require('image!icon-photobar-yellow-webuzz');
    }

    return(
      <TouchableOpacity
        onPress={this._jumpToOwnerThingsList}
      >
        <IconNumber
            iconWidth={13}
            numberColor={this.props.numberColor}
            iconHeight={13}
            imageSource={imageSource}
            numberCount={this.state.ducksCount} />
      </TouchableOpacity>
    )
  }
})

module.exports = ThingsRelated;
