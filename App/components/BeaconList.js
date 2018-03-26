/**
 * React Native iBeacon example
 * https://github.com/geniuxconsulting/react-native-ibeacon
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  DeviceEventEmitter,
  Switch,
  TouchableHighlight
} = React;

// Require react-native-ibeacon module
// var Beacons = require('react-native-ibeacon');
//
// // Define a region which can be identifier + uuid,
// // identifier + uuid + major or identifier + uuid + major + minor
// // (minor and major properties are numbers)
// var region = {
//     identifier: 'Sensoros',
//     uuid: '23A01AF0-232A-4518-9C0E-323FB773F5EF'
// };
//
// // Request for authorization while the app is open
// Beacons.requestAlwaysAuthorization();
//
// // Range for beacons inside the region
// Beacons.startRangingBeaconsInRegion(region);
//
// Beacons.startUpdatingLocation();

// Create our dataSource which will be displayed in the data list
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var currentBeconInfo = {};
// The BeaconView
var BeaconView = React.createClass({
  render: function() {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>UUID: {this.props.uuid}</Text>
        <Text style={styles.smallText}>Major: {this.props.major}</Text>
        <Text style={styles.smallText}>Minor: {this.props.minor}</Text>
        <Text>RSSI: {this.props.rssi}</Text>
        <Text>Proximity: {this.props.proximity}</Text>
        <Text>Distance: {this.props.accuracy.toFixed(2)}m</Text>
      </View>
    );
  }
});
var subscription;
// var BeaconViewWithBack = React.createClass({
//   _goBack:function(object)
//   {
//     // object.props.navigator.pop();
//     this.props.navigator.pop()
//   },
//   render: function() {
//     return (
//       <View style={styles.row}>
//         <Text style={styles.smallText}>UUID: {this.props.uuid}</Text>
//         <Text style={styles.smallText}>Major: {this.props.major}</Text>
//         <Text style={styles.smallText}>Minor: {this.props.minor}</Text>
//         {/*<Text>RSSI: {this.props.rssi}</Text>
//         <Text>Proximity: {this.props.proximity}</Text>
//         <Text>Distance: {this.props.accuracy.toFixed(2)}m</Text>*/}
//         <TouchableHighlight onPress={this._goBack} style={{alignItems:"center"}}>
//           <Text>Back</Text>
//         </TouchableHighlight>
//       </View>
//     );
//   }
// });

// The BeaconList component listens for changes and re-renders the
// rows (BeaconView components) in that case
var BeaconList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: ds.cloneWithRows([]),
      triggerOn:false,
      showAlert:false
    };
  },
  componentWillMount: function() {
    // Listen for beacon changes
    subscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        // Set the dataSource state with the whole beacon data
        // We will be rendering all of it throug <BeaconView />
        this.setState({
          dataSource: ds.cloneWithRows(data.beacons)
        });
        if(this.state.triggerOn && data && data.beacons && data.beacons.length>0)
        {
          for (var beaconInfo of data.beacons) {
            if(beaconInfo.proximity && beaconInfo.proximity=="immediate")
            {

                // this.setState({triggerOn:false,showAlert:true});
                // currentBeconInfo = beaconInfo;
                // break;
            }
          }
        }
      }
    );
  },
  componentWillUnmount:function()
  {
    subscription.remove();
  },
  _navigateToBeaconList:function(){
    this.props.navigator.push({component:BeaconViewWithBack});
  },
  renderRow: function(rowData) {
    return <BeaconView {...rowData} style={styles.row} />
  },
  _resetSwitch:function()
  {
    this.setState({triggerOn:true})
  },
  render: function() {
    if(currentBeconInfo && currentBeconInfo.proximity && this.state.showAlert)
    {
      // return(<BeaconViewWithBack {...currentBeconInfo} navigator = {this._navigateToBeaconList}/>);
      this.setState({showAlert:false});
      alert("Beacon Major:"+currentBeconInfo.major+" Minor:"+currentBeconInfo.minor);
    }
    return (
      <View style={styles.container}>
        <Text>Please turn on the switch to start the trigger </Text>
        <View style={{justifyContent:"flex-end",flexDirection:"row",alignItems: 'center'}}>
          <Text>Off   </Text>
          <Switch value={this.state.triggerOn} onValueChange={(value)=>this.setState({triggerOn:value})}></Switch>
          <Text>   On</Text>
        </View>
        <Text style={styles.headline}>All beacons in the area</Text>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />

      </View>
    );
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    padding: 8,
    paddingBottom: 16
  },
  smallText: {
    fontSize: 11
  }
});

module.exports = BeaconList;
