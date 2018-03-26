'use strict';
var React = require('react-native');

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


// var RegisterVeiw = require("../RegisterPage/RegisterMainPage");
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var imageWidth = (windowWidth - 10) / 2;
var EventEmitterMixin = require('react-event-emitter-mixin');
var storageHandler = require('../../common/StorageHandler');
var AppLogin = require('react-native').NativeModules.AppLogin;
var HomePageCell = require('./FavorHomeCell');
var windowHeight = Dimensions.get('window').height;

var ThingSelected = require('../HomePage/ThingSelected');
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');
var IndicatorView = require('../IndicatorView');
var ScrollItemWith = (Dimensions.get('window').width - 15) / 2;
var UserInfoHelper = require('../../common/UserInfoHelper');
var ThingFrame = require("react-native/../../components/ThingDetails/ThingFrame");

var userid;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  navBar1: {
    backgroundColor: 'white',
    height: 60
  },
  thingframe: {
    // width:138,
    height: ScrollItemWith,
    // height:96,
    marginLeft: 5,
    marginBottom: 5
  },
  thingframe_img: {
    // width:138,
    width: ScrollItemWith,
    height: ScrollItemWith,
    // borderRadius:10
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  thingframe_imgBar: {
    width: ScrollItemWith,
    height: ScrollItemWith / 6,
    backgroundColor: "black",
    opacity: 0.8,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "center",
  },
  thingTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  thingSubTitleContainer: {
    width: ScrollItemWith,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  thingSubTitle_headImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 5
  },
  thingSubTitle: {
    fontSize: 9
  }
});

/*var FavorThings = React.createClass({

 mixins:[EventEmitterMixin],
 getInitialState: function() {
 return {
 dataSource: new ListView.DataSource({
 rowHasChanged: (row1, row2) => row1 !== row2,
 }),
 noMoreData:false,
 // animating:true
 };
 },
 _getUserId:function(){
 let _this = this;
 AppLogin.getUserIdFromNative(function(data){
 userid=data;
 // console.log('getUserIdFromNative;');
 _this._getFavorThingsFromURL(userid);
 })
 },
 componentDidMount:function() {
 this._getUserId();
 // this._getThingsFromURL();
 // console.log('componentDidMount;')
 this.eventEmitter('on','FavorTabed',()=>{
 console.log('on FavorTabed')
 this._getFavorThingsFromURL(userid);
 });
 },
 componentWillMount:function(){
 // console.log('componentWillMount;')
 },
 _getFavorThingsFromURL:function(id){
 // console.log('_getFavorThingsFromURL');
 if(!id || id==""){return}
 let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR(userid);
 // console.log(url);

 fetch(url)
 .then(response=>response.json())
 .catch(err=>{ alert('Can not get your favors.Please retry.') })
 .then(response=>{
 storageHandler.refreshFavorsRelated(response);
 this.setState({
 dataSource:this.getDataSource(response)
 })
 })
 .done();
 },

 getDataSource: function(things: Array<any>): ListView.DataSource {
 return this.state.dataSource.cloneWithRows(things);
 },
 onEndReached:function()
 {
 // alert("reach");
 // if(this.state.noMoreData)
 // {
 // 	return;
 // }
 // else
 // {
 // 	//alert(resultsCache.nextPage);
 // 	this._getThingsFromURL(resultsCache.nextPage);
 // }
 },

 renderRow: function(
 thing: Object,
 sectionID: number | string,
 rowID: number | string,
 highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,)
 {
 return (

 <HomePageCell refresh={()=>{this._getFavorThingsFromURL(userid)}} ownerId={userid} thing={thing} navigator={this.props.navigator}/>

 );
 },
 renderFooter: function() {

 return (<View style={{marginVertical: 15,flexDirection:'row',justifyContent:'center'}}><Text>WeBuzz</Text></View>);

 },
 noRecord:function()
 {
 return (<View></View>);
 },
 render:function()
 {
 if(this.state.dataSource.getRowCount()===0)
 {
 return this.noRecord();
 }

 return(
 <ListView
 ref="listview"
 dataSource={this.state.dataSource}
 renderRow={this.renderRow}
 onEndReached={this.onEndReached}
 renderFooter={this.renderFooter}
 automaticallyAdjustContentInsets={false}
 keyboardDismissMode="on-drag"
 keyboardShouldPersistTaps={true}
 showsVerticalScrollIndicator={false}
 />
 );
 }
 });*/

