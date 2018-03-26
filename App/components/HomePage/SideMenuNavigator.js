
'use strict';
var React = require('react-native');
//var SearchBar = require('./SearchBar');
var {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	ScrollView,
  Navigator,
  TouchableWithoutFeedback,
  SegmentedControlIOS,
  ListView,
  ActionSheetIOS,
  NativeModules,
    AlertIOS
} = React;

var AppLogin = require('react-native').NativeModules.AppLogin;
var Icon = require('react-native-vector-icons/FontAwesome');

var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;

var Profile = require('./Profile');

var MyThingsList = require("react-native/../../components/RegisterPage/MyThingsList");

var EventEmitterMixin = require('react-event-emitter-mixin');

var g_Lan = require('react-native/../../common/LanguagePackage');
var g_ConstInfo = require('react-native/../../constants/GlobalConstants');
var storageHandler = require('react-native/../../common/StorageHandler');
var AppNavigator = require('react-native/../../components/AppNavigator');
var UserInfoHelper = require('react-native/../../common/UserInfoHelper');
const WeChatAPI = NativeModules.WeChatAPI;
var WeChatCheck = require('react-native-wx/index.js');

var UnderLine = require('../UnderLine');

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
    height:60,
    alignItems:'center',
  },
  navBar1: {
    backgroundColor: 'white',
    height:40
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  linkRow:{
    width:windowWidth-10,
    height:50,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },

  //SettingPage
  linkRowLeft:{
    // flex:1,
    flexDirection:"row",
    justifyContent:"flex-start",
    marginLeft:10
  },
  linkMiddle:{
    flex:1,
    marginLeft:10,
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"flex-end",
    height:20
  },
  linkRowRight:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-end",
    alignItems:'center',
    marginRight:5
  },
});

var LanguageListView = React.createClass({
  mixins:[g_Lan.MutiLanguageMixin],

  getInitialState:function(){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return{
      dataSource:ds.cloneWithRows(this._getRows()),
    }
  },
  _getRows:function(){
    // let selectLan = selectLan;
    let arr = [];
    let _this = this;
    g_Lan.LANGUAGES().map(function(data,index){
      arr.push({lan:data,select:index==g_Lan.CURRENT_LAN()});
    });
    return arr;
  },
  _renderRow:function(rowData, sectionID, rowID){
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return(
      <View
        style={{
          width:windowWidth,
          flexDirection:"column",
          justifyContent:"center"
        }}>
        <TouchableOpacity
          onPress={()=>{
            g_Lan.setCurrentLan(rowID);
            this.setState({
              dataSource:ds.cloneWithRows(this._getRows()),
            })
          }}
          style={styles.linkRow}>
          <View style={[styles.linkRowLeft]}>
            <Text>{rowData.lan}</Text>
          </View>

          <View style={styles.linkMiddle}>
          </View>

          <View style={styles.linkRowRight}>
          {
              rowData.select? <Text>✅</Text>:null
          }
          </View>
        </TouchableOpacity>
        <UnderLine color={'aliceblue'}/>
      </View>
    )
  },
  render:function(){
    return(
      <ListView
        renderRow={this._renderRow}
        dataSource={this.state.dataSource}
      />
    )
  }
});

var SettingPage = React.createClass({

  mixins:[g_Lan.MutiLanguageMixin,EventEmitterMixin],
  getInitialState:function(){
    return{
      languageIndex:g_Lan.CURRENT_LAN(),
      proximityIndex:0
    }
  },

  componentDidMount: function () {
    let _this = this;
    storageHandler.getSystemSetting(storageHandler.settingName.proximity,function(data){
      _this.setState({
        proximityIndex: g_ConstInfo.PROXIMITY_VALUE(data)
      })
    })
  },

  _renderLanguageSetting:function(){
    let _this = this;
    return(
      <SegmentedControlIOS
        style={{width:220}}
        values={g_Lan.LANGUAGES()}
        selectedIndex={g_Lan.CURRENT_LAN()}
        onChange={(event)=>{
          g_Lan.setCurrentLan(event.nativeEvent.selectedSegmentIndex)
        }}
      />
    );
  },

  _renderRangeSetting:function(){
    let _this = this;
    return(
      <SegmentedControlIOS
        style={{width:220}}
        values={g_Lan.PROXIMITY()}
        selectedIndex={this.state.proximityIndex}
        onChange={(event)=>{
          // g_Lan.setCurrentLan(event.nativeEvent.selectedSegmentIndex)
          console.log(g_ConstInfo.EVENT.proximity,g_Lan.PROXIMITY(0));
          console.log(g_ConstInfo.EVENT.proximity,g_Lan.PROXIMITY(0)[event.nativeEvent.selectedSegmentIndex]);
          this.eventEmitter('emit',g_ConstInfo.EVENT.proximity,g_Lan.PROXIMITY(0)[event.nativeEvent.selectedSegmentIndex]);
        }}
      />
    );
  },

  render: function(){
    return(
      <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>
        <View
          style={{
            width:windowWidth,
            flexDirection:"column",
            justifyContent:"center"
          }}>
          <TouchableOpacity
            onPress={()=>{this.props.navigator.push({component:LanguageListView})}}
            style={styles.linkRow}>
            <View style={styles.linkRowLeft}>
              <Text>{g_Lan.language()}</Text>
            </View>

            <View style={styles.linkMiddle}>
            </View>

            <View style={styles.linkRowRight}>
              <Text>{g_Lan.LANGUAGES()[g_Lan.CURRENT_LAN()]}</Text>
            </View>
          </TouchableOpacity>

          <UnderLine color={'aliceblue'}/>

          <View style={styles.linkRow}>
            <View style={[styles.linkRowLeft]}>
              <Text>{g_Lan.language()}</Text>
            </View>

            <View style={styles.linkMiddle}>
            </View>

            <View style={styles.linkRowRight}>
              {this._renderLanguageSetting()}
            </View>
          </View>
          <UnderLine color={'aliceblue'}/>

          <View style={styles.linkRow}>
            <View style={[styles.linkRowLeft]}>
              <Text>{g_Lan.proximity()}</Text>
            </View>

            <View style={styles.linkMiddle}>
            </View>

            <View style={styles.linkRowRight}>
              {this._renderRangeSetting()}
            </View>
          </View>
          <UnderLine color={'aliceblue'}/>

        </View>

      </View>
    );
  }
});

