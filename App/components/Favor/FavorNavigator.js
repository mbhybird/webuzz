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
var Drawer = require('react-native-drawer');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var EventEmitterMixin = require('react-event-emitter-mixin');

var FavorThings = require('./FavorThings');

var g_Lan = require('../../common/LanguagePackage');

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
});

// var Favor = React.createClass({
//   render:function(){
//     return(
//       <View style={{flex:1}}>
//         <FavorThings navigator={this.props.navigator}/>
//       </View>
//     )
//   }
// });

var FavorNavigator = React.createClass({
  mixins:[EventEmitterMixin,g_Lan.MutiLanguageMixin],
  getInitialState:function(){
    return{
      isHome:true,
      hideNavigator:false,
      navigatorHeight:60,
    }
  },
  
  componentDidMount:function()
  {
    
  },
  
  _jumpToHomePage:function(){
    // <HomePage navigator={this.props.navigator}/>
    this.props.navigator.push({component:HomePage})
  },
  _openPanel:function(name){
    // this._drawer.props.navigator = navigator;
    // if(name=="Home"){
      this.eventEmitter('emit','openPanel');
    // }
  },

  _closePanel:function(){
    this._drawer.close()
  },

  _NavigationBarRouteMapper:function(){
    var _this = this;
    return {
      LeftButton: function(route, navigator, index, navState) {

        if(index>0)
        {
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
        if(route.name=="Favor")
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
            {route.name=="Favor"?g_Lan.tab_bar_favor():route.name}
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
      backgroundColor: 'white',
      height:this.state.navigatorHeight,
      alignItems:'center',
    }
  },
  render:function(){
    return(
        <Navigator
          navigationBar={
            <Navigator.NavigationBar
            routeMapper={this._NavigationBarRouteMapper()}
            style={this._navStyle()}
          />}
          initialRoute={{component:FavorThings,name:"Favor"}}
          renderScene = {(route, navigator) =>{
            let Favor = route.component;
            navigator.Hide=this._hideNavigator
            navigator.Show=this._showNavigator
            return(
              <View style={{flex:1}}>
              <View style={this._navStyle()}/>
              <Favor navigator={navigator} {...route.params} />
            </View>
            )
          }}
        />
    )
  }
});

module.exports = FavorNavigator;
