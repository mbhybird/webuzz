'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    NativeAppEventEmitter,
    NativeModules,
    AlertIOS
} = React;

var Dimensions = require('Dimensions');
var AppLogin = NativeModules.AppLogin;
var WeChatAPI = require('react-native-wx/index.js');
// var ThingsView = require('../HomePage/ThingsView');
var FBLogin = require('react-native-fbsdklogin');
var UnderLine = require('../UnderLine');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Icon = require('react-native-vector-icons/FontAwesome');

var windowWidth = Dimensions.get('window').width;
var ImagePickerManager = NativeModules.ImagePickerManager;

var {
    FBSDKLoginButton
} = FBLogin
var FBLoginManager = require('NativeModules').FBSDKLoginManager;
var FBSDKCore = require('react-native-fbsdkcore');
var {
    FBSDKAccessToken,
    FBSDKGraphRequest,
} = FBSDKCore;


var EventEmitterMixin = require('react-event-emitter-mixin');

var Login = React.createClass({

    mixins: [EventEmitterMixin],

    _handleRequest: function (error, result) {
        alert(JSON.stringify(result));
    },

    _facebookLoginInfoGet: function (error, result) {
        if (result) {
            let _this = this;
            let photo = result.picture.data.url;
            let facebookObject = {
                headimgurl: photo,
                id: result.id,
                name:result.name
            };

            let gender = result.gender.substr(0, 1).toLowerCase();

            AppLogin.facebookLoginWithInfo('', result.name, '', '', gender, null, facebookObject, function (data) {
                if (data && data == 'success') {
                    // _this.props.name();
                    _this._getUserInfoFromNative(_this._putUpdateUserInfo);
                }
                if(_this.props.unloading){
                    _this.props.unloading();
                }
            });
        }
    },

    getInitialState: function () {
        return {
            userid: '',
            password: '',
            userName:'',
            nickName:'',
            wxNickName:'',
            fbNickName:'',
            userInfo:{},
            infoChanged:false,
            isShowOK:true,
        }
    },

    componentDidMount:function(){
        let _this = this;
        this._getUserInfoFromNative();
        NativeAppEventEmitter.addListener('WeChat_Resp',(resp)=>{
            // console.log(this.state.isChecked);
            // this.setState({
            //     isLoading:true
            // });

            AppLogin.wxLoginWithRespInfo(resp,()=>{
                // this.setState({isChecked:false,isLoading:false})

                _this._getUserInfoFromNative(_this._putUpdateUserInfo);
            })
        });
        this.eventEmitter('on','LogOut',()=>{
            this._getUserInfoFromNative();
        })
        if(this.props.isShowOK==false){
            this.setState({
                isShowOK:false
            })
        }
    },
    componentWillUnmount: function(){
        if(this.state.infoChanged){

            _this._putUpdateUserInfo(_this.state.userInfo);
            AppLogin.refreshUserInfo(_this.state.userInfo);

            this.setState({
                infoChanged:false
            });
        }
    },
    _getUserInfoFromNative:function(callback){
        let _this = this;
        AppLogin.getUserInfoFromNative(function(data){
            if(data){
                _this.setState({
                   nickName:data.nickname,
                   wxNickName:data.wechat?data.wechat.nickname:"",
                   fbNickName:data.facebook?data.facebook.name:"",
                   userInfo:data
                });

                if(callback){
                    callback(data);
                }
            }else{
                _this.setState({
                    nickName:'',
                    wxNickName:"",
                    fbNickName:"",
                    userInfo:{}
                });
            }
        });
    },

    _putUpdateUserInfo:function(data) {

        let url = g_ConstInfo.WEBUZZ_API_USERS(data._id);

        fetch(url, {

            method: 'PUT',

            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

            body:JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                console.log(res.message);
            });
    },

    changeFocus: function () {

    },

    _setLoading: function () {
        this.props.loading();
    },

    _handleLogin: function(){
        var _this = this;
        AppLogin.getUserInfoFromNative(function(loginInfo) {
            if(!loginInfo || !loginInfo.facebook) {
                // FBLoginManager.logInWithReadPermissions(['read_stream', 'user_birthday'], function (error, data) {
                FBLoginManager.logInWithPublishPermissions(["publish_actions"], function (error, data) {
                    if (!error) {
                        // _this.setState({ user : data});
                        // _this.props.onLogin && _this.props.onLogin();
                        FBSDKAccessToken.getCurrentAccessToken((event)=> {
                            if(event){
                                var profileRequest = new FBSDKGraphRequest(
                                    _this._facebookLoginInfoGet,
                                    '/' + event.userID,
                                    {
                                        type: {string: 'public_profile'},
                                        fields: {string: 'id,name,picture,gender'}
                                    }
                                );
                                profileRequest.start();
                            }
                        });
                    } else {
                        console.log(error, data);
                    }
                });
            }
        });
    },

    _handleLogout: function(){
        var _this = this;
        FBLoginManager.logout(function(error, data){
            if (!error) {
                _this.setState({ user : null});
                _this.props.onLogout && _this.props.onLogout();
            } else {
                console.log(error, data);
            }
        });
    },

    _wechatLogin: function () {
        // this._setLoading();
        AppLogin.getUserInfoFromNative(function(data) {
            if(!data || !data.wechat) {
                WeChatAPI.login();
            }
        });
    },
    _selectPhoto:function(){

        const options = {
            title: 'Photo Picker',
            quality: 0.5,
            maxWidth: 300,
            maxHeight: 300,
            allowsEditing:true,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePickerManager.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // this.props.updatePhotos(m_photoData);
                let userinfo = this.state.userInfo;
                userinfo.photo = response.data;

                this.setState({
                    userInfo:userinfo,
                    infoChanged:true
                });
            }
        });
    },

    render: function () {
        // return (
        //     <View style={{flex:1,flexDirection:"column",justifyContent:"center",alignItems:"center", backgroundColor:'#fafafa'}}>
        //
        //         <View style={styles.header}>
        //
        //         </View>
        //
        //         <View style={{flex:0.6,flexDirection:'column',justifyContent:"flex-end"}}>
        //             <TouchableOpacity
        //                 onPress={this.props.name}
        //                 style={{margin:5}}
        //             >
        //                 <Text style={{color:'blue'}}>Cancel</Text>
        //             </TouchableOpacity>
        //         </View>
        //
        //         {/*<View style={styles.cont1}>
        //
        //             <View style={{flex:0.01,borderTopWidth:0.3}}></View>
        //
        //             <View style={{flex:1}}>
        //
        //                 <TextInput
        //                     placeholder={' Please input userid'}
        //                     style={[styles.login]}
        //                     onChangeText={
        //                         (data)=>this.setState({userid:data})
        //                     }/>
        //             </View>
        //
        //             <View style={{flex:0.01,borderBottomWidth:0.3}}></View>
        //
        //             <View style={[{flex:1}]}>
        //                 <TextInput
        //                     placeholder={' Please input password'}
        //                     secureTextEntry={true}
        //                     style={[styles.login]}
        //                     onChangeText={(data)=> this.setState({password:data}) }/>
        //             </View>
        //
        //             <View style={{flex:0.01,borderBottomWidth:0.3}}></View>
        //
        //         </View>*/}
        //
        //         {/*<View style={styles.cont2}>
        //             <View style={{flex:1}}></View>
        //             <View style={styles.login_loginout_view}>
        //                 <TouchableOpacity
        //                     style={styles.touchhl} underlayColor="#fd5"
        //                     onPress={				//登录 Login
        //                         ()=>{
        //                           this._setLoading();
        //                           AppLogin.loginWithUseridandPassword(this.state.userid, this.state.password,
        //                           (data)=>{
        //                             if (data==='success') {
        //                               this.props.name();
        //                             }else{
        //                               alert('登录失败，请核对帐号密码信息！')
        //                             }
        //                             this.props.unloading();
        //                           })
        //                         }
			// 		  }>
        //                     <Image
        //                         style={[styles.login_loginout_text]}
        //                         source={require('image!login')}
        //                     />
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={{flex:1}}></View>
        //             <View style={styles.login_loginout_view}>
        //                 <TouchableOpacity
        //                     style={styles.touchhl} underlayColor="#fd5"
        //                     onPress={()=>{
        //                         AppLogin.signUpWithUseridandPassword(this.state.userid, this.state.password, (data)=>{
        //                           if (data=='success') {
        //                             alert('注册成功')
        //                           }else{
        //                             alert('该用户名已经注册，请重新注册！')
        //                           }
        //                         })
        //                       }
			// 		    }>
        //                     <Image
        //                         style={[styles.login_loginout_text]}
        //                         source={require('image!SignUp')}
        //                     />
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={{flex:1}}></View>
        //
        //         </View>
        //
        //         <View style={{flex:4.5}}></View>*/}
        //
        //         <View style={{flex:0.5, alignItems:'center'}}>
        //             <Text style={{fontSize:10, color:'#CFC2C2'}}>第三方帐号登录</Text>
        //         </View>
        //
        //         <View style={styles.cont3}>
        //             <View style={{flex:1}}></View>
        //
        //
        //             {/*<Image
        //              style={{width:63.5, height:63.5}}
        //              source={require('image!facebook')} />*/}
        //             <FBSDKLoginButton
        //                 onLoginFinished={
        //                     (error, result) => {
        //                         if (error) {
        //                             alert('Error logging in.');
        //                             this.props.unloading();
        //                         } else {
        //                             if (result.isCancelled) {
        //                               alert('Login cancelled.');
        //                               this.props.unloading();
        //                             } else {
        //                               this.props.loading();
        //                               //alert('login');
        //                               console.log(result);
        //                               // alert('Logged in.');
        //                               FBSDKAccessToken.getCurrentAccessToken((event)=>{
        //                                 // AppLogin.getFacebookUserinfo( event.tokenString, (res)=>{
        //                                 // 	console.log(res);
        //                                 // });
        //                                 // console.log(event);
        //                                 var profileRequest = new FBSDKGraphRequest(
        //                                 this._facebookLoginInfoGet,
        //                                 '/'+ event.userID,
        //                                 {
        //                                   type: { string: 'public_profile' },
        //                                   fields: { string: 'id,name,picture,gender' }
        //                                 }
        //                                 );
        //                                 profileRequest.start();
        //                               });
        //                             }
        //                         }
        //                     }
        //                 }
        //                 onWillLogin={() => {
        //                   return true;
        //                 }}
        //                 onLogoutFinished={() => alert('Logged out.')}
        //                 readPermissions={['read_stream','user_birthday']}
        //                 publishPermissions={['publish_actions']}/>
        //
        //
        //             <View style={{flex:1}}></View>
        //
        //             <TouchableOpacity
        //                 onPress={this._wechatLogin}
        //
        //                 //WeChat_Resp={()=>{this.props.name()}}
        //                 style={styles.facebook_wechat_logo}>
        //                 <Image
        //                     style={styles.facebook_wechat_logo}
        //                     source={require('image!wechat')}/>
        //             </TouchableOpacity>
        //             <View style={{flex:1}}></View>
        //         </View>
        //     </View>
        // );
        let _this = this;
        let angleRight = <Icon name="angle-right" style={{margin:5}} size={30} color="gainsboro" />;
        let userPhoto = require('image!img-user-photo');
        if(this.state.userInfo && this.state.userInfo.photo){
            userPhoto = {uri:g_ConstInfo.IMAGE_BASE64_PREFIX+this.state.userInfo.photo};
        }
        return(
            <View style={{flex:1}}>

                <View style={{height:60,width:windowWidth,flexDirection:"column",justifyContent:"flex-end"}}>
                    <View style={{
                        flexDirection:'row',
                        justifyContent:'flex-end',
                        width:windowWidth-10,
                        marginRight:5
                    }}>
                        {
                            this.state.isShowOK === false? null :
                            <TouchableOpacity
                                onPress={()=>{
                                if(this.state.infoChanged){

                                    _this._putUpdateUserInfo(_this.state.userInfo);
                                    AppLogin.refreshUserInfo(_this.state.userInfo);

                                    this.setState({
                                        infoChanged:false
                                    });
                                }
                                if(this.props.name){
                                    this.props.name()
                                }
                            }}
                                style={{
                                margin:5,
                                height:60,
                                flexDirection:'column',
                                justifyContent:"flex-end",
                                width:60,
                                alignItems:"flex-end"
                            }}

                            >
                                <Text style={{color:'blue',fontSize:18}}>OK</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>

                <View
                    style={{
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center',
                            height:windowWidth/2
                        }}
                >
                    <TouchableOpacity
                        onPress={this._selectPhoto}
                    >
                        <Image source={userPhoto} style={{height:80,width:80,borderRadius:40}}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={()=>
                            AlertIOS.prompt(
                                'Nick Name',
                                '',
                                function(data){
                                    let userinfo = _this.state.userInfo;
                                    userinfo.nickname = data;
                                    _this.setState({
                                        nickName:data,
                                        userInfo:userinfo,
                                        infoChanged:true
                                    });
                                },
                                'plain-text',
                                _this.state.nickName,
                            )
                        }
                    >
                        <Text
                            style={{margin:10,fontSize:15}}
                        >
                            {this.state.nickName}
                        </Text>
                    </TouchableOpacity>

                </View>
                {/*<View style={{width:windowWidth,height:20,backgroundColor:"aliceblue"}}/>*/}
                <View style={{height:20, alignItems:'center'}}>
                    <Text style={{fontSize:10, color:'#CFC2C2'}}>Link Accounts</Text>
                </View>

                <View
                    style={{
                        width:windowWidth,
                        flexDirection:"column",
                        justifyContent:"center"
                    }}
                >

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={this._wechatLogin}
                    >

                        <View
                            style={styles.linkRowLeft}
                        >
                            <Image  style={{height:40,width:40}}  source={require('image!wechat')}/>
                        </View>


                        <View style={styles.linkMiddle}>
                            <Text>Wechat</Text>
                        </View>

                        <View
                            style={styles.linkRowRight}
                        >
                            {
                                this.state.wxNickName===""? angleRight:
                                <Text style={{color:'#CFC2C2'}}>{this.state.wxNickName}</Text>
                            }
                        </View>

                    </TouchableOpacity>

                    <UnderLine color={'aliceblue'}/>

                    <TouchableOpacity
                        style={styles.linkRow}
                        onPress={
                            this._handleLogin
                        }
                    >

                        <View
                            style={[styles.linkRowLeft]}
                        >
                            {<Image  style={{height:40,width:40}}  source={require('image!facebook')}/>}
                        </View>

                        <View style={styles.linkMiddle}>
                            <Text>Facebook</Text>
                        </View>


                        <View
                            style={styles.linkRowRight}
                        >
                            {
                                this.state.fbNickName===""? angleRight :
                                <Text style={{color:'#CFC2C2'}}>{this.state.fbNickName}</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <UnderLine color={'aliceblue'}/>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    touchhl: {
        //backgroundColor:'#f38',
        width: 80,
        height: 30,
        borderRadius: 18,

    },

    linkRow:{
        width:windowWidth-10,
        height:50,
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    linkRowLeft:{
        // flex:1,
        flexDirection:"row",
        justifyContent:"flex-start",
        marginLeft:20
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
        marginRight:10

    },

    header: {
        height: 20,
        flexDirection:'column',
        justifyContent:"flex-end",

    },
    loin_logout: {
        flex: 1,
        //backgroundColor:'555',
        alignItems: 'center',
        flexDirection: 'row',
    },

//-----
    cont3: {
        flex: 2,
        flexDirection: 'row',
        // backgroundColor:'#777',
    },
    facebook_wechat_logo: {
        width: 60,
        height: 60,

    },
    facebook_wechat: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 16,
    },

//---
    cont2: {
        flex: 1.5,
        flexDirection: 'row',
        // backgroundColor:'#888',
    },
    login_loginout_text: {
        borderRadius: 5,
        width: 140,
        height: 60,
    },
    login_loginout_view: {
        marginTop: 30,
        width: 140,
        height: 50,
    },

//---
    cont1: {
        flex: 2,
        backgroundColor: 'white',
    },
    inputstyle: {
        flex: 1,
        justifyContent: 'center',
    },
    login: {
        width: Dimensions.get('window').width,
        height: 55,
        marginLeft: 10,
    },

});

module.exports = Login
