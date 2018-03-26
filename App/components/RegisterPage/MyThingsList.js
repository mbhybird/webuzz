'use strict';
var React = require('react-native');
var RegisterVeiw = require("../RegisterPage/RegisterMainPage");
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var UnderLine = require('../UnderLine');
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width-10)/4;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var storageHandler = require('../../common/StorageHandler');
var UserInfoHelper = require('../../common/UserInfoHelper');
var SwiperOut = require('react-native-swipeout');

var ThingsRelated = require('../Users/ThingsRelated');

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
});
var HomePageCell = React.createClass({
  propTypes:{
    nextSence:React.PropTypes.func,
  },
  _toNextSence:function(){
    this.props.navigator.push({component:RegisterVeiw,params:{thing:this.props.thing,refreshMyThing:this._fetchThingsByOwnerID}});
  },
  _navigateTODetail:function(){
    this.props.navigator.push({component:ThingsDetailPage,name:this.props.thing.name,params:{userId:this.props.ownerId,thingItem:this.props.thing}});
  },
	render:function(){
    return(
      <View Style={{alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent:"flex-start",
        margin:5,
        flex:1
      }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{}}>
            <TouchableOpacity
              onPress={this._navigateTODetail}
              style={{width:imageWidth}}
            >
              <Image resizeMode={"cover"} style={{height:imageWidth,width:imageWidth,margin:10}}
                source={{uri:'data:image/jpeg;base64,'+this.props.thing.photo}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginLeft:10,flex:1,flexDirection:"column",justifyContent:"flex-start",height:imageWidth/4*3}}>
            <Text style={{fontSize:15,fontWeight:"bold",marginLeft:10,marginTop:10,marginBottom:5}}>{this.props.thing.name}</Text>
            <View style={{flexDirection:"row",marginLeft:10,alignItems:"center"}}>
              <Image style={{width:10,height:13}} source={require('image!img-things-location')}/>
              <Text style={{fontSize:12,color:"#A7A9AC",fontWeight:"normal",marginLeft:5}}>{this.props.thing.name}</Text>
            </View>
            <View style={{flexDirection:"row",marginTop:20}}>
              <View style={{margin:5}}>
                <PeopleAround  iconWidth={13} iconHeight={13}  navigator={this.props.navigator} iconColor={'gray'} numberColor={"#808285"} thing={this.props.thing}/>
              </View>
              <View style={{margin:5}}>
                <ThingsRelated  iconWidth={13} iconHeight={13}  navigator={this.props.navigator} iconColor={'gray'} numberColor={"#808285"} thing={this.props.thing}/>
              </View>
            </View>
          </View>
          <View style={{height:imageWidth+10,marginRight:10,flexDirection:"column",justifyContent:"flex-end"}}>
            <TouchableOpacity style={{width:30,flex:1,justifyContent:"flex-end",flexDirection:"column"}}
              onPress={this._toNextSence}
            >
              <Image style={{height:30,width:30,marginRight:10}} source={require('image!icon-black-editthing')}/>
            </TouchableOpacity>
          </View>
        </View>
        <UnderLine/>
      </View>
		)
	}
});

