/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  PixelRatio,
  TouchableHighlight,
  ScrollView,
  NativeAppEventEmitter,
  Navigator,
  TouchableOpacity,
  DeviceEventEmitter,
  AppState,
  PushNotificationIOS,
} from 'react-native';

var FBSDKLogin = require('react-native-fbsdklogin');
var TimerMixin = require('react-timer-mixin');
var {
  FBSDKLoginButton,
} = FBSDKLogin;
var WeChatAPI = require('react-native-wx/index.js');
var AppNavigator = require('./components/AppNavigator');
var Login = require('./components/Login/Login');
var Logout = require('./components/Login/Logout');
var ThingsView = require('./components/HomePage/ThingsView');
var AppLogin = require('react-native').NativeModules.AppLogin;
var LoadingPage = require('./components/LoadingPage');
// var ThingsList = require('./components/ThingsList/ThingsList');
// var BeaconList = require("./components/BeaconList");
// var EventEmitterMixin = require("./components/EventEmitterMixin");
var EventEmitterMixin = require('react-event-emitter-mixin');
var GlobalEventEmitter = require('./components/GlobalEventEmitter.ios.js');
var g_ConstInfo = require("./constants/GlobalConstants.js");

var Drawer = require('react-native-drawer');

var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

var storageHandler = require('./common/StorageHandler');

var g_Lan = require('./common/LanguagePackage');


