'user strict'

import React, {
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  TouchableOpacity,
  NativeAppEventEmitter,
  WebView,
} from 'react-native';

var Icon = require('react-native-vector-icons/FontAwesome');
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var EventEmitterMixin = require('react-event-emitter-mixin');
var MapView = require('react-native-maps');
var AppLogin = require('react-native').NativeModules.AppLogin;
// var Navigation =  require('../Comment/Navigation');
var ThingToolBar = require('../ThingToolBar.js');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var MainPhotoHeight = Dimensions.get('window').height/3-10;
var ThingDetailToolBar = require('../ToolsBar');
var UnderLine = require('../UnderLine');
var AMapSearch = require('react-native').NativeModules.AMapSearchDelegate;

var thingsProfileDTO={
  user:{},
  thing:{},
  userPhoto:{}
};

var data;

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: MainPhotoHeight+5,
    left: 5,
    right: 5,
    bottom: 0,
    width:Dimensions.get('window').width-10
    // marginLeft:5,
    // marginRight:5,
  },
  photo:{
    height:MainPhotoHeight,
    // flex:1,
    width:Dimensions.get('window').width-10,
    margin:5,
    flexDirection:"column",
    justifyContent:"flex-end"
  },
  arrow: {
   backgroundColor: 'transparent',
   borderWidth: 4,
   borderColor: 'transparent',
   borderTopColor: '#FF5A5F',
   alignSelf: 'center',
   marginTop: -9,
 },
 arrowBorder: {
   backgroundColor: 'transparent',
   borderWidth: 4,
   borderColor: 'transparent',
   borderTopColor: '#D23F44',
   alignSelf: 'center',
   marginTop: -0.5,
 },
});

