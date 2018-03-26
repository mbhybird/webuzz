'use strict';

var React = require('react-native');
var HomePage = require('./HomePage');
//var ThingsList = require('../ThingsList/ThingsList');
var Logout = require('../Login/Logout');
var Profile = require('./Profile');
var SettingPage = require("./SettingPage");
var AppLogin = require('react-native').NativeModules.AppLogin;
var FBLoginManager = require('react-native').NativeModules.FBSDKLoginManager;
var ThingMainNavigator = require('./ThingMainNavigator');

// var LocationNavigator = require("../Location/LocationNavigator");
// var SearchNavigator = require("../Search/SearchNavigator");
// var FavorNavigator = require("../Favor/FavorNavigator");
// var FriendsNavigator = require("../Friends/FriendsNavigator");


var Dimensions = require('Dimensions');
var AppNavigator = require('react-native/../../components/AppNavigator');
var ThingsMap = require('react-native/../../components/Location/ThingsMap');
var ThingMainScreen = require('react-native/../../components/HomePage/ThingMainScreen');
var FavorThings = require('react-native/../../components/Favor/FavorThings');
var Friends = require('react-native/../../components/Friends/Friends');
var windowHeight = Dimensions.get('window').height;
var windowWidth = Dimensions.get('window').width;
var OverLay = require('react-native-overlay');
var iconWidth = (windowWidth/5);
var iconSize = 25;

var storageHandler = require('../../common/StorageHandler');
var g_Lan = require('../../common/LanguagePackage');
var Tabs = require('react-native-tabs');
var {
	StyleSheet,
	Text,
	View,
	Image,
    TouchableOpacity,
} = React;
let thingMain = <ThingMainNavigator thingsNearBy={this._thingsNearBy}/>;
var EventEmitterMixin = require('react-event-emitter-mixin');
var SearchBar = require('react-native/../../components/Search/SearchBar');
var Search = require('react-native/../../components/Search/SearchPage');
// var SearchBar = require('react-native-search-bar');

var  TabIcon = React.createClass ({

  mixins:[g_Lan.MutiLanguageMixin],

  getInitialState:function(){
    return{
      tabBarIconLeft:0
    }
  },

  viewStyle:{

    tabStyle:{
      flex:1,
      width:windowWidth/5,
      alignItems:"center",
      justifyContent:"center",
      flexDirection:"column",
    },
    tabIconStyle:{
      height:30,
      width:30,
      // backgroundColor:"white"
    },
    badgeIconStyle:{
      alignItems:"center",
      justifyContent:"center",
      width:20,
      height:20
    },
    badgeTextStyle:{
      backgroundColor:"transparent",
      color:"orange",
      fontSize:9,
      textAlign:"center"
    }

  },

  badgeStyle:function(){
    return {
      position:"absolute",
      top:-1,
      left:this.state.tabBarIconLeft?this.state.tabBarIconLeft:0,
      overflow:"visible"
    }
  },

  tabTextStyle:function(){
    return {
      color: this.props.selected ? "orange" :"black",
      fontSize:10
    }
  },

  _renderBadgeIcon:function(){
    return (
        <View style={this.badgeStyle()}>
          <Image style={this.viewStyle.badgeIconStyle} source={require('image!icon-badge')}>
            <Text style={this.viewStyle.badgeTextStyle}>
              {this.props.badgeValue}
            </Text>
          </Image>
        </View>
    );
  },

  _onImageLayOut:function(e){
    let layout = e.nativeEvent.layout;
    this.setState({
      tabBarIconLeft:layout.x+layout.width-2
    });
  },

  render:function(){
    let imageSource = this.props.selected ? this.props.iconSelected : this.props.icon;
    return (
        <View style={this.viewStyle.tabStyle}>
          {(this.props.badgeValue !== undefined && this.props.badgeValue>0)?this._renderBadgeIcon():null}

          <Image onLayout={this._onImageLayOut} style={this.viewStyle.tabIconStyle} source={imageSource}/>
          <Text style={this.tabTextStyle()}>
            {this.props.renderTitle()}
          </Text>
        </View>
    );
  }
});


