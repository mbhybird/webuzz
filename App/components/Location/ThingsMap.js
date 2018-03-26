'user strict'

import React, {
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  TouchableOpacity,
} from 'react-native';

var Icon = require('react-native-vector-icons/FontAwesome');
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');

var EventEmitterMixin = require('react-event-emitter-mixin');
var MapView = require('react-native-maps');
var AppLogin = require('react-native').NativeModules.AppLogin;
var AMapSearch = require('react-native').NativeModules.AMapSearch;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var Comment =  require('../Comment/Navigation');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var TimerMixin = require('react-timer-mixin');
var userInfoHelper = require('../../common/UserInfoHelper');

var thingsProfileDTO={
  user:{},
  thing:{},
  userPhoto:{}
};

var data;

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

var ThingsMap = React.createClass({
  mixins:[TimerMixin,EventEmitterMixin],
  getInitialState:function(){
    return{
      coordinate:{
        latitude: 22.25045216816379,
        longitude: 113.5732958889513,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      myPossition:{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      things:[],
      thingsAround:[],
      showThingsAround:false,
      thingsLocation:{},
      postTime:0,
      refreshTime:0,
    }
  },
  componentDidMount:function(){
    let _this = this;
    this._showThingsAround();
    this._getThingsFromStorage();
    this.setInterval(this._refreshThingsLocation,5000);
    this._refreshMyPosistion();


    this.eventEmitter("on","nearByUpdated",(things)=>{
      if(things && things.length>0){
          _this.setState({
            things:things,
          })
      }
    });
    this.eventEmitter('on','locationTab',function(){
      this._refreshMyPosistion();
    });
    AppLogin.getUserInfoFromNative(function(data){
      thingsProfileDTO.user = data;
    });

    this.eventEmitter("on","updateLocation",()=>{
        _this.setState({
          postTime:this.state.postTime+1,
        })
    });

  },
  _refreshMyPosistion:function(){
    navigator.geolocation.getCurrentPosition(
        (initialPosition) => {
          let region =  {}
          region.latitude = initialPosition.coords.latitude;
          region.longitude = initialPosition.coords.longitude;
          region.latitudeDelta =0.0922;
          region.longitudeDelta =0.0421;
          this.setState({
            coordinate:region,
            myPossition:region
          })
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  _getThingsLocation(thing){
    let region = {};
    if(this.state.thingsLocation && this.state.thingsLocation[thing._id]){

      let location = JSON.parse(this.state.thingsLocation[thing._id]);
      region.latitude = location.lat;
      region.longitude = location.lng;
      region.latitudeDelta =0.0922;
      region.longitudeDelta =0.0421;

      return region;
    }
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
    else {
      return this.state.coordinate;
    }

  },
  _getThingsFromStorage(){
      let _storage = g_ConstInfo.WEBUZZ_STORAGE;
      _storage.load({
        key: 'nearByGroup',

        autoSync: true,

        syncInBackground: true
      }).then( group => {
        if(!group || !group.things || group.things<=0){
          return;
        }
        this.setState({
          things:group.things
        })
      }).catch( err => {
        // console.warn(err);
      });
  },
  _getFocusLoaction(){
    // if(this.state.things.length>0)
    // {
    //   let location = this._getThingsLocation(this.state.things[0]);
    //   return location;
    // }
    // else {
      return this.state.coordinate;
    // }
  },

  _jumpToComment:function(thing){
    let _thing = thing;
    let _userPhoto = require('image!Webuzz');
    let _this = this;
    thingsProfileDTO.thing = _thing;
    // if(thingsProfileDTO.user){
    //   if(thingsProfileDTO.user.photo){
    //     _userPhoto = {uri:'data:image/jpeg;base64,'+thingsProfileDTO.user.photo}
    //   }
    //   else if (thingsProfileDTO.user.wechat && thingsProfileDTO.user.wechat.headimgurl) {
    //     _userPhoto = {uri:thingsProfileDTO.user.wechat.headimgurl}
    //   }
    //   else if (thingsProfileDTO.user.facebook && thingsProfileDTO.user.facebook.headimgurl) {
    //     _userPhoto = {uri:thingsProfileDTO.user.facebook.headimgurl}
    //   }
    // }
    // thingsProfileDTO.userPhoto=_userPhoto;

    userInfoHelper.getCommentDTOUserInfo(thingsProfileDTO,function(data){
      _this.eventEmitter('emit','closeTabBar');
      _this.props.navigator.push({component:Comment,name:_thing.name,params:{thingsProfileDTO:data}});
    });

    // this.props.navigator.push({component:Comment,name:_thing.name,params:{thingsProfileDTO:thingsProfileDTO}});
    // this.props.navigator.Hide();
  },

  _onRegionChangeComplete:function(region){
    // this._getThingsAround(region);
    this.setState({coordinate:region,showThingsAround:false})
  },

  _showThingsAround:function(){
    let region = this.state.coordinate;
    this._getThingsAround(region);
  },
  _refreshThingsLocation:function(){
    let url = g_ConstInfo.WEBUZZ_API_THINGS_ALL_LOCATION();
    fetch(url)
      .catch(err=>{console.log(err)})
      .then(res=>res.json())
      .then(res=>{

        this.setState({
          thingsLocation:res,
          refreshTime:this.state.refreshTime+1,
        })
      })

  },
  _getThingsAround:function(region){

    let latmin = region.latitude-0.1;
    let latmax = region.latitude+0.1;
    let lngmin = region.longitude-0.1;
    let lngmax = region.longitude+0.1;
    let url = g_ConstInfo.WEBUZZ_API_THINGS_LOCATION(latmin,latmax,lngmin,lngmax);
    let _this = this;
    // alert(url);
    fetch(url)
      .then(response=>response.json())
      .catch(error=>{alert("Can not connect to server");})
      .then(responseData=>{

        if(responseData && responseData.length>0){

          let thingsNearBy = _this.state.things;

          for (var thing of thingsNearBy) {

            for(var i=responseData.length-1;i>=0;i--){

              if(responseData[i]._id==thing._id){
                responseData.splice(i,1);
              }
            }
          }
          this.setState({
            thingsAround:responseData,
            showThingsAround:true
          })
        }

      })
      .done();
  },

  _showPin:function(){
    return (<MapView.Marker
      coordinate={this.state.coordinate}
            />)
  },

  render:function(){
    let _this = this;
    // let Pin = <MapView.Marker pinColor={"blue"} coordinate={this.state.coordinate}/>
    // if(this.state.showThingsAround==false)
    // {
    //   Pin = <View/>
    // }
    return(
      <View style={{flex:1}}>
        <MapView
          style={ styles.map }
          onRegionChangeComplete={this._onRegionChangeComplete}
          initialRegion={{
            latitude: 22.25045216816379,
            longitude: 113.5732958889513,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={this._getFocusLoaction()}
        >
          {<MapView.Marker
            coordinate={this.state.myPossition}
          />}
          {/*{Pin}*/}
          {

            _this.state.thingsAround.map(function(item,index){

              return(
                <MapView.Marker key={index}
                onLayout={(e)=>{
                  // let x = nativeEvent.layout.x;
                  // let y = nativeEvent.layout.y;
                  // console.log(e.nativeEvent);
                  // console.log(x+","+y);
                }}
                coordinate={_this._getThingsLocation(item)}
              >
                <TouchableOpacity
                  onPress={()=>{_this._jumpToComment(item)}}
                >
                  <Image style={{height:20,width:20,borderRadius:10}} source={require('image!icon-map-webuzz')}/>
                </TouchableOpacity>
                {/*<MapView.Callout>
                  <View>
                  <TouchableOpacity>
                  <Text>{item.name}</Text>
                  </TouchableOpacity>
                  </View>
                </MapView.Callout>*/}
              </MapView.Marker>
              )

            })

          }
          {
            _this.state.things.map(function(item,index){
              return(
                <MapView.Marker
                coordinate={_this._getThingsLocation(item)}
                key={index}
              >
                <TouchableOpacity
                  style={{borderWidth:1,borderRadius:10,overflow:"hidden",shadowColor:"grey"}}
                  onPress={()=>{_this._jumpToComment(item)}}
                >
                  <Image style={{height:30,width:40}} source={{uri:'data:image/jpeg;base64,'+item.photo}} />
                </TouchableOpacity>
                {/*<MapView.Callout>
                  <View>
                  <TouchableOpacity>
                  <Text>{item.name}</Text>
                  </TouchableOpacity>
                  </View>
                </MapView.Callout>*/}
              </MapView.Marker>
              )
            })
          }
        </MapView>
        {/*<View
            style={
             {
             backgroundColor:"white",
             opacity:0.5,
             width:200,
             height:40,
             position:"absolute",
             top:windowHeight-150,
             right:windowWidth/8,
             alignItems:"center",
             borderRadius:10,
             }}
        >
          <Text style={{marginTop:10}}>
            {this.state.postTime}
          </Text>
        </View>

        <View
            style={
             {
             backgroundColor:"white",
             opacity:0.5,
             width:200,
             height:40,
             position:"absolute",
             top:windowHeight-200,
             left:windowWidth/8,
             alignItems:"center",
             borderRadius:10,
             }}
        >
          <Text style={{marginTop:10}}>
            {this.state.refreshTime}
          </Text>
        </View>*/}


        {/*<TouchableOpacity
          onPress={this._showThingsAround}
          style={
            {
              backgroundColor:"white",
              opacity:0.5,
              width:100,
              height:40,
              position:"absolute",
              top:windowHeight-200,
              right:windowWidth/8,
              alignItems:"center",
              borderRadius:10,
            }}
        >
          <Text style={{marginTop:10}}>
            Refresh
          </Text>
        </TouchableOpacity>
        */}
      </View>
    )
  }
});
module.exports = ThingsMap;
