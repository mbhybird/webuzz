'use strict';
var React = require('react-native');
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
  StatusBarIOS,
  Platform
} = React;

var InstructionPage = require("./InstructionPage");
var PhotoPicker = require("./PhotoPicker");
var BeaconRegister = require("./BeaconRegister");
var ThingType = require("./ThingType");
var Swiper = require('react-native-swiper');
var Dimensions = require('Dimensions');
var Beacons = require('react-native-ibeacon');
var Icon = require('react-native-vector-icons/FontAwesome');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
// var swiperHeight = Dimensions.get('window').height-100;
var RegisterInfo ={
  thingName:"",
  thingDesc:"",
  photos:[],
  beacons:[]
};
var styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#96CDCD',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8FBC8F',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  thing_name_text:{
    width:Dimensions.get('window').width,
    height:150,
    color:"white",
    fontSize:25
  },
  thing_desc_text:{
    width:Dimensions.get('window').width,
    height:150,
    color:"black",
    fontSize:16
  }
})
var userid;
var AppLogin = require('react-native').NativeModules.AppLogin;
// var RegisterMainPageWithNavigator = React.createClass({
//   _renderNavBar() {
//     var _self = this;
//     var routeMapper = {
//       LeftButton(route, navigator, index, navState) {
//         return (
//           <TouchableOpacity onPress={_self.props.navigator.pop}>
//             <Icon name="arrow-left" style={{margin:5}} size={25} color="#FFF" />
//           </TouchableOpacity>
//         );
//       },
//       RightButton(route, navigator, index, navState) {
//         return (
//           <TouchableOpacity onPress={_self._showSettings}>
//             <Icon name="navicon" style={{margin:5}} size={25} color="#FFF" />
//           </TouchableOpacity>
//         );
//       },
//       Title(route, navigator, index, navState) {
//         return (
//           <Text style={{
//             height:20,
//             marginTop:5,
//             fontSize:18,
//             fontWeight:'bold'
//           }}>
//             {_self.state.thingsName}
//           </Text>
//         );
//       }
//     };
//     return (
//       <Navigator.NavigationBar
//         style={{
//           backgroundColor: '#007aff',
//           alignItems: 'center',
//         }}
//         routeMapper={routeMapper}
//       />
//     );
//   },
//   render:function(){
//     return(
//       <Navigator
//         initialRoute={{ name: "Register Thing",
//           component: RegisterMainPage
//         }}
//         configureScene={(route) => {
//           // if (route.sceneConfig) {
//           //   return route.sceneConfig;
//           // }
//           return Navigator.SceneConfigs.FloatFromRight;
//         }}
//
//         sceneStyle={{paddingTop: (Platform.OS === 'android' ? 56 : 64)}}
//         navigatorBar={this._renderNavBar()}
//         renderScene={(route, navigator) => {
//           let Component = route.component;
//             return <Component {...route.params} navigator={this.props.navigator} />
//         }} />
//     )
//   }
// });
var RegisterMainPage = React.createClass({
  propTypes:{
    thing:React.PropTypes.object,
  },
  getInitialState:function(){
    return{
      thingName:"",
      thingDesc:"",
      photos:[],
      beacons:[],
      refresh:false,
      type:"",
      subType:"",
      location:{lat:0,lng:0},
      swiperIndex:0
    }
  },
  componentDidMount:function(){
    this._getUserId();
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        let region =  {}
        region.lat = initialPosition.coords.latitude;
        region.lng = initialPosition.coords.longitude;
        this.setState({
          location:region,
        })
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },
  componentWillMount:function(){
    this._getThings();
  },
  _getPhotos:function(photos)
  {
    RegisterInfo.photos = photos;
  },
  _getThings:function(){
    if(this.props.thing)
    {
      let _thing = this.props.thing;

      RegisterInfo ={
        thingName:"",
        thingDesc:"",
        photos:[],
        beacons:[],
        type:"",
        subType:"",
      };

      RegisterInfo.thingName=_thing.name;
      RegisterInfo.thingDesc = _thing.description;
      RegisterInfo.photos.push(_thing.photo);
      RegisterInfo.beacons = _thing.beacons;
      RegisterInfo.type = _thing.type;
      RegisterInfo.subType = _thing.subType;
      // _thing.beacons.map(function(beaconinfo,index){
      //   RegisterInfo.beacons.push(beaconinfo.major+"@@"+minor)
      // });
      // alert(RegisterInfo.ThingsName);
      this.setState({
        refresh:!this.state.refresh,
        thingName:_thing.name,
        thingDesc:_thing.description,
        photos:RegisterInfo.photos,
        beacons:RegisterInfo.beacons,
        type:RegisterInfo.type,
        subType:RegisterInfo.subType,
      })
    }
  },
  _onMomentumScrollEnd: function (e, state, context) {
    this.setState({
      swiperIndex:state.index,
    })
  },
  _getBecons:function(beacons)
  {
    RegisterInfo.beacons = beacons;
  },
  _getUserId:function(){
    AppLogin.getUserIdFromNative(function(data){
        userid=data;
    })
  },
  _postRegister:function(){
    // alert(this.state.thingName);
    if(RegisterInfo.thingName=="")
    {
      alert("Please input the thing's name");
      return;
    }
    if(!RegisterInfo || !RegisterInfo.photos || !RegisterInfo.photos[0])
    {
      alert("Please select a photo");
      return;
    }
    if(!RegisterInfo || !RegisterInfo.thingDesc || RegisterInfo.thingDesc=="")
    {
      alert("Please input descriptions");
      return;
    }




    if (this.props.thing) {
      let _thing = this.props.thing;
      _thing.name = RegisterInfo.thingName;
      _thing.photo = RegisterInfo.photos[0];
      _thing.description = RegisterInfo.thingDesc;
      _thing.beacons = RegisterInfo.beacons;
      _thing.type = RegisterInfo.type;
      _thing.subType = RegisterInfo.subType;
      _thing.location=this.state.location;
      let url = g_ConstInfo.WEBUZZ_API_THINGS(_thing._id);
      // let url = g_ConstInfo.WEBUZZ_API_THINGS();
      fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({
        //   "catalog":"56de603f33792e8c05000007",
        //   "name":RegisterInfo.thingName,
        //   "photo":RegisterInfo.photos[0],
        //   "description":RegisterInfo.thingDesc,
        //   "contactInfo":"things contact...",
        //   "type":"thing",
        //   "subType":"buzz",
        //   "keyWord":["thing","buzz"],
        //   "owner":userid,
        //   "createDate":Date.now(),
        //   "audioInfo":[null],
        //   "beacons":RegisterInfo.beacons
        // })
        // body: JSON.stringify({
        //   "catalog":"56de603f33792e8c05000007",
        //   "name":RegisterInfo.thingName,
        //   "photo":RegisterInfo.photos[0],
        //   "description":RegisterInfo.thingDesc,
        //   "beacons":RegisterInfo.beacons,
        // })
        body:JSON.stringify(_thing),
      })
      .then(res => res.json())
      .then(res => {
        alert(res.message)
        this.props.navigator.pop();
      });
    }
    else {
      fetch(g_ConstInfo.WEBUZZ_API_THINGS(), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "catalog":"56de603f33792e8c05000007",
          "name":RegisterInfo.thingName,
          "photo":RegisterInfo.photos[0],
          "description":RegisterInfo.thingDesc,
          "contactInfo":"things contact...",
          "type":RegisterInfo.type,
          "subType":RegisterInfo.subType,
          "topic":[],
          "keyWord":["thing","buzz"],
          "owner":userid,
          "createDate":Date.now(),
          "audioInfo":[null],
          "beacons":RegisterInfo.beacons,
          "location":this.state.location,
        })
      })
      .then(res => res.json())
      .then(res =>{
        alert(res.message)
        this.props.refreshMyThing();
        this.props.navigator.pop();
      });
    }

  },
  _setName:function(text)
  {
    RegisterInfo.thingName=text;
  },
  _setDesc:function(text)
  {
    RegisterInfo.thingDesc=text;
  },
  _setType:function(type,subType)
  {
    if(type && type!=""){
      RegisterInfo.type = type;
    }
    if(subType && subType!=""){
      RegisterInfo.subType = subType;
    }
    // alert(RegisterInfo.type+" "+RegisterInfo.subType);
  },
  render: function() {
    return(
      <View>
        {/*<View style={{backgroundColor:"green",height:60,flexDirection:"column",justifyContent:"flex-end"}}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
          <TouchableOpacity style={{flex:1}}  onPress={()=>{this.props.navigator.pop()}}>
          <Icon name="arrow-left" style={{margin:5}} size={25} color="#FFF" />
          </TouchableOpacity>
          <View style={{flex:2}}>
          <Text style={{fontSize:20,color:"White"}}>Register Thing</Text>
          </View>
          </View>
        </View>*/}
        <Swiper style={styles.wrapper}
          showsButtons={true}
          loop={false}
          showsPagination={true}
          automaticallyAdjustContentInsets={true}
          keyboardDismissMode={"on-drag"}
          bounces={true}
          paginationStyle={{height:160}}
          onMomentumScrollEnd = {this._onMomentumScrollEnd}
          index={this.state.swiperIndex}
        >
          <InstructionPage style={styles.slide1} backgroundColor={"#8FBC8F"}>
            <View style={{borderColor:'lightgray',borderBottomWidth: 1}}>
              <TextInput
                textAlign={1}
                defaultValue={this.state.thingName}
                placeholder={"Name Your Thing"}
                style={styles.thing_name_text}
                onChangeText={this._setName}
              />
            </View>
          </InstructionPage>
          <ThingType setType = {this._setType} type={this.state.type} subType = {this.state.subType}/>
          <InstructionPage style={styles.slide2} backgroundColor={"#8FBC8F"} >
            <View style={{borderColor:'lightgray',borderBottomWidth: 1,borderTopWidth: 1,flex:1,justifyContent:"flex-start"}}>
              <TextInput
                textAlign={0}
                defaultValue={this.state.thingDesc}
                placeholder={"Say Something about your thing"}
                multiline={true}
                style={styles.thing_desc_text}
                onChangeText={this._setDesc}
              />
            </View>
          </InstructionPage>
          <InstructionPage style={styles.slide2} backgroundColor={"#8FBC8F"} >
            <PhotoPicker photoList={this.state.photos} updatePhotos = {this._getPhotos}/>
          </InstructionPage>
          <InstructionPage backgroundColor="#8FBC8F">
            <BeaconRegister beacons={this.state.beacons} updateBeacons={this._getBecons}/>
          </InstructionPage>
          <View style={styles.slide2}>
            <TouchableHighlight
              style={{borderBottomWidth:1,borderColor:"white",alignItems:"center",marginBottom:5}}
              onPress={this._postRegister}
            >
              <Text style={styles.text}>Submit</Text>
            </TouchableHighlight>
          </View>
        </Swiper>
      </View>
    )
  }
});

module.exports = RegisterMainPage