var HomeTabBar=React.createClass({

  mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],

  getInitialState:function(){
    return{
      selectedTab:"home",
      nearByCount:0,
      closeTabBar:false,
      favorLeftButton:false
    }
  },


  componentDidMount:function(){
    this._getUserId();
    this.eventEmitter('on','jumptofavor',function(){
      this.setState({
        selectedTab:"favor",
        favorLeftButton:true
      });
    });
  },

  componentWillMount:function(){
    this._onTabBarClose();
    this._onTabbarOpen();
  },

  _onTabBarClose:function(){
    this.eventEmitter('on','closeTabBar',function(action){
      if(action && action != ""){
        if(action=="nearBy" && this.state.selectedTab != "home"){
          return
        }
      }
      if(this.state && this.state.closeTabBar==false){
        this.setState({
          closeTabBar:true
        });
      }
    });
  },

  _onTabbarOpen:function(){
    this.eventEmitter('on','openTabBar',function(){
      if(this.state && this.state.closeTabBar==true){
        this.setState({
          closeTabBar:false
        });
      }
    });
  },

  _setCheckState:function(){
      this.props.name();
  },

  _logOut:function(){
    FBLoginManager.logOut(()=>
    {
      this._setCheckState()
    });
    AppLogin.logoutApp();
    this._setCheckState();
  },

  _getUserId:function(){
    let _this = this;
    AppLogin.getUserIdFromNative(function(data){
      if(data)
      {
        _this.setState({
          userid:data,
        });
        storageHandler.refreshFavorsRelatedFromURL(data);
        storageHandler.refreshMyThingsHashFromURL(data);
      }
    })
  },

  _thingsNearBy:function(things){
    if(things)
    {
      this.setState({nearByCount:things.length})
    }
    else {
      this.setState({nearByCount:0})
    }
    this.eventEmitter('emit','nearByUpdated',things);

  },

  _favorBackToHome: function(route, navigator, index, navState) {
      let _this = this;
      if(this.state.favorLeftButton==false){
          return null
      }
      return (
          <View style={{height:30,flexDirection:"column",justifyContent:"flex-end"}}>
              <TouchableOpacity
                  onPress={()=>{
                      _this.setState({
                        selectedTab:"home"
                      })
                  }}
                  style={styles.navBarLeftButton,{width:100,marginLeft:5}}>
                <Image style={{width:25,height:25}} source={require('image!icon-black-angelleft')}/>
              </TouchableOpacity>
          </View>
      );
  },

  _thingsNearByCount:function(){
    if(this.state.nearByCount>0)
    {
      return this.state.nearByCount;
    }
    else {
      return;
    }
  },

  _tabShowHide:function(tabName){
    return this.state.selectedTab == tabName? styles.tabShow : styles.tabHide;
  },

  _favorTabed:function(){
    this.eventEmitter('emit','FavorTabed');
  },

  _friendsTabed:function(){
    this.eventEmitter('emit','FriendsTabed');
  },

  _renderHomePageLeftButton:function(route, navigator, index, navState) {
      let Categories = require('react-native/../../components/HomePage/Categories');
      return (
          <View style={{height:30,flexDirection:"column",justifyContent:"flex-end"}}>
            <TouchableOpacity
                onPress={()=>{
                  navigator.push({component:Categories,renderName:g_Lan.categories});
                }}
                style={[styles.navBarLeftButton,{width:100,marginLeft:5}]}>
              <Text style={{fontSize:15,color:"grey"}}>{g_Lan.categories()}</Text>
            </TouchableOpacity>
          </View>
      );
  },

  render:function(){
    // return(
    //   <View style={{flex:1}}>
    //     {this._renderLocationBadge()}
    //     <TabBarIOS
    //       tintColor={"orange"}
    //       hidden={this.state.closeTabBar}
    //       barTintColor={"#F1F2F2"}
    //     >
    //       {/*this._renderTestBadge()*/}
    //       <TabBarIOS.Item
    //         icon={require('image!icon-home')}
    //         iconSize={10}
    //         title={g_Lan.tab_bar_home()}
    //         selected={this.state.selectedTab==="home"}
    //         badge={null}
    //         onPress={()=>{
    //           this.setState({
    //             selectedTab:"home"
    //           });
    //           this.eventEmitter('emit','HomeTabed');
    //           // alert("home");
    //         }}
    //       >
    //         <ThingMainNavigator thingsNearBy={this._thingsNearBy}/>
    //         {/*<ThingMainScreen navigator={this.props.navigator}/>*/}
    //       </TabBarIOS.Item>
    //       <TabBarIOS.Item
    //         icon={require('image!icon-location')}
    //         title={g_Lan.tab_bar_location()}
    //         selected={this.state.selectedTab==="pin"}
    //         onPress={()=>{
    //           this.setState({
    //             selectedTab:"pin"
    //           });
    //           this.eventEmitter('emit','locationTab');
    //         }}
    //       >
    //         <LocationNavigator/>
    //       </TabBarIOS.Item>
    //       <TabBarIOS.Item
    //         icon={require('image!icon-favor')}
    //         title={g_Lan.tab_bar_favor()}
    //         selected={this.state.selectedTab==="web"}
    //         onPress={()=>{
    //           this.setState({
    //             selectedTab:"web"
    //           });
    //           this.eventEmitter('emit','FavorTabed');
    //           console.log('FavorTabed');
    //         }}
    //       >
    //         <FavorNavigator/>
    //       </TabBarIOS.Item>
    //       <TabBarIOS.Item
    //         icon={require('image!icon-friends')}
    //         title={g_Lan.tab_bar_friends()}
    //         selected={this.state.selectedTab==="friends"}
    //         onPress={()=>{
    //           this.setState({
    //             selectedTab:"friends"
    //           });
    //         }}
    //       >
    //         <FriendsNavigator/>
    //       </TabBarIOS.Item>
    //       <TabBarIOS.Item
    //         icon={require('image!icon-search')}
    //         title={g_Lan.tab_bar_search()}
    //         selected={this.state.selectedTab==="search"}
    //         onPress={()=>{
    //           this.setState({
    //             selectedTab:"search"
    //           });
    //         }}
    //       >
    //         <SearchNavigator/>
    //       </TabBarIOS.Item>
    //     </TabBarIOS>
    //   </View>
    // )
    let _this = this;
    // if(this.state.mixinStateCurrentLanguageIndex==null)
    // {
    //   return null
    // }
    return (
      <View style={{flex:1}}>

        <View style={this._tabShowHide("home")}>
          <AppNavigator
              mainScreenLeftButton = {this._renderHomePageLeftButton}
              ref = {(c)=>this.homeNavigator = c}
              renderTitle={()=>g_Lan.tab_bar_home()}
              mainScreen={ThingMainScreen}
              thingsNearBy={this._thingsNearBy}/>
        </View>
        <View style={this._tabShowHide("location")}>
        {
          <AppNavigator
              renderTitle={()=>g_Lan.tab_bar_location()}
              mainScreen={ThingsMap}/>
        }
        </View>
        <View style={this._tabShowHide("favor")}>
        {
          <AppNavigator
              mainScreenLeftButton = {this._favorBackToHome}
              renderTitle={()=>g_Lan.tab_bar_favor()}
              mainScreen={FavorThings}/>
        }
        </View>
        <View style={this._tabShowHide("friends")}>
        {
          <AppNavigator
              renderTitle={()=>g_Lan.tab_bar_friends()}
              mainScreen={Friends}/>
        }
        </View>
        <View style={this._tabShowHide("search")}>
        {
          <AppNavigator
              renderComponentTitle = {()=>{ return <SearchBar/> }}
              renderTitle={()=>g_Lan.tab_bar_search()}
              mainScreen={Search}/>

        }
        </View>

        {
          //控制Tabbar开关
          this.state.closeTabBar ? null:
          <Tabs selected={this.state.selectedTab} style={{backgroundColor:'#F1F2F2'}}
            onSelect={el=>{
              //Set select state
              _this.setState({
                selectedTab:el.props.name,
                favorLeftButton:false
              });
              //Pop to top
              if(el.props.name=="home"){
                _this.homeNavigator.refs.nav.popToTop();
              } else if(el.props.name=="favor"){
                _this._favorTabed();
              } else if (el.props.name=="friends"){
                _this._friendsTabed();
              }
            }}
          >
            <TabIcon
              name={'home'}
              renderTitle={()=>{return g_Lan.tab_bar_home()}}
              iconSelected={require('image!icon-tabbar-home-selected')}
              icon={require('image!icon-tabbar-home')}/>
            <TabIcon
              name={'location'}
              renderTitle={()=>{return g_Lan.tab_bar_location()}}
              iconSelected={require('image!icon-tabbar-location-selected')}
              icon={require('image!icon-tabbar-location')}
              badgeValue={this.state.nearByCount}/>
            <TabIcon
                name={'favor'}
                renderTitle={()=>{return g_Lan.tab_bar_favor()}}
                iconSelected={require('image!icon-tabbar-favor-selected')}
                icon={require('image!icon-tabbar-favor')}/>
            <TabIcon
              name={'friends'}
              renderTitle={()=>{return g_Lan.tab_bar_friends()}}
              iconSelected={require('image!icon-tabbar-friends-selected')}
              icon={require('image!icon-tabbar-friends')}/>
            <TabIcon
              name={'search'}
              renderTitle={()=>{return g_Lan.tab_bar_search()}}
              iconSelected={require('image!icon-tabbar-search-selected')}
              icon={require('image!icon-tabbar-search')}/>
          </Tabs>
        }
      </View>
    )
  }
});


const styles = StyleSheet.create({
  tabShow:{
    flex:1
  },
  tabHide:{
    width:0,
    height:0,
    overflow:"hidden"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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



module.exports = HomeTabBar;
