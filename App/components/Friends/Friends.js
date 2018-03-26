/**
 * Created by BrianLee on 16/6/24.
 */
'use strict';

var React = require('react-native');
var AppLogin = require('react-native').NativeModules.AppLogin;
var Icon = require('react-native-vector-icons/FontAwesome');
var UserInfoHelper = require('../../common/UserInfoHelper');
var g_ConstInfo = require('react-native/../../constants/GlobalConstants');
var g_Lan = require('react-native/../../common/LanguagePackage');
var IndicatorView = require('react-native/../../components/IndicatorView');
var storageHandler = require('react-native/../../common/StorageHandler');
var UnderLine = require('react-native/../../components/UnderLine');
var FriendDetail = require('react-native/../../components/Friends/FriendDetail');
var ThingsDetailPage = require("react-native/../../components/ThingDetails/ThingDetailMain");
var EventEmitterMixin = require('react-event-emitter-mixin');


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
    Image
} = React;

// var LoginGuidePage = React.createClass({
//     render: function () {
//         return (
//             <View style={{height:windowHeight-200,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
//                 <TouchableOpacity
//                     style={{
//             borderWidth:1,
//             borderColor:"orange",
//             // width:80,
//             height:30,
//             borderRadius:2,
//             flexDirection:'column',
//             justifyContent:'center',
//             alignItems:'center',
//           }}
//                     onPress={this.props.logIn}
//                 >
//                     <Text style={{fontSize:12,color:'orange', margin:10}}>Link Your Social Account</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }
// });

var FriendFrame = React.createClass({
    mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],
    getInitialState: function() {
        return{
            refresh:true,
            things:[],
            ownerInfo:{}
        }

    },

    componentWillMount:function(){

    },

    componentDidMount:function(){
        this._getOwnerInfo(this.props.ownerId);
        this._getOwnerThings(this.props.ownerId);
        console.log(this.props.navigator);
    },

    _getOwnerThings:function(ownerId){
        storageHandler.getOwnerThings(ownerId,(data)=>{
           this.setState({
               things:data
           });
        });
    },
    
    _getOwnerInfo:function(ownerId){
        storageHandler.getOwnerInfo(ownerId,(data)=>{
            this.setState({
                ownerInfo:data
            });
        });
    },

    _styles:StyleSheet.create({

        pageStyle:{
            flex:1,
            justifyContent:"flex-start",
            flexDirection:"row",
            alignItems:"center",
            marginTop:10,
            marginBottom:10,
        },

        contentContainerStyle:{
            flex:1,
            justifyContent:"flex-start",
            flexDirection:"row",
            alignItems:"center",
        },

        thingsImageViewStyle:{
          marginLeft:5
        },

        thingsImageStyle:{
            width:100,
            height:100
        },

    }),

    _getUserPhoto:function(){
        return UserInfoHelper.getUserPhotoWithUserInfo(this.state.ownerInfo);
    },

    _jumpToFriendDetail:function(){
      this.props.navigator.push({component:FriendDetail,params:{ownerInfo:this.state.ownerInfo,things:this.state.things}});
    },

    _jumpToThingDetail:function(thing){
        let _this = this;
        AppLogin.getUserIdFromNative(function(userid){
            _this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
        });
    },

    render:function() {
        let imageSource = this._getUserPhoto();

        return (
            <View stlye={{flex:1}}>
                <View style={this._styles.pageStyle}>

                    <TouchableOpacity
                        onPress={this._jumpToFriendDetail}
                        style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                        <HeaderImage style={{margin:10,marginBottom:0}} source={imageSource}/>
                        <Text>
                            {this.state.ownerInfo?this.state.ownerInfo.nickname:""}
                        </Text>
                    </TouchableOpacity>
                    {
                        this.state.things.length<=0?
                        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:"gray"}}>
                                {g_Lan.MSG_NO_THINGS_REGISTERED()}
                            </Text>
                        </View>

                        :

                    <ScrollView
                        style={{marginLeft:10}}
                        horizontal={true}
                        contentContainerStyle={this._styles.contentContainerStyle}>
                        {
                            this.state.things.map((thing,index)=>{
                                 return (
                                     <TouchableOpacity
                                         onPress={()=>{this._jumpToThingDetail(thing)}}
                                         key={index} style={this._styles.thingsImageViewStyle}>
                                        <Image style={this._styles.thingsImageStyle}  source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+thing.photo}}/>
                                     </TouchableOpacity>
                                 )

                            })
                        }
                    </ScrollView>
                    }
                    {   this.state.things.length<3? null :
                        <TouchableOpacity
                            onPress={this._jumpToFriendDetail}
                            style={{
                                width:40,
                                justifyContent:"center",
                                alignItems:"center",
                                flex:1/6
                            }}>
                            <Icon name="angle-right" size={40} color={"#808285"} />
                        </TouchableOpacity>
                    }
                </View>
                <UnderLine/>
            </View>
        )
    }
});


