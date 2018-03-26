'user strict'

import React, {
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  TouchableOpacity,
  WebView,
  ScrollView,
  ActivityIndicatorIOS,
  ProgressViewIOS,
} from 'react-native';

var Icon = require('react-native-vector-icons/FontAwesome');
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var EventEmitterMixin = require('react-event-emitter-mixin');
var TimerMixin = require('react-timer-mixin');

var AudioHandler = require('react-native').NativeModules.AudioHandler;

var storageHandler = require('../../common/StorageHandler');

var FavorThings = require('../HomePage/HomePage');

var AppLogin = require('react-native').NativeModules.AppLogin;

var g_ConstInfo = require("../../constants/GlobalConstants.js");

var UserInfoHelper = require('../../common/UserInfoHelper');

var g_Lan = require('../../common/LanguagePackage');

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center'
  },
  navBar1: {
    backgroundColor: 'white',
    height: 40
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9
  },
  navBarLeftButton: {
    paddingLeft: 10
  },
  navBarRightButton: {
    paddingRight: 10
  },
  navBarButtonText: {
    color: '#5890FF'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gray: {
    backgroundColor: '#cccccc'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

const HTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <style type="text/css">
      body,html,#container{
        height: 100%;
        margin: 0px
      }
    </style>
    <title>快速入门</title>

  </head>
  <body>
   <div id="container" tabindex="0"></div>
   <script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=7f8d7e7546e6e4a9d733aa79c6bd5561"></script>
   <script type="text/javascript">
   var map = new AMap.Map('container',{
            resizeEnable: true,
            zoom: 12,
            center: [113.5653360178,22.1448040513]
      });
      AMap.service(["AMap.Driving"], function() {
        var driving = new AMap.Driving({
            map: map,
        }); //构造路线导航类
        // 根据起终点坐标规划步行路线
        driving.search([113.5732958889513,22.25045216816379],[113.5653360178,22.1448040513]);
      });
      var icon = new AMap.Icon({
                  image : 'http://vdata.amap.com/icons/b18/1/2.png',//24px*24px
                  //icon可缺省，缺省时为默认的蓝色水滴图标，
                  size : new AMap.Size(24,24)
          });
      var marker = new AMap.Marker({
              icon : icon,//24px*24px
              position : [113.5653360178,22.1448040513],
              offset : new AMap.Pixel(-12,-12),
              map : map
      });
   </script>
  </body>
</html>
`;

const SoundFile = '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';
// var weburl = "http://lbs.amap.com/fn/jsdemo_loader/?url=http://webapi.amap.com/demos/quickstart/quickstart.html";

var audioRecord = {
  audioName: "",
  audio: ""
};
var userId = "";
var timerId;
var Friends = React.createClass({
  mixins: [TimerMixin],
  getInitialState: function () {
    return {
      thing: {},
      things: {},
      animating: true,
      fileSize: 0,
      audioPower: 0,
      photoSource: {}
    }
  },
  componentDidMount: function () {
    let _this = this;

    // storageHandler.getThingFromStorage('56e6964bbc92c9840d000006',function(data){
    //   _this.setState({thing:data})
    // })
    //
    // storageHandler.getAllThingsTest(function(data){
    //   _this.setState({things:data})
    // })
    this._getUserId();
    UserInfoHelper.getUserPhotoInfo(function (data) {
      _this.setState({
        photoSource: data
      });
    });

  },
  _getUserIdWithCheck: function () {
    UserInfoHelper.getUserIdWithCheck(function (data) {
      console.log("getUserIdWithCheck" + data);
    })
  },
  _getUserId: function () {
    AppLogin.getUserIdFromNative(function (data) {
      userId = data;
    })
  },
  _getFileSize: function () {
    let _this = this;
    AudioHandler.getRecordingFileSize(function (data) {
      _this.setState({
        fileSize: data
      })
    });
  },
  _batchConvertAmrToWav: function () {
    AudioHandler.batchConvertAmrToWav([{'audio': SoundFile, 'audioName': 'brianTest.amr'}, {
      'audio': SoundFile,
      'audioName': 'brianTest2.amr'
    }], function (data) {
      console.log("callback");
    });
  },
  _startRecording: function () {

    let _this = this;

    AudioHandler.startRecord(function (data) {
      audioRecord = {audioName: "", audio: ""};
      audioRecord.audioName = data;
      timerId = setInterval(_this._getPower, 100);
      console.log("timerId is " + timerId);
      // _this._getPower();
    })

  },
  _stopRecording: function () {
    AudioHandler.stopRecord(function (data) {
      audioRecord.audio = data;
    });
    clearInterval(timerId);
  },
  _getPower: function () {
    let _this = this;
    AudioHandler.powerProgress(function (data) {
      _this.setState({
        audioPower: data
      });
    })
  },
  _testOnly: function () {
    this._postVoiceCommentToServer('56fcefa1eb002d4c0d000005', 'Good Show', userId, audioRecord);
  },
  _postVoiceCommentToServer: function (thingId, title, userid, audiorecord) {

    /**
     *  audiorecord struck is audioRecord = {audioName: "", audio: ""}
     */
    if (!audiorecord || audiorecord.audio == '' || audiorecord.audioName == '') {
      return;
    }

    let url = g_ConstInfo.WEBUZZ_API_THINGS_ADDCOMMENT(thingId, title);

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": "",
        "html": null,
        "photo": null,
        "audio": audiorecord.audio,
        "video": null,
        "doodle": null,
        "type": "A",
        "createBy": userid
      })
    })
      .catch(err=> {
        console.log(err)
      })
      .then(res => res.json())
      .then(res => {
        if (res.status == 'success') {
          AudioHandler.renameAudioFile(audiorecord.audioName + ".wav", res.data + ".wav");
        }
        else {
          //TODO:Add this audioRecord to fail list. Help user to repost it.
          storageHandler.addAudioNeedRepost(audiorecord);
        }
      });
  },
  render: function () {
    let headImageWidth = windowWidth / 1242 * 355;
    return (
      <View style={{
                    flex:1,
                    // alignItems:"center",
                    // backgroundColor:"black",
                    flexDirection:"column",
                    justifyContent:"flex-start"
                }}
      >
        {/*<Text style={{color:"blue",fontSize:30}}>Friends</Text>
         <TouchableOpacity
         onPress={this._getUserIdWithCheck}
         >
         <Text>test</Text>
         </TouchableOpacity>


         */}
        <Image
          source={this.state.photoSource}
          style={{
                        width:headImageWidth,
                        height:headImageWidth,
                        position:"absolute",
                        left:(windowWidth/2)-(headImageWidth/2),
                        top:(windowWidth*2/4)/7.39,
                    }}
          resizeMode={"cover"}
        />
        <Image
          style={{
                        width:windowWidth,
                        height:windowWidth*2/4,
                    }}
          source={require('image!img-friends-headimg')}
        />

      </View>
      // <WebView source={{html: HTML}}/>
      // <WebView source={{uri:weburl}}/>
      // <ScrollView>
      //   <View style={{flex:1,flexDirection:"column",justifyContent:"center"}}>
      //     {/*<Text>{JSON.stringify(this.state.thing)}</Text>*/}
      //     <Text>{JSON.stringify(this.state.things)}</Text>
      //   </View>
      // </ScrollView>
      // <FavorThings navigator={this.props.navigator}/>
      // <View style={{flex:1,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
      //     {/*<ActivityIndicatorIOS
      //      animating={this.state.animating}
      //      style={{height: 80}}
      //      size="large"
      //      />*/}
      //     <ProgressViewIOS style={{width:windowWidth}} progress={this.state.audioPower}/>
      //     <TouchableOpacity
      //         style={{margin:10}}
      //         onPress={this._startRecording}
      //         >
      //         <Text>start recording</Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //         style={{margin:10}}
      //         onPress={this._stopRecording}
      //         >
      //         <Text>stop recording</Text>
      //     </TouchableOpacity>
      //
      //     <TouchableOpacity
      //         style={{margin:10}}
      //         onPress={this._testOnly}
      //         >
      //         <Text>GetFileSize</Text>
      //     </TouchableOpacity>
      //     <Text>{this.state.fileSize}</Text>
      // </View>
    )
  }
});


var FriendsNavigator = React.createClass({
  mixins: [EventEmitterMixin],
  getInitialState: function () {
    return {
      isHome: true,
      hideNavigator: false,
      navigatorHeight: 60
    }
  },
  componentDidMount: function () {
  },
  _jumpToHomePage: function () {
    // <HomePage navigator={this.props.navigator}/>
    this.props.navigator.push({component: HomePage})
  },
  _openPanel: function (name) {
    // this._drawer.props.navigator = navigator;
    // if(name=="Home"){
    this.eventEmitter('emit', 'openPanel');
    // }
  },

  _closePanel: function () {
    this._drawer.close()
  },

  _NavigationBarRouteMapper: function () {
    var _this = this;
    return {
      LeftButton: function (route, navigator, index, navState) {
        if (index > 0) {
          return (
            <TouchableOpacity
              onPress={() => navigator.pop()}
              style={[styles.navBarLeftButton,
                {
                  width:100,
                  height:40,
                  alignItems:"center",
                  flexDirection:"row",
                  justifyContent:"flex-start"
                }]}>
              <Image style={{width:25,height:25}} source={require('image!icon-black-angelleft')}/>
            </TouchableOpacity>
          );
        }

      },
      RightButton: function (route, navigator, index, navState) {
        if (route.name == "Friends") {
          return (
            <TouchableOpacity
              onPress={()=>{_this._openPanel(route.name)}}
              style={[styles.navBarRightButton,{
                    width:100,
                    height:40,
                    alignItems:"center",
                    flexDirection:"row",
                    justifyContent:"flex-end"
                  }]}>
              <Image style={{width:25,height:25}} source={require('image!icon-black-sidebar')}/>
            </TouchableOpacity>
          );
        }
      },
      Title: function (route, navigator, index, navState) {
        return (
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.name == "Friends" ? g_Lan.tab_bar_friends() : route.name}
          </Text>
        );
      }
    }
  },
  _hideNavigator: function () {
    this.setState({
      hideNavigator: true,
      navigatorHeight: 0
    })
  },
  _showNavigator: function () {
    this.setState({
      hideNavigator: false,
      navigatorHeight: 60
    })
  },
  _navStyle: function () {
    return {
      backgroundColor: 'white',
      height: this.state.navigatorHeight,
      alignItems: 'center'
    }
  },
  render: function () {
    return (
      <Navigator
        navigationBar={
        <Navigator.NavigationBar
        routeMapper={this._NavigationBarRouteMapper()}
        style={this._navStyle()}
      />}
        initialRoute={{component:Friends,name:"Friends"}}
        renderScene={(route, navigator) =>{
          let Fs = route.component;
          navigator.Hide=this._hideNavigator;
          navigator.Show=this._showNavigator;
          return(
              <View style={{flex:1,flexDirection:"column"}}>
                <View style={this._navStyle()}/>
                <Fs navigator={navigator} {...route.params} />
              </View>
          )
        }}
      />
    )
  }
});

module.exports = FriendsNavigator;
