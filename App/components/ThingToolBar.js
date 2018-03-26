'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Navigator,
  Text,
  ActivityIndicatorIOS,
  NativeModules,
  ActionSheetIOS,
  AlertIOS
} = React;

var AppLogin = require('react-native').NativeModules.AppLogin;

const WeChatAPI = NativeModules.WeChatAPI;
var WeChatCheck = require('react-native-wx/index.js');
var Dimensions = require('Dimensions');

var ToolsBar = require('./ToolsBar.js');

var userid;

var Icon = require('react-native-vector-icons/FontAwesome');

var g_ConstInfo = require("../constants/GlobalConstants.js");

var EventEmitterMixin = require('react-event-emitter-mixin');

var storageHandler = require('../common/StorageHandler');

var UserInfoHelper = require('../common/UserInfoHelper');

const g_Lan = require('../common/LanguagePackage');

const FacebookShare = require('react-native-fbsdkshare');

var AudioHandler = NativeModules.AudioHandler;



var ShareApi = FacebookShare.FBSDKShareAPI;
var ShareDialog = FacebookShare.FBSDKShareDialog;
var FBSDKCore = require('react-native-fbsdkcore');
var {
    FBSDKAccessToken,
} = FBSDKCore;

var FBSDKShare = require('react-native-fbsdkshare');
var {
    FBSDKSharePhoto,
    FBSDKSharePhotoContent,
    FBSDKShareLinkContent,
} = FBSDKShare;

// ...



// const shareLinkContent = {
//   contentType: 'photo',
//   contentURL: "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png",
//   contentDescription: 'Wow, check out this great photo!',
// };
var styles=StyleSheet.create({
  toolBar:{
    height:50,
    width:Dimensions.get("window").width-10,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
    backgroundColor:"#F1F2F2",
    // marginLeft:5
  },
  toolBarIcon:{
    marginTop:5,
  },
  toolBarIconPng:{
    height:30,
    width:30,
    marginTop:0,
  },
});

var thingsProfileDTO={
  user:{},
  thing:{},
  userPhoto:{},
};

var IndicatorView = React.createClass({
  render:function(){
    return(
      <ActivityIndicatorIOS
        animating={true}
        style={{height: 80}}
        size="small"
      />)
  }
})

