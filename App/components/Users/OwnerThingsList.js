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
  Image,
  AlertIOS,
  ActivityIndicatorIOS,
} = React;


// var RegisterVeiw = require("../RegisterPage/RegisterMainPage");
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width-10)/2
var EventEmitterMixin = require('react-event-emitter-mixin');
var storageHandler = require('../../common/StorageHandler');
var AppLogin = require('react-native').NativeModules.AppLogin;


var UnderLine = require('../UnderLine');



var IndicatorView = require('../IndicatorView');
var ScrollItemWith = (Dimensions.get('window').width - 15)/2;

var userid;
/*const styles= StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"center"
  },
  navBar1: {
    backgroundColor: 'white',
    height:60
  },
});*/

/*var IndicatorView = React.createClass({
  render:function(){
    return(
      <ActivityIndicatorIOS
        animating={true}
        style={{height: 80}}
        size="small"
      />)
  }
})*/

const styles= StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"center"
  },
  navBar1: {
    backgroundColor: 'white',
    height:60
  },
  thingframe:{
    // width:138,
    height:ScrollItemWith,
    // height:96,
    marginLeft:5,
    marginBottom:5
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


var ThingFrame = React.createClass({


  getInitialState:function(){
    return{
      peopleAround:parseInt(Math.random() * 10 ),
      selected:this.props.selected?true:false
    }
  },
  unselectFrame:function(){
    this.setState({
      selected:false,
    })
    this.props.changeIndex(-1);
  },
  selectFrame:function(){
    this.setState({
      selected:true
    })
  },
  componentDidMount:function(){
    if(this.props.selected){
      this._navigateTODetail();
    }
  },
  _navigateTODetail:function(thing){
    // this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
    this.props.onFrameClick(this.props.keyIndex);
    this.selectFrame();
    this.props.changeIndex(this.props.keyIndex);
  },

  render:function(){
    var _thing = this.props.thing;
    var ThingSelected = require('../HomePage/ThingSelected');
    var PeopleAround = require('../Users/PeopleAround');
    var ThingsRelated = require('../Users/ThingsRelated');
    if(this.state.selected==true){
      return(<ThingSelected
          onFrameClick={()=>{
                    this.setState({
                      selected:false,
                    });
                    this.props.changeIndex(-1);
                }}
          thing={this.props.thing}
          onSelectLayOut = {this.props.onSelectLayOut}
          navigator={this.props.navigator}
      />);
    }
    return(
        <View style={styles.thingframe}>
          <View style={styles.frame_img}>
            <TouchableOpacity style={styles.frame_img}
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
                    <ThingsRelated ownerId = {this.props.ownerId} iconWidth={13} iconHeight={13} iconColor={'orange'}  numberColor={'gold'} navigator={this.props.navigator} thing={this.props.thing}/>
                  </View>
                </View>
              </Image>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
});

var OwnerThingsList = React.createClass({

  mixins:[EventEmitterMixin],

  getInitialState: function() {
    return {
      things:[],
      noMoreData:false,
      selectIndex:-1,
      waiting:true,
      // animating:true
    };
  },
  
  unselectCurrentIndex:function(){
    let index = this.state.selectIndex;
    if(index>=0 && this['thingFrame'+index]){
      this['thingFrame'+index].unselectFrame();
    }
  },
  componentDidMount:function() {
    // this._getUserId();
    this._getOwnerThingsFromURL();
  },
  _getOwnerThingsFromURL:function(){
    // console.log('_getFavorThingsFromURL');
    if(!this.props.ownerId) return;
    // let url=g_ConstInfo.WEBUZZ_API_THINGS();
    let url=g_ConstInfo.WEBUZZ_API_OWNER_THINGS(this.props.ownerId);
    // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
    this._waiting();
    fetch(url)
        .then((response)=>response.json())
        .catch((error) => {
          alert("Can not get your things.Please retry");
          this._stopWaiting();
        })
        .then((responseData)=>{
          // storageHandler.refreshFavorsRelated(responseData);
          this.setState({
            things:responseData,
          })
          this._stopWaiting();

        })
        .done();
  },
  _waiting:function(){
    this.setState({
      waiting:true
    })
  },
  _stopWaiting:function(){
    this.setState({
      waiting:false
    })
  },
  render:function(){
    let _this = this;
    return(
        <View style={{flex:1}}>
          {
            this.state.waiting ? <IndicatorView/> : null
          }
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
            {
              this.state.things?
                  this.state.things.map(function(item,index){
                    return(
                        <ThingFrame
                            ownerId={_this.props.ownerId}
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
                  }):null
            }
            <View style={{height:48,width:ScrollItemWith}}/>
          </ScrollView>

        </View>
    );
  }
});

/*

var HomePageCell = React.createClass({
  mixins:[EventEmitterMixin],
  propTypes:{
    nextSence:React.PropTypes.func,
  },
  getInitialState:function(){
    return{
      isFavor:false,
      isWaiting:false
    }
  },
  componentDidMount:function(){
    let _this = this;
    storageHandler.checkIsFavorThings(this.props.thing,function(data){
      _this.setState({
        isFavor:data
      })
    });
  },
  _toNextSence:function(){
    // this.props.navigator.push({component:RegisterVeiw,params:{thing:this.props.thing}});
  },
  _checkIsMyThingBeforeAdd:function(){
    let _this = this;
    storageHandler.checkIsMyThings(this.props.thing,function(item){
      if(item == false){
        _this.setState({
          isWaiting:true,
        })
        _this._addToFavor();
      }else{
        alert('Can not add your own things to favor');
      }
    })
  },

  _addToFavor:function(){
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR();
    let _this = this;
    fetch(url,{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "ownerId":userid,
          "thingsId":[this.props.thing._id]
      })
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.status && res.status=="success"){
        _this.setState({
          isFavor:true
        })
        storageHandler.refreshFavorsRelatedFromURL(userid,function(data){
          if(data[_this.props.thing._id]==undefined){
            alert("Add this favor thing failed.")
          }
          else{
            //TODO:emit thing event to close refresh ducks
            // this.eventEmitter('emit','ducks'+this.props.thing._id,this._getDucks);
            _this._emitDucksRefresh(_this.props.thing);
            // _this.setState({
            //   isFavor:true
            // })
          }
          _this.setState({
            isWaiting:false,
          })
        });
      }
    });

  },
  _emitDucksRefresh:function(thing){
    // let thingId = thing._id;
    let eventId = 'ducks'+thing._id;
    this.eventEmitter('emit',eventId);
  },
  _deleteFavor:function(){
    this.setState({
      isWaiting:true,
    })
    let url = g_ConstInfo.WEBUZZ_API_USER_FAVOR()
    let _this = this;
    fetch(url,{
      method:'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "ownerId":userid,
          "thingsId":[_this.props.thing._id]
      })
    })
     .then(res=>res.json())
     .then(res=>{
       if(res.status && res.status=="success"){
         _this.setState({
           isFavor:false
         });
         storageHandler.refreshFavorsRelatedFromURL(userid,function(data){
           if(data[_this.props.thing._id]==undefined){
             _this._emitDucksRefresh(_this.props.thing);
            //  _this.setState({
            //    isFavor:false
            //  });
           }
           else{
             alert("Delete this favor thing failed.")
           }
           _this.setState({
             isWaiting:false,
           })
         });
       }
     });
  },
  _alertBeforeDelete:function(){
    AlertIOS.alert(
        'Information',
        'Are your sure to delete?',
        [
          {text: 'Delete', onPress:this._deleteFavor},
          {text: 'Keep', onPress: () => {},style:{backgroundColor:"red"}},
        ]
      );
  },
  _navigateTODetail:function(){
    var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
    this.props.navigator.push({component:ThingsDetailPage,name:this.props.thing.name,params:{userId:this.props.ownerId,thingItem:this.props.thing}});
    // console.log(this.props.navigator.getCurrentRoutes());
  },
	render:function(){
    var ThingsRelated = require('../Users/ThingsRelated');
    let operationImg = require('image!shape');
    let operationFunc = this._checkIsMyThingBeforeAdd;
    if(this.state.isFavor){
      operationImg = require('image!red-shape');
      operationFunc = this._deleteFavor;
    }
    if(this.state.isWaiting==true){
      operationFunc = ()=>{}
    }
    return(
			<View Style={{alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent:"flex-start",
        margin:5,
        flex:1
      }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex:1}}>
            <TouchableOpacity
              onPress={this._navigateTODetail}
              style={{width:imageWidth}}
            >
              <Image resizeMode={"cover"} style={{height:imageWidth/4*3,width:imageWidth,margin:10}}
                source={{uri:'data:image/jpeg;base64,'+this.props.thing.photo}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:10,flex:0.6,flexDirection:"column",justifyContent:"flex-start",height:imageWidth/4*3}}>
            <Text style={{fontSize:15,fontWeight:"bold",margin:10}}>{this.props.thing.name}</Text>
            <View style={{margin:5}}>
              <PeopleAround navigator={this.props.navigator} thing={this.props.thing}/>
            </View>
            <View style={{marginLeft:5}}>
              {/!*<IconNumber imageSource={require('image!rubber')} numberCount={"100"} />*!/}
              <ThingsRelated navigator={this.props.navigator} thing={this.props.thing}/>
            </View>
          </View>
          <View style={{flex:0.3,height:imageWidth/4*3+15,flexDirection:"column",justifyContent:"flex-end"}}>
            <TouchableOpacity style={{width:30,flex:1,justifyContent:"flex-end",flexDirection:"column"}}
              onPress={operationFunc}
            >
              {
                this.state.isWaiting? <IndicatorView/> : <Image style={{height:30,width:30,marginRight:10}} source={operationImg}/>
              }
            </TouchableOpacity>
          </View>
        </View>
        <UnderLine/>
      </View>
		)
	}
});

var OwnerThingsList = React.createClass({

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
    })
  },
	componentDidMount:function() {
  	this._getUserId();
    this._getOwnerThingsFromURL();
	},
  componentWillMount:function(){
    // console.log('componentWillMount;')
  },
	_getOwnerThingsFromURL:function(){
    // console.log('_getFavorThingsFromURL');
    if(!this.props.ownerId) return;
    // let url=g_ConstInfo.WEBUZZ_API_THINGS();
    let url=g_ConstInfo.WEBUZZ_API_OWNER_THINGS(this.props.ownerId);
    // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
    fetch(url)
      .then((response)=>response.json())
      .catch((error) => {
        alert("Can not get your things.Please retry");
        this.setState({
          dataSource:new ListView.DataSource({
		        rowHasChanged: (row1, row2) => row1 !== row2,
		      }),
        });
      })
      .then((responseData)=>{
        // storageHandler.refreshFavorsRelated(responseData);
        this.setState({
          dataSource:this.getDataSource(responseData),
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

      <HomePageCell ownerId={userid} thing={thing} navigator={this.props.navigator}/>

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
});
*/

module.exports= OwnerThingsList;