var SideMenu = React.createClass({
  mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],
  getInitialState:function(){
    return{
      userid:"",
    }
  },
  componentDidMount:function(){
    this._getUserId();

  },
  _onInsideNavBarLeftClick:function(route, navigator, index, navState){
    if(index==0){
      this.props.navigator.pop();
    } else {
      navigator.pop();
    }
  },
  _jumpToPageWithNavigator:function(currentRoute)
  {
    let _this = this;
    var a = ()=>
    {
      return(
        <AppNavigator
            {...currentRoute.params}
            mainScreenLeftButton={"back"}
            onLeftClick={this._onInsideNavBarLeftClick}
            rightButton={(route, navigator, index, navState)=>{return null}}
            renderTitle={currentRoute.renderTitle}
            mainScreen={currentRoute.component}
            thingsNearBy={this._thingsNearBy}/>
      );
    }
    this.props.navigator.push({component:a,params:{name:this.props.name}});
  },
  _getUserId:function(callback){
    let _this = this;
    AppLogin.getUserIdFromNative(function(data){
        _this.setState({
          userid:data,
        })
        if(callback){
          callback(data);
        }
    })
  },

  _renderSettingTitle:function(){
    return g_Lan.settings();
  },

  _NavigationBarRouteMapper:function(){
    let _this = this;
    return {
      LeftButton: function(route, navigator, index, navState) {
        return (
          <TouchableOpacity
            onPress={()=>{
            if(index==0){
              _this.props.navigator.pop();
            }
            else{
              navigator.pop();
            }
            let routes = navigator.getCurrentRoutes();
            if(routes.length>=2){
              if(routes[routes.length-2].component.displayName=="Navigation"){
                _this.eventEmitter('emit','closeTabBar');
              }
              else{
                _this.eventEmitter('emit','openTabBar');
              }
            }
            }}
            style={[styles.navBarLeftButton,{width:100}]}>
            <Icon name="angle-left" style={{}} size={40} color="#5890FF" />
          </TouchableOpacity>
        );
      },
      RightButton: function(route, navigator, index, navState) {

      },

      Title: function(route, navigator, index, navState) {
        return (
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {route.name}
          </Text>
        );
      },
    }
  },

  _jumpToAddFriend:function(){
    let _this = this;
    AppLogin.getUserInfoFromNative(function(data){
      if(data){
        _this._renderSendInviteActionSheet();
      } else {
        AlertIOS.alert(g_Lan.information(), g_Lan.MSG_PLEASE_Link_Account());
      }
    })
  },

  _renderSendInviteActionSheet: function(thing){

      return(
          ActionSheetIOS.showActionSheetWithOptions(
              {
                options: [
                  g_Lan.add_friends_from_wechat(),

                  g_Lan.cancel()
                ],
                cancelButtonIndex: 2,
                title: g_Lan.wechat()
              },
              (actionIndex)=>{
                if(actionIndex==0){
                  this._renderWechatInviteActionSheet();
                }
              }
          )
      )
  },

  _shareLinkToSession: function(){

  },
  
  _renderWechatInviteActionSheet: function(){
    let _this = this;
    WeChatAPI.isWXAppInstalled(function(data,isInstalled){
      if(isInstalled){
        return(
            ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: [
                    g_Lan.send_invite_link_to_session(),
                    g_Lan.send_invite_link_to_time_line(),
                    g_Lan.cancel()
                  ],
                  cancelButtonIndex: 2,
                  title: g_Lan.wechat()
                },
                (actionIndex)=>{
                  if(actionIndex==0) {
                    _this._sendInviteLinkToSession()
                  } else if (actionIndex==1) {
                    _this._sendInviteLinkToTimeLine();
                  }
                }
            )
        )
      } else {
        AlertIOS.alert(g_Lan.information(), g_Lan.MSG_INSTALL_WECHART());
      }
    })

  },
  _sendInviteLinkToSession(){

    AppLogin.getUserInfoFromNative(function(userInfo){
      let url = g_ConstInfo.WEBUZZ_WECHAT_ADD_FRIENDS(userInfo._id);
      WeChatAPI.shareLinkToSession(url,"weBuzz 好友链接","看看好友 " + userInfo.nickname +  " 的Things",function(data){
        console.log(data);
      });
    });
  },
  _sendInviteLinkToTimeLine(){

    AppLogin.getUserInfoFromNative(function(userInfo){
      let url = g_ConstInfo.WEBUZZ_WECHAT_ADD_FRIENDS(userInfo._id);
      WeChatAPI.shareLinkToTimeLine(url,"weBuzz 好友链接","看看好友 " + userInfo.nickname +  " 的Things",function(data){
        console.log(data);
      });
    });
  },
  _jumpToProfile:function(){
    var Login = require('../Login/Login');
    this._jumpToPageWithNavigator({
      renderTitle:()=>{return g_Lan.profile()},
      component:Login,
      params:{isShowOK:false}})
  },

  _jumpToMyThing: function(){
    let _this = this;
    this._getUserId(function(data){
      _this._jumpToPageWithNavigator({
        renderTitle:()=>{return g_Lan.my_webuzz()},
        component:MyThingsList,
        params:{
          ownerId:data
        }
      });
    })
  },

  _jumpToSetting:function(){
    this._jumpToPageWithNavigator({
      renderTitle:this._renderSettingTitle,
      component:SettingPage,
      params:{
        isShowOK:false
      }
    });
  },

  _styles:{
    menuView:{
      justifyContent:'flex-start',
      alignItems:"flex-start",
      marginLeft:20
    },
    menuItemView:{
      width:windowWidth,
      flexDirection:"row",
      alignItems:"flex-end",
      alignItems:"center",height:50
    },
    backIconView:{
      height:60,
      width:windowWidth/2-25,
    },
    backIconButton:{
      flex:1,
      justifyContent:"flex-end",
      alignItems:"flex-end",
      flexDirection:"row"
    },
  },
  render:function(){
    let _this = this;
    return(
      <View style={{flex:1}}>
        <View style={this._styles.menuView}
          pointerEvents={"auto"}
          accessible={true}
          testID={"tab"}
          onAccessibilityTap={()=>{console.log("tab")}}>
          <View style={this._styles.backIconView}>
            <TouchableOpacity
                style={this._styles.backIconButton}
                onPress={_this.props.closePaner}>
              <Icon name="angle-right" size={40} color={"#808285"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={this._jumpToProfile}
            style={this._styles.menuItemView}>
            <Image style={{height:30,width:30}} source={require("image!icon-black-profile")}/>
            <Text style={{marginLeft:20,fontWeight:"normal",fontSize:15}}>{g_Lan.profile()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
              onPress={this._jumpToAddFriend}
            style={this._styles.menuItemView}>
            <Image style={{height:30,width:30}} source={require("image!icon-black-addfriends")}/>
            <Text style={{marginLeft:20,fontWeight:"normal",fontSize:15}}>{g_Lan.add_friends()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this._jumpToMyThing}
            style={this._styles.menuItemView}>
            <Image style={{height:25,width:25}} source={require("image!icon-photobar-gray-webuzz")}/>
            <Text style={{marginLeft:25,fontWeight:"normal",fontSize:15}}>{g_Lan.my_webuzz()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this._jumpToSetting}
              style={this._styles.menuItemView}>
            <Image style={{height:30,width:30}} source={require("image!icon-black-setting")}/>
            <Text style={{marginLeft:20,fontWeight:"normal",fontSize:15}}>{g_Lan.settings()}</Text>
          </TouchableOpacity>
          {
          //  <TouchableOpacity
          //  style={{width:windowWidth,flexDirection:"row",alignItems:"flex-end",alignItems:"center",height:50}}
          //  onPress={()=>{
          //  this._jumpToPageWithNavigator({component:Profile,name:"Profile",params:{logOut:_this.props.logOut}},"Profile")
          //  }}
          //  >
          //  <Image style={{height:30,width:30}} source={require("image!help")}/>
          //  <Text style={{marginLeft:20,fontWeight:"normal",fontSize:15}}>{g_Lan.help()}</Text>
          //  </TouchableOpacity>
          }
        </View>
        <TouchableOpacity
            style={{flex:1}}
            onPress={_this.props.closePaner}
        >

        </TouchableOpacity>
      </View>
    )
  }
});

module.exports = SideMenu;