var LoginGuidePage = React.createClass({
  render: function () {
    return (
      <View style={{height:windowHeight-200,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
        <TouchableOpacity
          style={{
            borderWidth:1,
            borderColor:"orange",
            // width:80,
            height:30,
            borderRadius:2,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',
          }}
          onPress={this.props.logIn}
        >
          <Text style={{fontSize:12,color:'orange', margin:10}}>Link Your Social Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var FavorThings = React.createClass({

  mixins: [EventEmitterMixin],

  getInitialState: function () {
    return {
      things: [],
      noMoreData: false,
      selectIndex: -1,
      waiting: true,
      isLogin: false,
      // animating:true
    };
  },

  _getUserId: function () {
    let _this = this;
    AppLogin.getUserIdFromNative(function (data) {
      userid = data;
      // console.log('getUserIdFromNative;');
      _this._getFavorThingsFromURL(userid);
    })
  },

  _initPage: function () {
    let _this = this;
    AppLogin.getUserIdFromNative(function (data) {
      userid = data;
      // console.log('getUserIdFromNative;');
      if (data) {
        _this._getFavorThingsFromURL(data);
        _this.setState({
          isLogin: true
        })
      } else {
        _this.setState({
          isLogin: false,
          things: [],
          selectIndex: -1,
        });
      }
    })
  },

  _showLoginPage: function () {
    let _this = this;
    UserInfoHelper.showLoginPageAndGetLoginId(function (data) {
      if (data) {
        _this._getFavorThingsFromURL(data);
        _this.setState({
          isLogin: true,
        })
      }
    })
  },

  unselectCurrentIndex: function () {
    let index = this.state.selectIndex;
    if (index >= 0 && this['thingFrame' + index]) {
      this['thingFrame' + index].unselectFrame();
    }
  },
  componentDidMount: function () {
    // this._getUserId();
    this._initPage();
    this.eventEmitter('on', 'FavorTabed', ()=> {
      console.log('on FavorTabed');
      this._initPage();
    });
    this.eventEmitter('on', 'LogOut', ()=> {
      this._initPage();
    })
  },
  _waiting: function () {
    this.setState({
      waiting: true
    })
  },
  _stopWaiting: function () {
    this.setState({
      waiting: false
    })
  },
  _getFavorThingsFromURL: function (id) {
    if (!id || id == "") {
      return
    }
    let _this = this;
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR(id);

    this._waiting();
    this.unselectCurrentIndex();
    storageHandler.getFavorsRelatedFromURL(id,function(data){
      _this.setState({
        things: data==undefined?[]:data
      })
      _this._stopWaiting();
    });
  },
  render: function () {
    let _this = this;
    if (!this.state.isLogin) {
      return (
        <LoginGuidePage logIn={this._showLoginPage}/>
      )
    }
    return (
      <View style={{flex:1}}>

        <ScrollView
          showsVerticalScrollIndicator={true}
          ref="homeSV"
          contentContainerStyle={{
                        alignItems:"center",
                        flexDirection:"row",
                        justifyContent:"flex-start",
                        flexWrap:"wrap"
                    }}
          style={{flex:1,width:Dimensions.get('window').width}}
        >
          <Image
            style={{
                  width:windowWidth,
                  height:windowWidth*2/4
              }}
            source={require('image!img-favor-headimg')}/>
          {
            this.state.waiting ?
              <View style={{width:windowWidth,alignItems:"center"}}><IndicatorView/></View>
              : null
          }

          {
            this.state.things.map(function (item, index) {
              return (
                <ThingFrame
                  ref={(c)=>{_this['thingFrame'+index]=c}}
                  changeIndex={(selectIndex)=>{
                    _this.setState({
                        selectIndex:selectIndex
                    });
                  }}
                  selected={false}
                  key={index}
                  keyIndex={index}
                  thing={item}
                  onSelectLayOut={(layout)=>{
                      _this.refs.homeSV.scrollTo({x:0,y:layout.y,true})
                  }}
                  navigator={_this.props.navigator}
                  onFrameClick={(index)=>_this.unselectCurrentIndex()}
                />)
            })
          }
          <View style={{height:48,width:windowWidth}}/>
        </ScrollView>
      </View>
    );
  }
});

module.exports = FavorThings;
