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
var HomePage = require('./HomePage/HomePage');
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var EventEmitterMixin = require('react-event-emitter-mixin');
var g_Lan = require('react-native/../../common/LanguagePackage');
var TextInputState = require('TextInputState');
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
    width:40,
    height:40,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"flex-end"
  },
  navBarButtonText: {
    color: '#5890FF',
  },
});

var AppNavigator = React.createClass({

  mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],

  getInitialState:function(){
    return{
      hideNavigator:false,
      navigatorHeight:60,
    }
  },
  componentDidMount:function()
  {
    let nav = this.refs.nav;
    let _this = this;
    //监听 navigator 转换场景的事件
    nav.navigationContext.addListener('willfocus', function(context){
      _this._handleTabbarShowHide(context);
    });

    this.eventEmitter('on','HomeTabed',()=>{
      nav.popToTop();
    });
  },

  //根据 navigator context 判断 navigator 是否需要隐藏 tab bar
  _handleTabbarShowHide:function(context){
    let _this = this;
    let nav = this.refs.nav;
    if(context && context._data && context._data.route){
      let route = context._data.route;

      if(route.hideTabBar==true){
        _this.eventEmitter('emit','closeTabBar');
      }
      else{
        _this.eventEmitter('emit','openTabBar');
      }

      if(route.hideNavBar==true){
        _this._hideNavigator();
      } else {
        _this._showNavigator();
      }
    }
  },
  componentWillMount:function(){
    // Navigator.navigationContext.addListener('didfocus', function(route){
    //   alert("did")
    // })
  },
  _openPanel:function(name){
    this.eventEmitter('emit','openPanel');
  },
  _closePanel:function(){
    this._drawer.close()
  },
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   return this.props !== nextProps || this.state !== nextState;
  // },
  _leftButtonBack:function(route, navigator, index, navState){
    return (
        <TouchableOpacity
            onPress={() => {
                  navigator.pop();
                  let routes = navigator.getCurrentRoutes();
                  if(this.props.onLeftClick){
                    this.props.onLeftClick(route, navigator, index, navState);
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
        if (index==0)
        {
          if(_this.props.mainScreenLeftButton){
            if (_this.props.mainScreenLeftButton=="back"){
              return _this._leftButtonBack(route, navigator, index, navState)
            } else {
              return _this.props.mainScreenLeftButton(route, navigator, index, navState);
            }

          }
        }
        else {
          return _this._leftButtonBack(route, navigator, index, navState)
        }
      },
      RightButton: function(route, navigator, index, navState) {
        if(_this.props.rightButton){
          return _this.props.rightButton(route, navigator, index, navState);
        }
        if(index==0)
        {
          return (
              <TouchableOpacity
                  onPress={()=>{
                    _this._openPanel(route.name);
                    TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
                  }}
                  style={[styles.navBarRightButton]}>
                <Image style={{width:25,height:25}} source={require('image!icon-black-sidebar')}/>
              </TouchableOpacity>
          );
        }
      },

      Title: function(route, navigator, index, navState) {
        if(_this.props.renderComponentTitle){
          return _this.props.renderComponentTitle()
        }
        return (
            <Text style={[styles.navBarText, styles.navBarTitleText]}>
              {route.renderName? route.renderName() :(route.name ? route.name:_this.props.renderTitle()) }
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
  _renderNavigationBar:function() {
    return(
        <Navigator.NavigationBar
            routeMapper={this._NavigationBarRouteMapper()}
            style={this._navStyle()}
        />
    );
  },
  _renderScene:function(route, navigator){
    let Component = route.component;
    navigator.Hide=this._hideNavigator;
    navigator.Show=this._showNavigator;
    // console.log("_renderScene"+route.name);
    return(
        <View style={{flex:1}}>
          <View style={this._navStyle()}>
          </View>
          <Component {...this.props} navigator={navigator} {...route.params} />
        </View>
    );
  },
  render:function(){
    let _this = this;
    return(
        <Navigator
            ref="nav"
            configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromRight}
            navigationBar={this._renderNavigationBar()}
            initialRoute={{component:this.props.mainScreen}}
            renderScene = {this._renderScene}
        />
    )
  }
});

module.exports = AppNavigator;
