'use strict';

var React = require('react-native');
//增加NavigatorIOS
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  DeviceEventEmitter
} = React;
var Beacons = require('react-native-ibeacon');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
// var region = {
//     identifier: 'Sensoros',
//     // uuid: '23A01AF0-232A-4518-9C0E-323FB773F5EF'
//     uuid: 'fda50693-a4e2-4fb1-afcf-c6eb07647825'
// };
// Beacons.requestAlwaysAuthorization();

var m_beaconsRange;
var m_beaconsRegistered=[];
var m_beaconsExist = [];


var BeaconView = React.createClass({
  render:function(){
    var beacons = this.props.beaconsInfo.split("@@@");
    return(
      <View style={{width:80,height:80,flexDirection:"column"}}>
        <View>
          <Image style={{width:80,height:50}} source={require("image!yunzi")}/>
          {/*</View>*/}
          {/*<View style={{width:60,height:100,flex:1,flexDirection:"column"}}>*/}
          <Text style={{fontSize:9}}>Major:{beacons[0]}</Text>
          <Text style={{fontSize:9}}>Minor:{beacons[1]}</Text>
        </View>
      </View>
    )
  }
});

var BeaconRegister = React.createClass({
  getInitialState:function(){
    return({
      isStartBeconScan:false,
      beaconsRegistered:[],
    })
  },

  componentWillMount:function(){
    this._getBeacons();
    // alert("will"+this.props.beacons.length+"@"+m_beaconsRegistered.length)
  },
  componentWillUnmount:function(){
    this._endBeaconSearch();
  },
  _getBeacons:function(){
    m_beaconsRegistered=[];
    m_beaconsExist=[];
    let _beacons = this.props.beacons;

    if(_beacons && _beacons.length>0){
        _beacons.map(function(beaconInfo,item){
          m_beaconsRegistered.push(beaconInfo.major+"@@@"+beaconInfo.minor);
          m_beaconsExist.push(beaconInfo.major+"@@@"+beaconInfo.minor);
        });
    }
    this.setState({
      beaconsRegistered:m_beaconsRegistered
    })
  },

  _startBeaconSearch:function(){
    // Beacons.startRangingBeaconsInRegion(region);
    // Beacons.startUpdatingLocation();
    m_beaconsRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        if(this.state.isStartBeconScan && data.beacons && data.beacons.length>0){
          for (var beaconInfo of data.beacons) {
            if(beaconInfo.proximity && beaconInfo.proximity=="immediate")
            {
                if (m_beaconsRegistered.indexOf(beaconInfo.major+"@@@"+beaconInfo.minor)==-1)
                // if(m_beaconsRegistered.length<=3)
                {
                  // m_beaconsRegistered.push(beaconInfo.major+"@@@"+beaconInfo.minor);
                  // this.setState({
                  //   beaconsRegistered:m_beaconsRegistered
                  // });
                  // this._updateBeacons();
                  this._setBeacon(beaconInfo.major,beaconInfo.minor);
                  break;
                }
            }
          }
        }
      })
  },
  _setBeacon:function(major,minor){
    if(m_beaconsExist.indexOf(major+"@@@"+minor)>=0)
    {
      // m_beaconsExist.push(major+"@@@"+minor);
      // alert("major:"+major+" minor:"+minor + " has been registered!");
      return;
    }
    let url=g_ConstInfo.WEBUZZ_API_THINGS_BEACON(major,minor);
    // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
    fetch(url)
      .then((response)=>response.json())
      .catch((error) => {
        alert(error.messages);
      })
      .then((responseData)=>{
        if(responseData)
        {
          m_beaconsExist.push(major+"@@@"+minor);
          alert("major:"+major+" minor:"+minor + " has been registered!");
          return;
        }
        if (m_beaconsRegistered.indexOf(major+"@@@"+minor)==-1)
        {
          m_beaconsRegistered.push(major+"@@@"+minor);
        }
        this.setState({
          beaconsRegistered:m_beaconsRegistered
        });
        this._updateBeacons();
      })
      .done();
  },
  _endBeaconSearch:function(){
    // Beacons.stopRangingBeaconsInRegion(region);
    // Beacons.stopUpdatingLocation();
    if(m_beaconsRange){
      m_beaconsRange.remove();
    }
  },

  _switchBeasonSearch:function(value)
  {
    if(value){
      this._startBeaconSearch();
    }
    else {
      this._endBeaconSearch();
    }
    this.setState({isStartBeconScan:value});
  },
  _removeBeacon:function(index)
  {
    m_beaconsRegistered.splice(index, 1);
    this.setState({
      beaconsRegistered:m_beaconsRegistered
    });
    // alert(index)
  },
  _updateBeacons:function()
  {
    var beaconList=[];
    m_beaconsRegistered.map(function(beacon){
      var beaconobj = {};
      var beaconinfo = beacon.split("@@@");
      beaconobj.major=beaconinfo[0];
      beaconobj.minor=beaconinfo[1];
      beaconobj.range="I";
      beaconList.push(beaconobj);
    });
    this.props.updateBeacons(beaconList);
  },
  render:function(){
    return(
      <View style={{flexDirection:"column",flex:1,height:185}}>
        <View style={{borderColor:'lightgray',borderBottomWidth: 1,flexDirection:"row",alignItems:"center",justifyContent:"flex-start"}}>
          <Text style={{color:"grey",fontSize:16}}>Register Your Beacon</Text>
          <Switch style={{margin:10}}
            value={this.state.isStartBeconScan}
            onValueChange={(value)=>{
              this._switchBeasonSearch(value);
            }}/>
        </View>
        <View
          style={{margin:35,flexDirection:"row",flexWrap:"wrap",flex:1,alignItems:"center"}}>
          {
            this.state.beaconsRegistered.map(function(beaconsInfo,index){
              return(
                <TouchableOpacity
                key={index}
                onPress={()=>{this._removeBeacon(index)}}
                style={{margin:10}}>
                <BeaconView beaconsInfo={beaconsInfo}/>
              </TouchableOpacity>
              )
            },this)
          }
        </View>
      </View>
    )
  }
});
module.exports = BeaconRegister;