var ThingLocation = React.createClass({
  mixins:[EventEmitterMixin],
  getInitialState:function(){
    return{
      coordinate:{
        latitude:0,
        longitude:0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      myPossition:{
        latitude:22.25045216816379,
        longitude:113.5732958889513,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      thing:[],
      routePath:[[]],
    }
  },
  componentDidMount:function(){

    let _this = this;

    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        let region =  {}
        region.latitude = initialPosition.coords.latitude;
        region.longitude = initialPosition.coords.longitude;
        region.latitudeDelta =0.0922;
        region.longitudeDelta =0.0421;
        this.setState({myPossition:region})
        this._CreateRoute();
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    if(this.props.thing && this.props.thing.location)
    {
      this.setState({
        thing:this.props.thing,
        coordinate:this._getThingsLocation(this.props.thing),
      })
    }
    else{
      this.setState({
        coordinate:this.state.myPossition,
      })
    }

    AppLogin.getUserInfoFromNative(function(data){
      thingsProfileDTO.user = data;
    });

    NativeAppEventEmitter.addListener('Amap_SearchDone',(routePath)=>{
      if(routePath && routePath.length>0){
        this.setState({
          routePath:routePath,
        })
      }
    });
    this._CreateRoute();
  },
  _getThingsLocation(thing){
    let region = {};
    if(thing && thing.location)
    {
      region.latitude = thing.location.lat;
      region.longitude = thing.location.lng;
      region.latitudeDelta =0.0922;
      region.longitudeDelta =0.0421;
      // this.setState({
      //   coordinate:region
      // });
      return region ;
    }
  },
  // _getFocusLoaction(){
  //     return this.state.coordinate;
  //
  // },
  
  _jumpToMyPosition:function(){
    // this.setState({
    //   coordinate:this.state.myPossition
    // })
    this.refs.map.animateToRegion(this.state.myPossition);
  },
  _jumpToThingPosition:function(){
    // this.setState({
    //   coordinate:this._getThingsLocation(this.state.thing)
    //
    // })
    this.refs.map.animateToRegion(this._getThingsLocation(this.state.thing));
  },
  _CreateRoute:function(){
    let myPossition = this.state.myPossition;
    let thingPossition = this._getThingsLocation(this.props.thing);
    AMapSearch.getDriveLineWithOriginLat(myPossition.latitude,myPossition.longitude,thingPossition.latitude,thingPossition.longitude);
    // AMapSearch.getRouteWithOriginLat(myPossition.latitude,myPossition.longitude,thingPossition.latitude,thingPossition.longitude,(a)=>{
    //   console.log(a);
    // })
    // this.refs.map.getRouteWithOriginLat(myPossition.latitude,myPossition.longitude,thingPossition.latitude,thingPossition.longitude);
  },
  _onRegionChange:function(Region){
    console.log('"location" : {"lat" : '+ Region.latitude +',"lng" : '+ Region.longitude +'},');
  },
  // _getHTML:function(thing){
  //   let HTML = `
  //   <!doctype html>
  //   <html lang="en">
  //     <head>
  //       <meta charset="utf-8">
  //       <meta http-equiv="X-UA-Compatible" content="chrome=1">
  //       <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
  //       <style type="text/css">
  //         body,html,#container{
  //           height: 100%;
  //           margin: 0px
  //         }
  //       </style>
  //       <title>快速入门</title>
  //
  //     </head>
  //     <body>
  //      <div id="container" tabindex="0"></div>
  //      <script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=7f8d7e7546e6e4a9d733aa79c6bd5561"></script>
  //      <script type="text/javascript">
  //      var map = new AMap.Map('container',{
  //               resizeEnable: true,
  //               zoom: 12,
  //               center: [`+ this.state.myPossition.longitude +`,`+ this.state.myPossition.latitude +`]
  //         });
  //         AMap.service(["AMap.Driving"], function() {
  //           var driving = new AMap.Driving({
  //               map: map,
  //           }); //构造路线导航类
  //           // 根据起终点坐标规划步行路线
  //           driving.search([`+ this.state.myPossition.longitude +`,`+ this.state.myPossition.latitude +`],[`+ thing.location.lng +`,`+thing.location.lat+`]);
  //         });
  //         var icon = new AMap.Icon({
  //                     // image : 'http://s2.nuomi.bdimg.com/upload/deal/2014/1/V_L/623682-1391756281052.jpg',//24px*24px
  //                     image:'` +`file://` + require('image!rubber_duck').path +`',
  //                     //icon可缺省，缺省时为默认的蓝色水滴图标，
  //
  //                     size : new AMap.Size(24,24)
  //             });
  //         var marker = new AMap.Marker({
  //                 icon : icon,//24px*24px
  //                 position : [113.5653360178,22.1448040513],
  //                 offset : new AMap.Pixel(-12,-12),
  //                 map : map
  //         });
  //      </script>
  //     </body>
  //   </html>
  //   `;
  //                         // image:'`+ `data:icon/jpeg;base64,`+this.state.thing.photo +`',
  //   console.log(HTML);
  //   var a = require('image!rubber_duck');
  //   console.log(a);
  //   return HTML;
  // },
  render:function(){
    let _this = this;
    return(
      <View style={{flex:1}}>
        <Image resizeMode={'cover'} style={styles.photo} source={{uri:'data:image/jpeg;base64,'+this.state.thing.photo}}>
          <View  style={{width:windowWidth-10,flexDirection:"row",justifyContent:"center"}}>
            <ThingToolBar selected={"location"} thing={this.props.thing} navigator={this.props.navigator}/>
          </View>
        </Image>
        
        {/*<WebView source={{html: this._getHTML(this.props.thing)}}/>*/}
        {<MapView
          initialRegion={this.state.myPossition}
          ref="map"
          style={styles.map}
          region={this.state.coordinate}
          onRegionChange={this._onRegionChange}
          >
          {
          /*_this.state.routePath[0].map(function(item,index){
          return(
          <MapView.Polyline
          key={index}
          coordinates={item}
          strokeColor={"blue"}
          strokeWidth={2}
          />
          )
          })*/
          }
          <MapView.Marker
          coordinate={this.state.myPossition}
          />

          <MapView.Marker
          coordinate={_this._getThingsLocation(this.state.thing)}
          pointerEvents={"none"}
          >
          <View>
          <Image style={{height:30,width:40,borderRadius:10}} source={{uri:'data:image/jpeg;base64,'+this.state.thing.photo}} />
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
          </View>
          </MapView.Marker>
        </MapView>}
        {/*<TouchableOpacity
          onPress={this._jumpToMyPosition}
          style={
            {
              backgroundColor:"white",
              opacity:0.5,
              width:60,
              height:40,
              position:"absolute",
              top:windowHeight-200,
              left:windowWidth/8,
              alignItems:"center",
              borderRadius:10,
            }}
        >
          <Text style={{marginTop:10}}>
            Me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._CreateRoute}
          style={
            {
              backgroundColor:"white",
              opacity:0.5,
              width:60,
              height:40,
              position:"absolute",
              top:windowHeight-200,
              right:windowWidth/8 * 3,
              alignItems:"center",
              borderRadius:10,
            }}>
          <Text style={{marginTop:10}}>
            Route
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._jumpToThingPosition}
          style={
            {
              backgroundColor:"white",
              opacity:0.5,
              width:60,
              height:40,
              position:"absolute",
              top:windowHeight-200,
              right:windowWidth/8 * 1,
              alignItems:"center",
              borderRadius:10,
            }}>
          <Text style={{marginTop:10}}>
            Thing
          </Text>
        </TouchableOpacity>*/}
      </View>
    )
  }
});
module.exports = ThingLocation;