var LoginGuidePage = React.createClass({
  render:function(){
    return(
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

var MyThingsPage = React.createClass({
  propTypes:{
    things:React.PropTypes.array,
    ownerId:React.PropTypes.string,
    nextSence:React.PropTypes.func,
  },
  render:function(){
    return(
      <View style={{flex:1}}>
        {/*<View style={[styles.navBar1,{backgroundColor:"black"}]}></View>*/}
        <MyThingsList {...this.props}/>
      </View>
    );
  }
});
var MyThingsList = React.createClass({

  propTypes:{
    things:React.PropTypes.array,
    ownerId:React.PropTypes.string,
    nextSence:React.PropTypes.func,
  },

  getInitialState:function(){
    return{
      Refresh:false,
      thingsList:new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLogin:false,
      things:[],
      ownerId:""
    }
  },

  componentWillMount:function(){
    if(!this.props.ownerId){
      this.setState({
        isLogin:false,
        ownerId:""
      })
    } else {
      this.setState({
        isLogin:true,
        ownerId:this.props.ownerId
      })
    }
  },
  componentDidMount:function()
  {
    // alert(g_ConstInfo.WEBUZZ_HOST)
    this._fetchThingsByOwnerID();
  },
  _onDeleteMyThing: function (rowId) {
    let things = this.state.things;
    things.splice(rowId,1);
    this.setState({
      thingsList: this._getDataSource(things),
      things:things,
    });
    // console.log(this.state.thingsList);

  },
  renderRow: function(thing, sectionID, rowID, highlightRowFunc)
  {
    var _nextSence= this.props.nextSence;
    var swipeoutBtns = [
      {
        text: 'Delete',
        backgroundColor:"red",
        onPress:()=>{this._onDeleteMyThing(rowID)}
      }
    ];
    return (
      <SwiperOut
          autoClose={true}
          backgroundColor={"white"}
          right={swipeoutBtns}>
        <HomePageCell thing={thing} nextSence={_nextSence} navigator={this.props.navigator}/>
      </SwiperOut>

    );
  },

  _getThingsList:function(){
    _things = this.props.things;
    if (_things && _things.length>0) {
      this.setState({
        thingsList:this._getDataSource(_things),
      });
    }
    else {

    }
  },

  _getDataSource: function(things) {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(things);
  },

  _fetchThingsByOwnerID:function(data)
  {
    let ownerid = "";
    if(data && data != ""){
      ownerid = data;
    }
    if(this.state.ownerId && this.state.ownerId != ""){
      ownerid = this.state.ownerId;
    }
    // let url=g_ConstInfo.WEBUZZ_API_THINGS();
    let url=g_ConstInfo.WEBUZZ_API_OWNER_THINGS(ownerid);
    // let url=g_ConstInfo.WEBUZZ_HOST + g_ConstInfo.WEBUZZ_API_THINGS;
    fetch(url)
      .then((response)=>response.json())
      .catch((error) => {
        alert("Can not get your things.Please retry");
        this.setState({
          thingsList:new ListView.DataSource({
		        rowHasChanged: (row1, row2) => row1 !== row2,
		      }),
          things:[]
        });
      })
      .then((responseData)=>{
        storageHandler.refreshMyThingsHash(responseData);
        this.setState({
          thingsList:this._getDataSource(responseData),
          things:responseData
        })
      })
      .done();
  },
  _jumpToRegister: function(){
    this.props.navigator.push({component:RegisterVeiw,name:"Register"});
  },

  _showLoginPage:function(){
    let _this = this;
    UserInfoHelper.showLoginPageAndGetLoginId(function(data){
      if(data){
        _this._fetchThingsByOwnerID(data);
        _this.setState({
          isLogin:true,
          ownerId:data
        })
      }
    })
  },

  render:function(){
    // if(this.state.thingsList.getRowCount()===0)
    // {
    //   return (
    //     <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    //       <TouchableOpacity
    //         onPress={this.props.navigator.pop}
    //       >
    //         <Text style={{fontSize:20}}>Back</Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
    if(!this.state.isLogin){
      return (
          <LoginGuidePage logIn={this._showLoginPage} />
      )
    }
    return(
        // <View style={[styles.navBar1,{backgroundColor:"black"}]}></View>
        <View style={{flex:1}}>
          {/*
           <View style={{justifyContent:"center",flexDirection:"row"}}>
           <TouchableOpacity
           onPress={this._jumpToRegister}
           >
           <Image style={{margin:30}} source={require('image!shapes')}/>
           </TouchableOpacity>
           </View>
           */}
            <Image
                style={{
              width:windowWidth,
              height:windowWidth * 2/4,
              justifyContent:"center",
              flexDirection:"column",
              alignItems:"center"
            }}

                source={require('image!img-mything-headimg')}>
              <TouchableOpacity
                  onPress={this._jumpToRegister}
                  style={{width:windowWidth/3,height:windowWidth/3}}
              />
            </Image>
            <ListView
                ref="listview"
                dataSource={this.state.thingsList}
                renderRow={this.renderRow}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={true}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
  }
});

module.exports= MyThingsPage;
