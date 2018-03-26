'use strict'
var React = require('react-native');
//var SearchBar = require('./SearchBar');
var {
	StyleSheet,
	Text,
	View,
	TextInput,
	Image,
	TouchableHighlight,
	TouchableOpacity,
	NavigatorIOS,
	ScrollView,
	TabBarIOS
} = React;

var HomePage = require('./HomePage');
var SideMenuNavigator = require('./SideMenuNavigator');
var TabBar = require('./HomeTabBar');

var ThingsList = require('../ThingsList/ThingsList');
var Logout = require('../Login/Logout');

var Drawer = require('react-native-drawer');

var LocationSelect = React.createClass({
	render:function()
	{
		return(
			<View>
				<TouchableHighlight>
					<Text>玩乐</Text>
				</TouchableHighlight>

				<TouchableHighlight>
					<Text>古玩</Text>
				</TouchableHighlight>
			</View>);
	}
});

var Location=React.createClass({
	render:function(){
		return(<View style={{flex:1,flexDirection:"row",alignItems:"flex-end"}}>
      <Text style={{color:"white",width:30}}>美食</Text>
      <TouchableHighlight underlayColor="red">
        <View>
          <Image style={{width:12,height:12,marginLeft:3}}
            source={require('image!down-arrow-line-angle')}
          />
          <NavigatorIOS
            initialRoute={{
              component: LocationSelect,
              title: 'My View Title',
              passProps: { myProp: 'foo' },
            }}/>

        </View>
      </TouchableHighlight>
    </View>);
	}
});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
var EventEmitterMixin = require('react-event-emitter-mixin');


var ThingsView=React.createClass({
  mixins:[EventEmitterMixin],
	getInitialState: function() {
    return {
      refresh:false,
      sideBarOpen:false,
    };
	},

  componentDidMount:function(){
    this.eventEmitter('on','openPanel',()=>{

      if(this.state.sideBarOpen){
        this._closePanel();
      }
      else {
        this._openPanel();
      }
    });
  },

  _openPanel:function(){
    this._drawer.open();
    // this._setSideBarOpen(true);

  },

  _closePanel:function(){
    this._drawer.close();
    // this._setSideBarOpen(false);
  },
  _setSideBarOpen:function(isopen){
    this.setState({
      sideBarOpen:isopen,
    })
    // this.eventEmitter('emit',"sideBarOpen",isopen);
  },
  _renderLocationBadge:function(){
    var Dimensions = require('Dimensions');
    var windowHeight = Dimensions.get('window').height;
    var windowWidth = Dimensions.get('window').width;
    var OverLay = require('react-native-overlay');
    var tabbar = this.tabbar;
    return(
      // <OverLay isVisible={true}>
      <View
        style={{
            position:"absolute",
            // top:windowHeight-50,
            // left:(iconWidth * 2)-(iconWidth-iconSize)/2,
            top:500,
            left:0
          }}
      >
        <Image
          style={{
              alignItems:"center",
              justifyContent:"center",
              width:25,
              height:25
            }}
          source={require('image!icon-badge')}>
          <Text style={{
              backgroundColor:"transparent",
              color:"orange",
              fontSize:10
            }}>
            1
          </Text>
        </Image>
      </View>
      // </OverLay>
    );
  },
	render:function(){
    let _this = this;
		return (
      <Drawer
        content={<SideMenuNavigator logOut={_this.props.name} closePaner={_this._closePanel} name={this.props.name} navigator = {this.props.navigator}/>}
        ref={(c)=>this._drawer=c}
        onClose={()=>{this._setSideBarOpen(false)}}
        onOpen={()=>{this._setSideBarOpen(true)}}
        tapToClose={true}
        openDrawerOffset={0.5}
        type={"displace"}
        side={"right"}
        acceptTap={false}
        panCloseMask={0.5}
        closedDrawerOffset={-3}
        captureGestures={false}
        acceptPan={false}
        styles={{drawer:{backgroundColor:"#FFCC00"}}}
      >

        <View style={{backgroundColor:"white",flex:1}}>
          <View style={{flex:1}}>
          <TabBar ref={(c)=>this.tabbar=c} sideBarOpen={this.state.sideBarOpen} name={this.props.name} navigator={this.props.navigator}/>
          </View>
        </View>
      </Drawer>
			);
	}
});

module.exports = ThingsView;
