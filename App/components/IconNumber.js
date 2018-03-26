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
// var summaryInfoWidth = Dimensions.get("window").width/2
// var EventEmitterMixin = require('react-event-emitter-mixin');
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

var IconNumber = React.createClass({
  PropTypes:{
    imageSource:React.PropTypes.object,
    numberCount:React.PropTypes.number,
    iconHeight:React.PropTypes.number,
    iconWidth:React.PropTypes.number,
    numberColor:React.PropTypes.string,
  },
  _iconHeight:function(){
    return this.props.iconHeight ? this.props.iconHeight : 20
  },
  _iconWidth:function(){
    return this.props.iconWidth ? this.props.iconWidth : 20
  },
  render:function(){
    return(
      <View style={{flexDirection:"row",alignItems:"flex-end",alignItems:"center"}}>
        <Image style={{height:this._iconHeight(),width:this._iconWidth()}} source={this.props.imageSource}/>
        <Text style={{marginLeft:5,color:this.props.numberColor}}>{this.props.numberCount}</Text>
      </View>
    );
  }
});


module.exports = IconNumber