var HeaderImage = React.createClass({

    render:function(){
        return(
            <View style={[{
                width:60,
                height:60
            },this.props.style]}>
                <Image
                    source={this.props.source}
                    style={{
                        width:60,
                        height:60,
                        position:"absolute",
                        left:0,
                        top:0
                    }}
                    resizeMode={"cover"}
                />
                <Image
                    style={{
                        width:60,
                        height:60,
                    }}
                    source={require('image!img-mask-headimg')}
                />
            </View>
        );
    }

});


var Friends = React.createClass({
    mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],

    getInitialState:function(){
        return {
            isLogin:false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    },

    _showLoginPage: function () {
        let _this = this;
        UserInfoHelper.showLoginPageAndGetLoginId(function (data) {
            if (data) {
                _this.setState({
                    isLogin: true
                })
            }
        });
    },
    
    componentDidMount:function(){

        this._getFriends();

        AppLogin.getUserInfoFromNative((data)=> {
            //没有资料说明没有登录过
            if (data && data != "") {
                this.setState({
                   isLogin:true
                });
            }
        });

        this.eventEmitter("on","FriendsTabed",function(){
            this._getFriends();
        });
    },

    _getFriends: function(){
        let _this = this;
        AppLogin.getUserIdFromNative( (data) => {
            //没有资料说明没有登录过
            if (data && data != "") {
                this._getFriendsWithUserId(data,(friends)=>{

                    _this.listGetDataSource(friends);

                });
            } else {
                this.setState({
                    dataSource:new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    })
                })
            }
        });
    },

    shouldComponentUpdate: function(nextProps, nextState) {

        return (
            nextState.dataSource !== this.state.dataSource
            || nextState.isLogin !== this.state.isLogin
        )

    },

    _getFriendsWithUserId: function(id,callback){
        var url = g_ConstInfo.WEBUZZ_API_FRIENDS(id);
        console.log(url);
        fetch(url)
            .then(res=>res.json())
            .catch(err=> {
                alert('Can not get your favors.Please retry.');
                this.Loading.hidden();
            })
            .then(res=>{
                if(callback){
                    callback(res.followIds);
                }
            });
    },


    listRenderRow: function(rowData, sectionID, rowID, highlightRow){

        return (
            <FriendFrame navigator={this.props.navigator} ownerId={rowData}/>
        )
    },

    listGetDataSource: function(friendsThings){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // console.log(ds.cloneWithRows(friendsThings));
        // return this.state.dataSource.cloneWithRows(friendsThings);
        this.setState({
            dataSource:ds.cloneWithRows(friendsThings)
        });
    },

    render: function(){
        return(
            <View style={{flex:1}}>
                <IndicatorView ref={(c)=>this.Loading = c} refMode={true}/>
                {
                    this.state.dataSource ?
                <ListView
                    renderRow={this.listRenderRow}
                    dataSource={this.state.dataSource}
                />:null
                }
            </View>
        );
    }
    
});

module.exports = Friends;