var Beacons = require('react-native-ibeacon');
var moment = require('moment');
var region = {
    identifier: 'Sensoros',
    // uuid: '23A01AF0-232A-4518-9C0E-323FB773F5EF'
    uuid: 'fda50693-a4e2-4fb1-afcf-c6eb07647825'
};
Beacons.requestAlwaysAuthorization();
var m_beaconsRange;
var m_postList=[];
var m_postTimeList=[];
var m_userId;
var m_nearByList=[];
var m_inOutList={};
var m_proximity = "";
var Webuzz = React.createClass({
  mixins: [TimerMixin,EventEmitterMixin],
  getInitialState:function(){
    return {
      loginpress: true,
      isLogined:false,
      isChecked:false,
      isLoading:false,
      userid:"",
      inOutList:{},
      showLogin:false,
      callback:function(){}
    }
  },
  _setState:function(data)
  {
      if(data=="success")
      {
        this.setState({ isLogined:true ,isChecked:true,isLoading:false});
        this._getUserId();
      }
      else
      {
        this.setState({ isLogined:false,isChecked:true});
      }
  },
  _startPushNotification(){
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);
  },
  _onLocalNotification:function(notification){

    let message = notification._data.alertBody.split("\r\n");
    let _this = this;
    if(message.length>1){
      storageHandler.getPushNotificationThing(message[1],function(thing){
        _this.eventEmitter("emit","localNotification",thing);
      });
    }
  },
  _startBeaconSearch:function(){
    Beacons.startRangingBeaconsInRegion(region);
    Beacons.startUpdatingLocation();
    m_beaconsRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        // if(!this.state.isLogined){return}
        if(data.beacons && data.beacons.length>0){
          for (var beaconInfo of data.beacons) {
            let beaconInfoKey = beaconInfo.major+g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR+beaconInfo.minor
            if(beaconInfo.proximity && g_ConstInfo.PROXIMITY_VALUE(beaconInfo.proximity)<=m_proximity)
            {
              this._setBeaconIn(beaconInfoKey);
              if (m_postList.indexOf(beaconInfoKey)==-1)
              // if(m_postList.length<=3)
              {
                m_postList.push(beaconInfoKey);
                let postObj = {
                  beacon:beaconInfoKey,
                  time:new Date()
                }
                m_postTimeList.push(postObj);
                this._postBeaconLog(beaconInfo);
                // alert(beaconInfo.major+g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR+beaconInfo.minor);
                // this._refreshHeatChart();
              }
            }
            else if(beaconInfo.proximity && g_ConstInfo.PROXIMITY_VALUE(beaconInfo.proximity)>m_proximity)
            {
              this._setBeaconOut(beaconInfoKey);
            }
          }
        }
      })
  },

  _renderTestMonitorView:function(){
    let arr = [];
    for(var key in this.state.inOutList){
      arr.push({"key":key,data:m_inOutList[key]});
    }
    return (

        <ScrollView
            style={
             {
               backgroundColor:"white",
               opacity:0.5,
               width:windowWidth*7/8,
               height:100,
               position:"absolute",
               top:windowHeight-150,
               left:windowWidth/16,
               // alignItems:"center",

               borderRadius:10,
             }}
            contentContainerStyle={{
              alignItems:"center",
              flexDirection:"column"
            }}
        >
          {
            arr.map(function(item,index){
              return(
                  <Text key={index} style={{marginTop:10,fontSize:9}}>
                    {"Beacon:"+ item.key +", In:" + item.data.inTime + (item.data.outTime ? ",Out:"+item.data.outTime : "")}
                  </Text>
              );
            })


          }
        </ScrollView>
    );
  },
  _setInOutListState(){
    this.setState({
      inOutList:m_inOutList
    });
  },
  // _handleAppStateChange(currentAppState) {
  //   if(currentAppState=="background") {
  //
  //   }
  // },
  _setBeaconIn:function(beaconKeyString){
    let _this = this;
    let beaconInfo = m_inOutList[beaconKeyString]
    if(beaconInfo==undefined)
    {
      m_inOutList[beaconKeyString]={};
      m_inOutList[beaconKeyString].inTime = new Date();
      console.log("in");
      this.eventEmitter('emit','walkIn',beaconKeyString);
      //briantest
      this._setInOutListState();

      return;
    }
    if(beaconInfo.inTime != undefined)
    {
      if(beaconInfo.outTime == undefined ||
        moment(beaconInfo.inTime).diff(moment(beaconInfo.outTime),"seconds")<0)
      {
        if(moment(new Date()).diff(moment(beaconInfo.inTime),"seconds")>=5)
        {
          m_inOutList[beaconKeyString].inTime =new Date();

          //briantest
          this._setInOutListState();

          let beaconKey = beaconKeyString.split(g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR);
          storageHandler.getThingWithBeacon(beaconKey[0],beaconKey[1],function(data){
            navigator.geolocation.getCurrentPosition(
                (initialPosition) => {
                  let region =  {}
                  region.lat = initialPosition.coords.latitude;
                  region.lng = initialPosition.coords.longitude;
                  // console.log("get location success");
                  _this._updateThingsLocation(data,region.lat,region.lng);
                },
                (error) => {
                  console.log(err)
                },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
            );
          });

          console.log("refresh in");
          // console.log(m_inOutList);
          return;
        }
      }
    }
  },
  _setBeaconOut:function(beaconKeyString){
    let beaconInfo = m_inOutList[beaconKeyString]
    //如果不存在，说明没有in过。
    if(beaconInfo==undefined)
    {
      return;
    }
    //如果存在，并且之前没有out过，则设置out
    else if(
      beaconInfo.outTime==undefined ||
      beaconInfo.outTime=="" ||
      moment(beaconInfo.inTime).diff(moment(beaconInfo.outTime),"seconds")>0
    )
    {
      m_inOutList[beaconKeyString].outTime=new Date();

      //briantest
      this._setInOutListState();

      // console.log("out ");
      // Object.keys(m_inOutList).map(function(key){
      //   // console.log(key);
      // })
      return;
    }
  },
  _beaconOut:function(){
    let refresh =false;
    let _this = this;
    Object.keys(m_inOutList).map(function(key){

      if(moment(m_inOutList[key].inTime).diff(moment(new Date()),"minutes")>=1){
        delete m_inOutList[key];

        //briantest
        _this._setInOutListState();

        _this.eventEmitter('emit','walkOut',key);
        return;
      }

      if(m_inOutList[key].outTime != undefined)
      {
        if(moment(m_inOutList[key].inTime).diff(moment(m_inOutList[key].outTime),"seconds")<=0)
        {
          let timeDiff = moment(new Date()).diff(moment(m_inOutList[key].outTime),"seconds");
          // console.log(timeDiff);
          if(timeDiff>=10){
            delete m_inOutList[key];

            //briantest
            _this._setInOutListState();

            _this.eventEmitter('emit','walkOut',key);

            // console.log("Get Out !!!"+key);
          }
        }
      }
    })
  },
  
  componentDidMount: function() {
    this._startBeaconSearch();
    this._startPushNotification();
    this.setInterval(this._resetBeaconsPool,10000);
    this._getUserId();

    navigator.geolocation.getCurrentPosition(
      (initialPosition) => console.log(initialPosition),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this._showLoginPage();

    this.eventEmitter('on',g_ConstInfo.EVENT.proximity,function(data){
      if(data){
        storageHandler.setSystemSetting(storageHandler.settingName.proximity,data.toLowerCase());
        m_proximity = g_ConstInfo.PROXIMITY_VALUE(data);
      }
      else{
        m_proximity = 0;
      }
    })
    this._setProximity();
  },
  
  _setProximity(){
    storageHandler.getSystemSetting(storageHandler.settingName.proximity,function(data){
      if(data){
        m_proximity = g_ConstInfo.PROXIMITY_VALUE(data);
      } else {
        m_proximity = 0;
      }
    });
  },
  
  _getUserId:function(){
    let _this = this;
    AppLogin.getUserIdFromNative(function(data){
      if(data)
      {
        _this.setState({
          userid:data,
        });
      }
    })
  },
  _refreshHeatChart:function(){
    console.log("refresh heat chart send");
    let _this = this;
    let url = g_ConstInfo.WEBUZZ_API_CACHE_HEATCHART();
    fetch(url)
      .then(response=>response.json())
      .then(responseData=>{
        let _storage = g_ConstInfo.WEBUZZ_STORAGE;
        _storage.save({
          key: 'heatChart',  //注意:请不要在key中使用_下划线符号!
          rawData:responseData,
          //如果不指定过期时间，则会使用defaultExpires参数
          //如果设为null，则永不过期
          expires: 1000 * 3600
        });
        _this.eventEmitter('emit','heatChart',responseData,"abc")
      });

  },
  _resetBeaconsPool:function(){
    console.log("timmerstart");
    this._beaconOut();
    this._refreshHeatChart();
    for (var i= m_postTimeList.length-1;i>=0;i--) {
      let postItem = m_postTimeList[i]
      // let diff = moment(new Date()).diff(moment(postItem.time), 'seconds');
      let diff = moment(new Date()).diff(moment(postItem.time), 'seconds');
      // console.log(diff);
      if(diff>=20)
      {
        m_postTimeList.splice(i,1);
        // console.log("m_postTimeList:"+m_postTimeList.length);
        var index = m_postList.indexOf(postItem.beacon);
        // console.log("index:"+index);
        if(index>=0)
        {
          m_postList.splice(index,1)
        }

      }
    }
  },
  _postBeaconLog:function(beacon){
    // let beaconinfo = beacon.split("@@");
    if(!beacon){return}
    if(!this.state.userid || this.state.userid==""){return}
    let url=g_ConstInfo.WEBUZZ_API_THINGS_BEACON(beacon.major,beacon.minor);
    // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
    fetch(url)
      .then((response)=>response.json())
      .catch((error) => {
        // alert(error.messages);
      })
      .then((responseData)=>{
        if(!responseData)
        {
          return;
        }

        storageHandler.setThingBeaconMap(beacon.major,beacon.minor,responseData._id);
        storageHandler.updateThingsStorage([responseData]);

        navigator.geolocation.getCurrentPosition(
          (initialPosition) => {
            let region =  {}
            region.lat = initialPosition.coords.latitude;
            region.lng = initialPosition.coords.longitude;
            console.log("get location success");

            this._updateThingsLocation(responseData,region.lat,region.lng);

            fetch(g_ConstInfo.WEBUZZ_API_LOGS(), {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
              "things": responseData._id,
              "createBy": this.state.userid,
              "logType": "I",
              "__v": 0,
              "beacon": {
                "major": beacon.major,
                "minor": beacon.minor,
                "range": "I"
              },
              "location":region,
            })
            })
            .then(res => res.json())
            .then(res => {})
            return;
          },
          (error) => {return},
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );

        fetch(g_ConstInfo.WEBUZZ_API_LOGS(), {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          "things": responseData._id,
          "createBy": this.state.userid,
          "logType": "I",
          "__v": 0,
          "beacon": {
            "major": beacon.major,
            "minor": beacon.minor,
            "range": "I"
          }
        })
        })
        .then(res => res.json())
        .then(res => {})
      })
      .done();
  },
  _showLoginPage:function(){
    this.eventEmitter('on','ShowLogin',function(callback){
      console.log("_showLoginPage");
      this.setState({
        showLogin:true,
        callback:callback,
      })
    });
  },

  _updateThingsLocation:function(thing,lat,lng){
    if(!thing) return;

    let location = {};
    location.lat = lat;
    location.lng = lng;
    thing.location = location;
    let url = g_ConstInfo.WEBUZZ_API_THING_UPDATE_LOCATION(thing._id);

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({"location":location}),
    })
        .then(res => res.json())
        .then(res => {
        });
    this.eventEmitter('emit','updateLocation',thing);
  },

  _loginPageStyle:function(){
    if(this.state.showLogin){
      return {
        flex:1,
      }
    }else{

      return{
        height:0,
        overflow:"hidden"
      }

    }
  },
  _mainPageStyle:function(){
    if(!this.state.showLogin){
      return {
        flex:1,
      }
    }else{
      return{
        height:0,
        overflow:"hidden"
      }
    }
  },
  render:function(){
    let _this = this;
    {
      return(
        <View style={{flex:1}}>
          <View style={this._mainPageStyle()}>
            <Navigator
              initialRoute={{component:ThingsView}}
              renderScene = {(route, navigator) =>{
                let ThView = route.component;
                  return (
                  <View style={{flex:1}}>
                    <ThView name={()=>{this.setState({isChecked:false})}} navigator={navigator} {...route.params} />
                    {/*this._renderTestMonitorView()*/}
                  </View>
                  )
              }}
            />
          </View>
          <View style={this._loginPageStyle()}>
            <Login
                name={()=>{
                  this.setState({ isChecked: false,
                  showLogin:false,
                  });
                  AppLogin.getUserIdFromNative(function(data){
                    if(_this.state.callback){
                      _this.state.callback(data);
                    }
                  })
                }}
                loading = {()=>{this.setState({isLoading:true});}}
                unloading = {()=>{this.setState({isLoading:false});}}
            />
          </View>
        </View>
      );

    }
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  row: { flexDirection: 'row', margin: 20 },
  cell: {
      flex: 1,
      height: 50,
      backgroundColor: 'transparent'
  },
  celltext: {
      flex: 1,
      height: 50,
      fontSize: 25,
      marginLeft: 5,
      backgroundColor: 'transparent'
  },
  image: { width: 40, height: 40, marginRight: 10 },
  text: { flex: 1, justifyContent: 'center'},
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14 },
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

AppRegistry.registerComponent('Webuzz', () => Webuzz);