var ThingToolBar = React.createClass({
  propTypes:{
    thing:React.PropTypes.object,
  },
  mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],
  getInitialState:function(){
    return{
      isFavor:false,
      isWaiting:false,
      lan:g_Lan.CURRENT_LAN(),
    }
  },
  componentWillMount:function(){
    this._getUserId();
  },

  componentDidMount:function(){
    let _this = this;
    // g_Lan.setCurrentLan(2);
    AppLogin.getUserInfoFromNative(function(data){
      thingsProfileDTO.user = data;
    });
    storageHandler.checkIsFavorThings(this.props.thing,function(data){
      _this.setState({
        isFavor:data
      })

    });
  },

  _getUserId:function(){
    AppLogin.getUserIdFromNative(function(data){
        userid=data;
    })
  },

  _jumpToThingDetail:function(){
    let _thing = this.props.thing;

    let _routes = this.props.navigator.getCurrentRoutes();
    if(_routes && _routes.length>1){
      for (var i = _routes.length-1; i>=0; i--) {
        if(_routes[i].component.displayName=="ThingDetail"){
          this.props.navigator.popToRoute(_routes[i]);
          this.eventEmitter('emit','openTabBar');
          return;
        }
      }
    }
    var ThingsDetailPage = require("./ThingDetails/ThingDetailMain");
    this.eventEmitter('emit','openTabBar');
    this.props.navigator.push({component:ThingsDetailPage,name:_thing.name,params:{userId:userid,thingItem:_thing}});
  },

  _jumpToThingLocation:function(){

    let _thing = this.props.thing;

    if(!_thing.location){
      alert("This thing hasn't share location yet!");
      return
    }

    let _routes = this.props.navigator.getCurrentRoutes();
    if(_routes && _routes.length>1){
      if(_routes[_routes.length-2].component.displayName=="ThingLocation"){
        this.props.navigator.pop();
        this.eventEmitter('emit','openTabBar');
        return;
      }
      if(_routes[_routes.length-1].component.displayName=="ThingLocation"){
        return;
      }
    }
    var ThingLocation = require('./Location/ThingLocation');
    this.eventEmitter('emit','openTabBar');
    this.props.navigator.push({component:ThingLocation,name:_thing.name,params:{thing:_thing}});
  },

  _checkIsMyThingBeforeAdd:function(){
    let _this = this;
    UserInfoHelper.getUserIdWithCheck(function(_userid){
      if(_userid && _userid !=""){
        storageHandler.checkIsMyThings(_this.props.thing,function(item){
          if(item == false){
            _this.setState({
              isWaiting:true,
            })
            _this._addToFavor();
          }else{
            alert('Can not add your own things to favor');
          }
        })
      }
    })
  },

  _addToFavor:function(){
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR();
    let _this = this;
    fetch(url,{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "ownerId":userid,
          "thingsId":[this.props.thing._id]
      })
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.status && res.status=="success"){
        storageHandler.refreshFavorsRelatedFromURL(userid,function(data){
          if(data[_this.props.thing._id]==undefined){
            alert("Add this favor thing failed.")
          }
          else{
            //TODO:emit thing event to close refresh ducks
            // this.eventEmitter('emit','ducks'+this.props.thing._id,this._getDucks);
            _this._emitDucksRefresh(_this.props.thing);
            _this.setState({
              isFavor:true
            })
          }
          _this.setState({
            isWaiting:false,
          })
        });
      }
    });

  },

  _emitDucksRefresh:function(thing){
    // let thingId = thing._id;
    let eventId = 'ducks'+thing._id;
    this.eventEmitter('emit',eventId);
  },

  _deleteFavor:function(){

    this.setState({
      isWaiting:true,
    });

    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR();
    let _this = this;
    fetch(url,{
      method:'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "ownerId":userid,
          "thingsId":[_this.props.thing._id]
      })
    })
     .then(res=>res.json())
     .then(res=>{
       if(res.status && res.status=="success"){
         storageHandler.refreshFavorsRelatedFromURL(userid,function(data){
           if(data[_this.props.thing._id]==undefined){
             _this._emitDucksRefresh(_this.props.thing);
             _this.setState({
               isFavor:false
             });
           }
           else{
             alert("Delete this favor thing failed.");
           }
           _this.setState({
             isWaiting:false,
           });
         });
       }
     });
  },

  _jumpToComment:function(thing){
    let _thing = thing;
    let _userPhoto = require('image!Webuzz');

    thingsProfileDTO.thing = _thing;

    if(thingsProfileDTO.user){
      if(thingsProfileDTO.user.photo){
        _userPhoto = {uri:'data:image/jpeg;base64,'+thingsProfileDTO.user.photo}
      }
      else if (thingsProfileDTO.user.wechat && thingsProfileDTO.user.wechat.headimgurl) {
        _userPhoto = {uri:thingsProfileDTO.user.wechat.headimgurl}
      }
      else if (thingsProfileDTO.user.facebook && thingsProfileDTO.user.facebook.headimgurl) {
        _userPhoto = {uri:thingsProfileDTO.user.facebook.headimgurl}
      }
    }
    thingsProfileDTO.userPhoto=_userPhoto;

    let _routes = this.props.navigator.getCurrentRoutes();
    if(_routes && _routes.length>1){
      if(_routes[_routes.length-2].component.displayName=="Navigation"){
        this.props.navigator.pop();
        return;
      }
      if(_routes[_routes.length-1].component.displayName=="Navigation"){
        return;
      }true
    }
    var Navigation =  require('./Comment/Navigation');
    // this.eventEmitter('emit','closeTabBar');
    this.props.navigator.push({component:Navigation,hideTabBar:true,name:_thing.name,params:{thingsProfileDTO:thingsProfileDTO}});
    // this.props.navigator.Hide();
    // this._jumpToPageWithNavigator({component:Navigation,name:_thing.name,params:{thingsProfileDTO:thingsProfileDTO}});
  },

  _sharePhotoToWXTimeLine: function(thing){
    if(thing && thing.photo){
      WeChatAPI.shareBase64PhotoToTimeLine(thing.photo,thing.name,function(data){
        console.log(data);
      });
    } else {
      AlertIOS.alert(g_Lan.information(),g_Lan.MSG_CAN_NOT_FIND_THING());
    }
    
  },
  _shareLinkToWXTimeLine: function(thing){
    WeChatAPI.shareLinkToTimeLine("https://www.pgyer.com/zn4v",thing.photo,thing.name,thing.description,function(data){
      console.log(data);
    });
  },
  _shareAppExtendToWXTimeLine: function(thing){
    if(thing && thing.photo){
      WeChatAPI.shareAppExtentToTimeLine(
        thing._id,
        "https://www.pgyer.com/zn4v",
        // "appWebuzz://"+thing._id,
        thing.photo,
        thing.name,
        thing.description,
        null,
        function(data){
          console.log(data);
      });
    } else {
      AlertIOS.alert(g_Lan.information(),g_Lan.MSG_CAN_NOT_FIND_THING());
    }

  },

  _shareAppExtendToWXSession: function(thing){
    if(thing && thing.photo){
      WeChatAPI.shareAppExtentToSession(
        thing._id,
        "https://www.pgyer.com/zn4v",
        thing.photo,
        thing.name,
        thing.description,
        null,
        function(data){
          console.log(data);
      });
    } else {
      AlertIOS.alert(g_Lan.information(),g_Lan.MSG_CAN_NOT_FIND_THING());
    }
  },

  _sharePhotoToFBTimeLine: function(thing){

    AudioHandler.addWaterPrint(thing.photo,function(data){
      // Build up a shareable photo, where 'cat.png' is included in the project. A data URI encoding the image can also be passed.
      var photo = new FBSDKSharePhoto(g_ConstInfo.IMAGE_BASE64_PREFIX + thing.photo, true);
      var photoContent = new FBSDKSharePhotoContent([photo]);

      ShareDialog.setMode('share-sheet');
      ShareDialog.setContent(photoContent);
      ShareDialog.canShow(function(canshow){
        if(canshow){
          ShareDialog.show(function(data){
            if(data && data.nativeStackIOS && data.nativeStackIOS.length>0){
              alert('Share ERROR!');
              console.log(data);
            }
          });
        }
      });
    });

  },

  _shareLinkToFBTimeLine: function(thing){

    var linkContent = new FBSDKShareLinkContent("https://www.pgyer.com/zn4v","description","title");

    ShareDialog.setContent(linkContent);
    ShareDialog.setMode('share-sheet');
    ShareDialog.canShow(function(canshow){
      if(canshow){
        ShareDialog.show(function(data){
          if(data && data.nativeStackIOS && data.nativeStackIOS.length>0){
            alert('Share ERROR!');
            console.log(data);
          }
        });
      }
    });
  },

  _checkIfFBHasPublishActions: function(callback){
    FBSDKAccessToken.getCurrentAccessToken((tk)=>{
      if(callback){
        callback((tk && tk.permissions && tk.permissions.length>0 && tk.permissions.indexOf("publish_actions"))>=0 ? true : false);
      }
    });
  },

  _checkIfFBHasInstalled: function(callback){
    ShareDialog.setMode('native');
    ShareDialog.canShow(function(data){
      if(callback){
        callback(data);
      }
    })
  },
  _showShareActions: function(thing){
    let _this = this;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options:[g_Lan.share_to_wechat(),g_Lan.share_to_facebook(),g_Lan.cancel()],
        cancelButtonIndex:2,
        title:"Share"
      },
      (buttonIndex)=>{
        if(buttonIndex==0)
        {
          _this._renderWechatShareActionSheet(thing);
        }
        if(buttonIndex==1){
          //是否有安装facebook
          _this._checkIfFBHasInstalled(installed=>{
            if(installed){
              //app是否有权限使用share
              _this._checkIfFBHasPublishActions(haspermission=>{
                if(haspermission){
                  _this._renderFacebookShareActionSheet(thing)
                } else {
                  _this._renderLinkAccountAlert();
                }
              })
            } else {
              alert(g_Lan.MSG_INSTALL_FACEBOOK());
            }
          });
        }
      }
    )
  },
  _renderLinkAccountAlert :function(){
    AlertIOS.alert(
      g_Lan.ALERT_TITLE_INFORMATION(),
      g_Lan.MSG_LINK_FACEBOOK(),
      [
        {text: g_Lan.cancel(), onPress: () => console.log('Foo Pressed!')},
        {text: g_Lan.confirm(), onPress: () => {UserInfoHelper.showLoginPageAndGetLoginId();}},
      ]
    )

  },
  _renderWechatShareActionSheet: function(thing){
    let _this = this;
    // if(WeChatCheck.isWXAppInstalled()){
    //   alert("installed")
    // }
    //   WeChatCheck.isWXAppInstalled().then((data)=>{
    //     console.log(data)
    //   });
    WeChatAPI.isWXAppInstalled(function(data,isInstalled){
      if(isInstalled){
        return(
            ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: [
                    g_Lan.share_photo_to_time_line(),
                    g_Lan.share_link_to_time_line(),
                    g_Lan.share_link_to_session(),
                    g_Lan.cancel()
                  ],
                  cancelButtonIndex: 3,
                  title: g_Lan.wechat()
                },
                (actionIndex)=>{
                  if(actionIndex==0){
                    _this._sharePhotoToWXTimeLine(thing);
                  } else if(actionIndex==1){
                    _this._shareAppExtendToWXTimeLine(thing);
                  } else if (actionIndex == 2){
                    _this._shareAppExtendToWXSession(thing);
                  }
                }
            )
        )
      } else {
        AlertIOS.alert(g_Lan.information(), g_Lan.MSG_INSTALL_WECHART());
      }
    })
  },
  _renderFacebookShareActionSheet: function(thing){

    return(
      ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [
              g_Lan.share_photo_to_time_line(),
              g_Lan.share_link_to_time_line(),
              g_Lan.cancel()
            ],
            cancelButtonIndex: 2,
            title: g_Lan.facebook()
          },
          (actionIndex)=>{
            if(actionIndex==0){
              this._sharePhotoToFBTimeLine(thing);
            } else if(actionIndex==1){
              this._shareLinkToFBTimeLine(thing);
            }
          }
      )
    )
  },

  render:function(){

    let shape = require('image!icon-black-favor');

    let favorFunc = this._checkIsMyThingBeforeAdd;

    if (this.state.isFavor==true) {
      shape = require('image!icon-yellow-favor');
      favorFunc = this._deleteFavor;
    }

    if(this.state.isWaiting==true){
      favorFunc = ()=>{}
    }

    let infoImage = this.props.selected === "information" ?
        require('image!icon-yellow-information') :require('image!icon-black-information');

    let locateImage = this.props.selected === "location" ?
        require('image!icon-yellow-location') :require('image!icon-black-location');

    let commentImage = this.props.selected === "comment" ?
        require('image!icon-yellow-comment') :require('image!icon-black-comment');

    let shareImage = this.props.selected === "share" ?
        require('image!icon-yellow-share') :require('image!icon-black-share');


    return(

      <View style={styles.toolBar}>
        <TouchableOpacity
            style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}
            onPress={this._jumpToThingDetail}>
          <Image style={[styles.toolBarIconPng]}  source={infoImage}/>
          <Text style={[
            {fontSize:10},
            this.props.selected === "information" ? {color:"orange"}:null]}>
            {g_Lan.toolbar_information()}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
            style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}
            onPress={this._jumpToThingLocation}>
          <Image style={styles.toolBarIconPng} source={locateImage}/>
          <Text style={[
            {fontSize:10},
            this.props.selected === "location" ? {color:"orange"}:null]}>
            {g_Lan.toolbar_location()}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
            style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}
            onPress={()=>{this._jumpToComment(this.props.thing)}}>
          <Image style={styles.toolBarIconPng} source={commentImage}/>
          <Text style={[
            {fontSize:10},
            this.props.selected === "comment" ? {color:"orange"}:null]}>
            {g_Lan.toolbar_comment()}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
            style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}
            onPress={()=>{this._showShareActions(this.props.thing)}}
        >
          <Image style={styles.toolBarIconPng} source={shareImage}/>
          <Text style={[
            {fontSize:10},
            this.props.selected === "share" ? {color:"orange"}:null]}>
            {g_Lan.toolbar_share()}
          </Text>
        </TouchableOpacity>

        {

          this.state.isWaiting ? <IndicatorView/> :
              <TouchableOpacity
                  style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}
                  onPress={favorFunc}>
                <Image style={styles.toolBarIconPng} source={shape}/>


                <Text style={{fontSize:10}}>{g_Lan.toolbar_favor()}</Text>
              </TouchableOpacity>
        }
      </View>
    )
  }
});

module.exports = ThingToolBar;
