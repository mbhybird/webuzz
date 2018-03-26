'user strict'

import React, {
  StyleSheet,
  Text,
  Image,
  View,
  Navigator,
  TouchableOpacity,
  Linking,
  NativeAppEventEmitter,
} from 'react-native';
var Icon = require('react-native-vector-icons/FontAwesome');
var HomePage = require('./HomePage');
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var EventEmitterMixin = require('react-event-emitter-mixin');
var ThingMainScreen = require("./ThingMainScreen");
var g_Lan = require('../../common/LanguagePackage');

const styles = StyleSheet.create({
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
    paddingLeft: 5,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#808285',
  },
});

var ThingMainNavigator = React.createClass({
  mixins:[EventEmitterMixin],
  getInitialState:function(){
    return{
      isHome:true,
      hideNavigator:false,
      navigatorHeight:60,
    }
  },
  componentDidMount:function()
  {
    this.eventEmitter('on','HomeTabed',()=>{
      this.refs.nav.popToTop();
    });
  },
  _jumpToHomePage:function(){
    this.props.navigator.push({component:HomePage})
  },
  _openPanel:function(name){
      this.eventEmitter('emit','openPanel');
  },
  _closePanel:function(){
    this._drawer.close()
  },
  _NavigationBarRouteMapper:function(){
    if(this.state.hideNavigator) {
      return {
        LeftButton:function(){},
        RightButton:function(){},
        Title:function(){},
      }
    }
    var _this = this;
    return {
      LeftButton: function(route, navigator, index, navState) {
        if (route.name=="Home")
        {
          return (
            <View style={{height:30,flexDirection:"column",justifyContent:"flex-end"}}>
              <TouchableOpacity
                onPress={()=>{
                  navigator.push({component:HomePage,name:"All"});
                }}
                style={styles.navBarLeftButton,{width:100,marginLeft:5}}>
                <Text style={{fontSize:15,color:"grey"}}>{g_Lan.categories()}</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else {
          return (
              <TouchableOpacity
                onPress={() => {
                  navigator.pop();
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
      RightButton: function(route, navigator, index, navState) {
        if(index==0)
        {
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

      Title: function(route, navigator, index, navState) {
        return (
          <Text style={[styles.navBarText, styles.navBarTitleText]}>
            {index==0?g_Lan.tab_bar_home():route.name}
          </Text>
        );
      },
    }
  },
  _hideNavigator:function(){
    this.setState({
      hideNavigator:true,
      navigatorHeight:0,
    })
  },
  _showNavigator:function(){
    this.setState({
      hideNavigator:false,
      navigatorHeight:60,
    })
  },
  _navStyle:function(){
    return {
      backgroundColor: '#F1F2F2',
      height:this.state.navigatorHeight,
      alignItems:'flex-start',
    }
  },
  _renderNavigationBar:function()
  {
    return(
        <Navigator.NavigationBar
            routeMapper={this._NavigationBarRouteMapper()}
            style={this._navStyle()}
        />
    );
  },
  _renderScene:function(route, navigator){
    console.log("renderSence"+route.name);
    let ThMainScreen = route.component;
    navigator.Hide=this._hideNavigator
    navigator.Show=this._showNavigator
    return(
        <View style={{flex:1}}>
          <View style={this._navStyle()}>
          </View>
          {/*<ThMainScreen thingsNearBy={this.props.thingsNearBy} navigator={navigator} {...route.params} />*/}
          <ThMainScreen {...this.props} navigator={navigator} {...route.params} />
        </View>
    )
  },
  render:function(){
    let _this = this;
    return(
        <Navigator
          ref="nav"
          configureScene={(route, routeStack) => Navigator.SceneConfigs.HorizontalSwipeJump }
          navigationBar={this._renderNavigationBar()}
          initialRoute={{component:ThingMainScreen,name:"Home"}}
          renderScene = {this._renderScene}
        />
    )
  }
});

module.exports = ThingMainNavigator;
