'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	TextInput,
	Image,
} = React;

var AppLogin = require('react-native').NativeModules.AppLogin;
var FBLoginManager = require('react-native').NativeModules.FBSDKLoginManager
var EventEmitterMixin = require('react-event-emitter-mixin');
var storageHandler = require('../../common/StorageHandler');
// var Login = require('../Login/Login');
var getUrl = "http://things.buzz/webuzz/";
var userInfo = {
  country:"",
  city:"",
  userid:"",
  openid:"",
  headimgurl:"",
  unionid:"",
  province:"",
  sex:"",
  language:"",
  nickname:""
}

var Profile = React.createClass({

    mixins:[EventEmitterMixin],

	getInitialState:function(){
		return {
      userInfo:{}
		}
	},
  _setProfileInfo:function(responseData)
  {
    if(responseData){
      if(responseData.country)
      {
        userInfo.country = responseData.country;
      }
      if(responseData.city)
      {
        userInfo.city = responseData.city;
      }
      if(responseData.userid)
      {
        userInfo.userid = responseData.userid;
      }
      if(responseData.openid)
      {
        userInfo.openid = responseData.openid;
      }
      if(responseData.wechat && responseData.wechat.headimgurl)
      {
        userInfo.headimgurl = responseData.wechat.headimgurl;
      }
      if(responseData.unionid)
      {
        userInfo.unionid = responseData.unionid;
      }
      if(responseData.province)
      {
        userInfo.province = responseData.province;
      }
      if(responseData.gender)
      {
        userInfo.sex = responseData.gender.toUpperCase();
      }
      if(responseData.userid)
      {
        userInfo.userid = responseData.userid;
      }
      if(responseData.language)
      {
        userInfo.language = responseData.language;
      }
      if(responseData.nickname)
      {
        userInfo.nickname = responseData.nickname;
      }
      this.setState({
        userInfo:userInfo
      });
    }
  },
  _getProfileInfoFromNative:function()
  {
    AppLogin.getUserInfoFromNative((responseData)=>{this._setProfileInfo(responseData)});
  },
  componentWillMount:function(){
    this._getProfileInfoFromNative();
  },
	_setCheckState:function(){
		this.props.logOut();
	},
  _logOut:function(){
    FBLoginManager.logOut(()=>
    {
      this._setCheckState()
    });
    AppLogin.logoutApp();
    this._setCheckState();
    userInfo = {
      country:"",
      city:"",
      userid:"",
      openid:"",
      headimgurl:"",
      unionid:"",
      province:"",
      sex:"",
      language:"",
      nickname:""
    };
    this.eventEmitter('emit','LogOut');
      storageHandler.releaseAllStorage();
  },
	render:function(){
		return (
			<View style={styles.cont}>
				<View style={{flex:1}}></View>
				<View style={{flex:3}}>
					<Text>昵称：{userInfo.nickname}</Text>
					<Text>城市：{userInfo.city}</Text>
					<Text>性别：{userInfo.sex==="M"?'男':'女'}</Text>
					<Text>头像</Text>
					<Image style = {{height:100,width:100}}
						source = {{uri:userInfo.headimgurl}} />
				</View>

				<View style={{flex:0.5}}></View>


				<View style={{flex:0.5,borderRadius:15,backgroundColor:'#A38484',flexDirection:'row', width:180, alignItems:'center', justifyContent:'center'}}>
					{/*<Image
					 	style = {{width:30, height:30}}
          source={require(this.props.img)} />*/}
					<Text
            style={styles.contlogoutText}
            onPress={this._logOut}>  Logout</Text>
				</View>


				<View style={{flex:1}}></View>

			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
	},
	contlogoutText:{
		fontSize:30,
		textAlign:'center',
	},
});

module.exports = Profile
