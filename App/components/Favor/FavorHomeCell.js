'use strict';
var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ListView,
  Image,
  AlertIOS
} = React;

var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width-10)/2
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var UnderLine = require('../UnderLine');
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
var ThingsRelated = require('../Users/ThingsRelated');

var FavorHomeCell = React.createClass({
  propTypes:{
    nextSence:React.PropTypes.func,
  },
  _toNextSence:function(){
    // this.props.navigator.push({component:RegisterVeiw,params:{thing:this.props.thing}});
  },
  _deleteFavor:function(){
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR()
    let _this = this;
    fetch(url,{
      method:'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "ownerId":this.props.ownerId,
          "thingsId":[_this.props.thing._id]
      })
    })
     .then(res=>res.json())
     .then(res=>{
       if(res.status && res.status=="success"){
         _this.props.refresh();
       }
     });

  },
  _alertBeforeDelete:function(){
    AlertIOS.alert(
        'Information',
        'Are your sure to delete?',
        [
          {text: 'Delete', onPress:this._deleteFavor},
          {text: 'Keep', onPress: () => {},style:{backgroundColor:"red"}},
        ]
      );
  },
  _navigateTODetail:function(){
    this.props.navigator.push({component:ThingsDetailPage,name:this.props.thing.name,params:{userId:this.props.ownerId,thingItem:this.props.thing}});
    // console.log(this.props.navigator.getCurrentRoutes());
  },
	render:function(){
    return(
			<View Style={{alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent:"flex-start",
        margin:5,
        flex:1
      }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex:1}}>
            <TouchableOpacity
              onPress={this._navigateTODetail}
              style={{width:imageWidth}}
            >
              <Image resizeMode={"cover"} style={{height:imageWidth/4*3,width:imageWidth,margin:10}}
                source={{uri:'data:image/jpeg;base64,'+this.props.thing.photo}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:10,flex:0.6,flexDirection:"column",justifyContent:"flex-start",height:imageWidth/4*3}}>
            <Text style={{fontSize:15,fontWeight:"bold",margin:10}}>{this.props.thing.name}</Text>
            <View style={{margin:5}}>
              <PeopleAround thing={this.props.thing}/>
            </View>
            <View style={{marginLeft:5}}>
              {/*<IconNumber imageSource={require('image!rubber')} numberCount={"100"} />*/}
              <ThingsRelated thing={this.props.thing}/>
            </View>
          </View>
          <View style={{flex:0.3,height:imageWidth/4*3+15,flexDirection:"column",justifyContent:"flex-end"}}>
            <TouchableOpacity style={{width:30,flex:1,justifyContent:"flex-end",flexDirection:"column"}}
              onPress={this._alertBeforeDelete}
            >
              <Image style={{height:30,width:30,marginRight:10}} source={require('image!x-mark')}/>
            </TouchableOpacity>
          </View>
        </View>
        <UnderLine/>
      </View>
		)
	}
});


module.exports= FavorHomeCell;
