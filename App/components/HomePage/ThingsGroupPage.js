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
  ListView,
  Image,
  TouchableOpacity
} = React;

var Dimensions = require('Dimensions');
var ScrollItemWith = (Dimensions.get('window').width - 30)/2;
var UnderLine = require("../UnderLine");
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
var AppLogin = require('react-native').NativeModules.AppLogin;
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var EventEmitterMixin = require('react-event-emitter-mixin');
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Comment =  require('../Comment/Navigation');
var HomePage = require('./HomePage');
var ThingSelected = require('./ThingSelected');

var storageHandler = require('../../common/StorageHandler');

var ThingsRelated = require('../Users/ThingsRelated');

var userid;
const styles = StyleSheet.create({
  thingframe:{
    // width:138,
    height:ScrollItemWith/4*3+60,
    // height:96,
    marginLeft:10
  },
  thingframe_img:{
    // width:138,
    width:ScrollItemWith,
    height:ScrollItemWith,
    // borderRadius:10
    justifyContent:"flex-end",
    flexDirection:"column",
  },
  thingframe_imgBar:{
    width:ScrollItemWith,
    height:ScrollItemWith/6,
    backgroundColor:"black",
    opacity:0.8,
    flexDirection:'row',
    justifyContent:"flex-start",
    alignItems:"center",
  },
  thingTitle:{
    fontSize:12,
    fontWeight:"bold",
  },
  thingSubTitleContainer:{
    width:ScrollItemWith,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  thingSubTitle_headImg:{
    width:20,
    height:20,
    borderRadius:10,
    marginLeft:5
  },
  thingSubTitle:{
    fontSize:9
  }
});

var m_nearByGroup ={
  "name":"near by",
  "things":[],
}

var m_groupCache = [];

var thingsProfileDTO={
  user:{},
  thing:{},
  userPhoto:{}
};

var ThingFrame = React.createClass({
  // getInitialstate:function(){
  //   return{
  //     peopleAround:parseInt(Math.random() * 10 )
  //   }
  // }
  getInitialState:function(){
    return{
      peopleAround:parseInt(Math.random() * 10 ),
      selected:false
    }
  },

  _navigateTODetail:function(thing){
    // this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
    this.setState({
      selected:true
    })
  },

  render:function(){
    var _thing = this.props.thing;
    if(this.state.selected==true){
      return(<ThingSelected thing={this.props.thing}/>);
    }
    return(
      <View style={styles.thingframe}>
          <TouchableOpacity
            onPress = {()=>{this._navigateTODetail(_thing)}}
          >
            <Image
              style={styles.thingframe_img}
              source={{uri:'data:image/jpeg;base64,'+_thing.photo}}
            >
              <View style={styles.thingframe_imgBar}>
                <View style={{margin:5}}>
                  <PeopleAround  iconWidth={13} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                </View>

                <View style={{margin:5}}>
                <ThingsRelated iconWidth={13} iconHeight={10} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                </View>
              </View>
            </Image>
          </TouchableOpacity>
          {
          /*<View style={{margin:5}}>
            <Text  style={styles.thingTitle}>{_thing.name}</Text>
          </View>
          <View style={styles.thingSubTitleContainer}>
            {/!*<IconNumber imageSource={require('image!follow')} numberCount={this.state.peopleAround} />*!/}
            <PeopleAround navigator={this.props.navigator} thing={this.props.thing}/>
            <View style={{marginLeft:10}}>
              {/!*<IconNumber imageSource={require('image!rubber')} numberCount={"100"} />*!/}
              <ThingsRelated navigator={this.props.navigator} thing={this.props.thing}/>
            </View>
            {/!*<Text style={styles.thingSubTitle}>10 people</Text>
              <Image style={styles.thingSubTitle_headImg} source={{uri:"http:\/\/wx.qlogo.cn\/mmopen\/1bpicrfuAibxE9lL4XPUmvagiaXjVFyEp9iaueeQ0lLF47gOrR8UJPd3CjQqy6Oh8fmyJt3kZj51F8OjKZGepmnQOAdlxVPib3AJw\/0"}}/>
            <Image style={styles.thingSubTitle_headImg} source={{uri:"http:\/\/wx.qlogo.cn\/mmopen\/1bpicrfuAibxE9lL4XPUmvagiaXjVFyEp9iaueeQ0lLF47gOrR8UJPd3CjQqy6Oh8fmyJt3kZj51F8OjKZGepmnQOAdlxVPib3AJw\/0"}}/>*!/}
          </View>*/
            }
      </View>
    );
  }
})

var ThingsCell = React.createClass({

  getInitialstate:function(){

  },
  render:function(){
   return(
     <View>
       {/*<View style={{flexDirection:"row",margin:5}}>
         <View style={{flex:1,marginLeft:5}}>
           <Text style={{fontSize:18}}>{this.props.category.name}</Text>
         </View>
         <View style={{flex:1,alignItems:"flex-end",marginRight:5}}>
           <TouchableOpacity
             onPress={()=>this.props.navigator.push({component:HomePage,name:this.props.category.name})}
           >
             <Text style={{color:"blue",fontSize:18}}>more</Text>
           </TouchableOpacity>
         </View>
       </View>*/}
       <ScrollView
         horizontal={true}
       >
         <View style={{flexDirection:"row"}}>
           {
             this.props.category.things.map(function(thing,index){
               return(<ThingFrame navigator={this.props.navigator} key={index} thing = {thing}/>);
             },this)
           }
         </View>
       </ScrollView>
       {/*<UnderLine/>*/}
     </View>
   );
  }
});

var ThingsHomePage = React.createClass({
  //life cycle
  mixins:[EventEmitterMixin],
  getInitialState:function(){
    // var getSectionData = (dataBlob, sectionID) => {
    //   return dataBlob[sectionID];
    // }
    //
    // var getRowData = (dataBlob, sectionID, rowID) => {
    //     return dataBlob[sectionID + ':' + rowID];
    // }
    return{
      dataSource:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        // sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
      }),
      noMoreData:false,
      nearByGroup:{
        "name":"near by",
        "things":[],
      },
    }
  },
  _getUserId:function(){
    AppLogin.getUserIdFromNative(function(data){
        userid=data;
    })
  },
  _getThingsGroup:function(){
    // console.log("_getThingsGroup");
    let url = g_ConstInfo.WEBUZZ_API_GROUPS();
    let _this = this;
    fetch(url)
    .then(response => response.json())
    .then(responseData => {
      if(responseData && responseData.length>0)
      {
        responseData.map(function(things){
          storageHandler.updateThingsStorage(responseData[0].things);
        });
        let otherGroup = []
        for (var i=1;i<responseData.length;i++) {
          otherGroup.push(responseData[i]);
        }
        m_groupCache = otherGroup
        this.setState({
          dataSource:_this._getDataSource(m_groupCache),
        })
      }
    });
  },
  _jumpToComment:function(thing){
    let _thing = thing;
    let _userPhoto = require('image!Webuzz');
    thingsProfileDTO.thing = _thing;
    if(thingsProfileDTO.user){
      if(thingsProfileDTO.user.photo){
        _userPhoto = {uri:'data:image/jpeg;base64,'+thingsProfileDTO.user.photo}
      }
      else if (thingsProfileDTO.user.wechat && thingsProfileDTO.user.wechat.headimgurl) {
        _userPhoto = {uri:thingsProfileDTO.user.wechat.headimgurl}
      }
      else if (thingsProfileDTO.user.facebook && thingsProfileDTO.user.facebook.headimgurl) {
        _userPhoto = {uri:thingsProfileDTO.user.facebook.headimgurl}
      }
    }
    this.eventEmitter('emit','closeTabBar','nearBy');
    thingsProfileDTO.userPhoto=_userPhoto;
    this.props.navigator.push({component:Comment,name:_thing.name,params:{thingsProfileDTO:thingsProfileDTO}});
    // this.props.navigator.Hide();
  },
  _updateLocation:function(thing){

    let _storage = g_ConstInfo.WEBUZZ_STORAGE;

    if(m_nearByGroup.things && m_nearByGroup.things.length>0){
      for(var i= 0 ;i< m_nearByGroup.things.length;i++){
        let _thing = m_nearByGroup.things[i];
        if(_thing._id == thing._id)
        {
          _thing.location.lat = thing.location.lat;
          _thing.location.lng = thing.location.lng;

          storageHandler.updateThingsStorage([_thing]);

        }
      }
    }

    if(m_groupCache && m_groupCache.length>0){
      for(var i= 0 ;i< m_groupCache.length;i++){
        if(m_groupCache[i].things && m_groupCache[i].things.length>0){
          for(var j= 0 ;j< m_groupCache[i].things.length;j++){
            let _thing = m_groupCache[i].things[j];
            if(_thing._id == thing._id)
            {
              _thing.location.lat = thing.location.lat;
              _thing.location.lng = thing.location.lng;

              storageHandler.updateThingsStorage([_thing]);
            }
          }
        }
      }
    }

    _storage.save({
      key: 'nearByGroup',  //注意:请不要在key中使用_下划线符号!
      rawData:m_nearByGroup,
      //如果不指定过期时间，则会使用defaultExpires参数
      //如果设为null，则永不过期
      expires: 1000 * 3600
    });

    this.setState({
      nearByGroup:m_nearByGroup,
      dataSource:this._getDataSource(m_groupCache),
    });
  },

  componentWillMount:function(){
    let _this = this;
    this._getUserId();
    let _storage = g_ConstInfo.WEBUZZ_STORAGE;
    this.eventEmitter('on','HomeTabed',()=>{this._getThingsGroup()});
    this.eventEmitter('on','updateLocation',(thing)=>{this._updateLocation(thing)});
    this.eventEmitter('on','walkOut',(key)=>{

      let beaconKey = key.split(g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR);

      if(m_nearByGroup.things && m_nearByGroup.things.length>0){

        for(var i= 0 ;i< m_nearByGroup.things.length;i++)
        {
          let thing = m_nearByGroup.things[i];

          if(thing.beacons && thing.beacons.length>0){

            for(var beacon of thing.beacons){

              if(beacon.major==beaconKey[0] && beacon.minor==beaconKey[1])
              {

                m_nearByGroup.things.splice(i,1);
                this.props.thingsNearBy(m_nearByGroup.things);
                _storage.save({
                  key: 'nearByGroup',  //注意:请不要在key中使用_下划线符号!
                  rawData:m_nearByGroup,
                  //如果不指定过期时间，则会使用defaultExpires参数
                  //如果设为null，则永不过期
                  expires: 1000 * 3600
                });
                _this.setState({
                  nearByGroup:m_nearByGroup
                })
                return;
              }
            }
          }
        }
      }
    });

    this.eventEmitter('on','walkIn',(key)=>{
      let beaconKey = key.split(g_ConstInfo.BEACON_MAJOR_MINOR_SEPARATOR);

      if(m_nearByGroup.things && m_nearByGroup.things.length>0){

        for(var thing of m_nearByGroup.things)
        {

          if(thing.beacons && thing.beacons.length>0){

            for(var beacon of thing.beacons){

              if(beacon.major==beaconKey[0] && beacon.minor==beaconKey[1])
              {
                return;
              }
            }
          }
        }
      }

      if(m_nearByGroup.things){

        let url=g_ConstInfo.WEBUZZ_API_THINGS_BEACON(beaconKey[0],beaconKey[1]);
        // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
        fetch(url)
          .then((response)=>response.json())
          .catch((error) => {
            alert(error.messages);
          })
          .then((responseData)=>{
            if(responseData)
            {
              let thing = responseData;
              m_nearByGroup.things.push(responseData);

              let routeList = _this.props.navigator.getCurrentRoutes();
              if(routeList.length==1)
              {
                // _this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
                this._jumpToComment(thing);
              }
              this.props.thingsNearBy(m_nearByGroup.things);
              _storage.save({
                key: 'nearByGroup',  //注意:请不要在key中使用_下划线符号!
                rawData:m_nearByGroup,
                //如果不指定过期时间，则会使用defaultExpires参数
                //如果设为null，则永不过期
                expires: 1000 * 3600
              });
              this.setState({
                nearByGroup:m_nearByGroup
              })
            }
          })
          .done();
      }
    })
  },
  componentDidMount:function(){
    // alert(jsonData.HomePageData[0].Category);
    let _this = this;
    this._getThingsGroup();
    AppLogin.getUserInfoFromNative(function(data){
      thingsProfileDTO.user = data;
    });
  },
  // shouldComponentUpdate:function(nextProps,nextState){
  //   // this.setState({
  //   //   this.state.dataSource = nextProps.promoteGroup,
  //   // });
  //   // alert(nextProps.promoteGroup.name);
  //   // alert(nextProps.promoteGroup.name);
  //   if(nextProps.groupItem !== this.props.groupItem || this.state.groupItem !==this.state.groupItem)
  //   {
  //     this.setState({
  //       dataSource:this._getDataSource(nextProps.groupItem),
  //     })
  //   }
  //   return nextState.dataSource !==this.state.dataSource ||
  //   nextState.noMoreData !==this.state.noMoreData ||
  //   nextState.groupItem !==this.state.groupItem ||
  //   nextState.refresh !==this.state.refresh;
  // },

  // _getThingsGroup:function(){
  //   let url = g_ConstInfo.WEBUZZ_API_GROUPS();
  //   fetch(url)
  //   .then(response => response.json())
  //   .then(responseData => {
  //     if(responseData && responseData.length>0){
  //       this.setState({
  //         dataSource:this._getDataSource(responseData)
  //       });
  //     }
  //   });
  // },
  //private functions

  _getDataSource:function(categorys: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(categorys);
  },
  _setDataTo:function(jsonData){
    if(jsonData)
    {
      this.setState({
        dataSource:this._getDataSource(jsonData.HomePageData)
      });
    }
  },
  // _getThingsGroup:function(){
  //   let url = g_ConstInfo.WEBUZZ_API_GROUPS();
  //   fetch(url)
  //   .then(response => response.json())
  //   .then(responseData => {
  //     if(responseData && responseData.length>0)
  //     {
  //       // this.setState({
  //       //   dataSource:responseData,
  //       // });
  //       var groupsData = responseData,
  //           length = groupsData.length,
  //           dataBlob = {},
  //           sectionIDs = [],
  //           rowIDs = [],
  //       for (i = 0; i < length; i++) {
  //           let group = groupsData[i];
  //
  //           // Add Section to Section ID Array
  //           sectionIDs.push(group._id);
  //           // Set Value for Section ID that will be retrieved by getSectionData
  //           dataBlob[group._id] = group.name;
  //
  //           let things = group.things;
  //           thingsLength = things.length;
  //
  //           // Initialize Empty RowID Array for Section Index
  //           rowIDs[i] = [];
  //
  //           for(j = 0; j < thingsLength; j++) {
  //               let thing = things[j];
  //               // Add Unique Row ID to RowID Array for Section
  //               rowIDs[i].push(thing.md5);
  //
  //               // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
  //               dataBlob[group._id + ':' + thing.md5] = thing;
  //           }
  //       }
  //       this.setState({
  //           dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
  //       });
  //     }
  //   });
  // },
  //component functions
  renderFooter: function() {

      return (<View style={{marginVertical: 15,flexDirection:'row',justifyContent:'center'}}><Text>WeBuzz</Text></View>);

	},
  renderRow:function(
    category: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,){
      return(<ThingsCell navigator={this.props.navigator} category = {category}/>);
  },
  render:function(){
    if(this.state.nearByGroup.things.length>0)
    {
      return(
        <View>
          <ThingsCell navigator={this.props.navigator} category={this.state.nearByGroup}/>
          <ListView
            ref="listview"
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            renderFooter={this.renderFooter}
          />
        </View>
      );
    }
    return(
        <ListView
          ref="listview"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderFooter={this.renderFooter}
        />
    );
  }
})

module.exports = ThingsHomePage;
