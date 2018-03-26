'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Navigator,
  TabBarIOS,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} = React;
// var ThingDetailMain = require('./ThingDetailMain');

var ThingDetailTabBar=React.createClass({
  getInitialState:function(){
    return{
      selectedTab:"home",
    }
  },
  render:function(){
    return(
      <TabBarIOS
        tintColor={"black"}
      >
        <TabBarIOS.Item
          icon={require('image!web')}
          iconSize={16}
          title="Home"
          selected={this.state.selectedTab==="home"}
          onPress={()=>{
            this.setState({
              selectedTab:"home"
            });
          }}
        >
          <ThingDetailMain
            thingItem={this.props.thingItem}
            navigator={this.props.navigator}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!pin')}
          title="Location"
          selected={this.state.selectedTab==="pin"}
          onPress={()=>{
            this.setState({
              selectedTab:"pin"
            });
          }}
        >
          <View style={{flex:1,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
            <Text style={{color:"blue",fontSize:30}}>Location</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!favor')}
          title="Favor"
          selected={this.state.selectedTab==="web"}
          onPress={()=>{
            this.setState({
              selectedTab:"web"
            });
          }}
        >
          <View style={{flex:1,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
            <Text style={{color:"blue",fontSize:30}}>Favor</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!people')}
          title="Friends"
          selected={this.state.selectedTab==="friends"}
          onPress={()=>{
            this.setState({
              selectedTab:"friends"
            });
          }}
        >
          <View style={{flex:1,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
            <Text style={{color:"blue",fontSize:30}}>Friends</Text>
          </View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={require('image!tool')}
          title="Search"
          selected={this.state.selectedTab==="search"}
          onPress={()=>{
            this.setState({
              selectedTab:"search"
            });
          }}
        >
          <View style={{flex:1,alignItems:"center",flexDirection:"column",justifyContent:"center"}}>
            <Text style={{color:"blue",fontSize:30}}>Search</Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>
    )
  }
});

module.exports = ThingDetailTabBar;
