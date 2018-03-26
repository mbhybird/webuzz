'use strict'
var React = require('react-native');
var {
	StyleSheet,
	Text,
	View,
	TextInput,
	Image,
	ListView,
	TouchableHighlight,
	Navigator,
  TouchableOpacity,
    ScrollView,
  ActivityIndicatorIOS,
    InteractionManager
} = React;
var BeaconList = require("../BeaconList");

/*const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
    height:60,
    alignItems:'center',
  },
});*/

var resultsCache = {
	total :{},
	data :[],
	nextPage : 0,
  index:{},
};
var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width-10)/2;
var g_ConstInfo = require("../../constants/GlobalConstants.js");
// var getURL = "http://arts.things.buzz:2397/api/things";
var getURL = g_ConstInfo.WEBUZZ_API_THINGS();
var currentPage = "&NextCursor=";
var AppLogin = require('react-native').NativeModules.AppLogin;
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
var ThingDetailTabBar = require("../ThingDetails/ThingDetailTabBar");
var UnderLine = require("../UnderLine");

var EventEmitterMixin = require('react-event-emitter-mixin');
var userid;


var ThingSelected = require('../HomePage/ThingSelected');
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');
var IndicatorView = require('../IndicatorView');
var ScrollItemWith = (Dimensions.get('window').width - 15)/2;

/*var HomePageCell = React.createClass({
  // _navigateToComment:function(){
  //   // alert(userid);
  //   this.props.navigator.push({component:Comment,params:{userId:userid,thingsId:this.props.thing._id}});
  // },
  _navigateTODetail:function(){
    this.props.navigator.push({component:ThingsDetailPage,name:this.props.thing.name,params:{userId:userid,thingItem:this.props.thing}});
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
          <View style={{flex:1.2}}>
            <TouchableOpacity
              onPress={this._navigateTODetail}
              style={{width:imageWidth}}
            >
              <Image resizeMode={"cover"} style={{height:imageWidth/4*3,width:imageWidth,margin:10}}
                source={{uri:'data:image/jpeg;base64,'+this.props.thing.photo}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop:10,flex:1,flexDirection:"column",justifyContent:"flex-start",height:imageWidth/4*3}}>
            <Text style={{fontSize:15,fontWeight:"bold",margin:10}}>{this.props.thing.name}</Text>
            <View style={{margin:5}}>
              <PeopleAround navigator={this.props.navigator} thing={this.props.thing}/>
            </View>
            <View style={{margin:5}}>
              <ThingsRelated navigator={this.props.navigator} thing={this.props.thing} />
            </View>
          </View>
        </View>
        <UnderLine/>
      </View>
		)
	}
});

var HomePage = React.createClass({

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
    AppLogin.getUserIdFromNative(function(data){
        userid=data;
    })
  },
	componentDidMount:function() {
    console.log("homepage componentDidMount")
    this.setState({
      dataSource: this.getDataSource(resultsCache.data),
    });
  	this._getUserId();
    this._getThingsFromURL();
    this.eventEmitter('on','eventA',(a,b)=>{
        // alert(this.name); //'parent'
        // alert(a+b); //'foobar'
        this.setState({
          noMoreData:false
        })
        // this._getUserId();
        this._getThingsFromURL();
    });
	},

	_getThingsFromURL:function(page:number | string){
		if (this.state.noMoreData) return;
    // this.setState({
    //   animating:true
    // })
  	fetch(getURL)
    .then((response) => response.json())
    .catch((error) => {
      alert("Can not connect to server");
      // this.setState({
      //   dataSource: this.getDataSource([]),
      //   animating:false,
      // });
    })
    .then((responseData) => {
      if(!responseData){
        // this.setState({
        //   animating:false
        // })
        return;
      }

      var resultList = [];
      var hasNewRecord = false;

      for(var i = responseData.length-1;i>=0;i--)
      {
        if(responseData[i].photo && resultsCache.index[responseData[i]._id] == undefined)
        {
          resultList.push(responseData[i]);
          // resultList[responseData[i]._id] = responseData[i];
          resultsCache.index[responseData[i]._id] = i;
          hasNewRecord = true
        }
      }

      if(resultList.length>0 && hasNewRecord){
          // resultsCache.data = resultList;
          resultList.map(function(item){
            resultsCache.data.push(item)
          })

          this.setState({
            dataSource: this.getDataSource(resultsCache.data),
            noMoreData:true,
            // animating:false,
          });
      }
    })
    .done();

	},

	getDataSource: function(things: Array<any>): ListView.DataSource {
  	return this.state.dataSource.cloneWithRows(things);
	},
	onEndReached:function()
	{
    // alert("reach");
		if(this.state.noMoreData)
		{
			return;
		}
		else
		{
			//alert(resultsCache.nextPage);
			this._getThingsFromURL(resultsCache.nextPage);
		}
	},

	renderRow: function(
  thing: Object,
  sectionID: number | string,
  rowID: number | string,
  highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,)
  {
    return (

      <HomePageCell thing={thing} navigator={this.props.navigator}/>

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
    // if(this.state.animating===true)
    // {
    //   return(
    //     <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    //       <ActivityIndicatorIOS
    //         style={{height: 80,justifyContent:"center",alignItems:"center"}}
    //         animating={this.state.animating}
    //         color="black"
    //         size="large"
    //         hidesWhenStopped={true}
    //       />
    //     </View>
    //   );
    // }
		return(
      <View style={{flex:1}}>
        {/!*<View style={styles.navBar}></View>*!/}
        {/!*<UnderLine/>*!/}
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
      </View>
		);
	}
});*/

const styles= StyleSheet.create({
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
    // getInitialstate:function(){
    //   return{
    //     peopleAround:parseInt(Math.random() * 10 )
    //   }
    // }

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
                                    <PeopleAround  iconWidth={10} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                                </View>

                                <View style={{margin:5}}>
                                    <ThingsRelated iconWidth={13} iconHeight={10} numberColor={'orange'} navigator={this.props.navigator} thing={this.props.thing}/>
                                </View>
                            </View>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

var HomePage = React.createClass({

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
    _getUserId:function(){
        let _this = this;
        AppLogin.getUserIdFromNative(function(data){
            userid=data;
            // console.log('getUserIdFromNative;');
        })
    },
    unselectCurrentIndex:function(){
        let index = this.state.selectIndex;
        if(index>=0 && this['thingFrame'+index]){
            this['thingFrame'+index].unselectFrame();
        }
    },
    _setDataFromCache:function(){
        this.setState({
            things: resultsCache.data,
        });
        this._stopWaiting();
    },
    componentDidMount:function(){
        InteractionManager.runAfterInteractions(()=>{
            this._setDataFromCache();
            this._getUserId();
            this._getThingsFromURL();
            this.eventEmitter('on','eventA',(a,b)=>{
                // alert(this.name); //'parent'
                // alert(a+b); //'foobar'
                this.setState({
                    noMoreData:false
                })
                // this._getUserId();
                this._getThingsFromURL();
            });
        });
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
    _getThingsFromURL:function(page){
        if (this.state.noMoreData) return;
        this._waiting();
        fetch(getURL)
            .then((response) => response.json())
            .catch((error) => {
                alert("Can not connect to server");
                // this.setState({
                //   dataSource: this.getDataSource([]),
                //   animating:false,
                // });
                this._stopWaiting();
            })
            .then((responseData) => {
                if(!responseData){
                    // this.setState({
                    //   animating:false
                    // })
                    this._stopWaiting();
                    return;
                }

                var resultList = [];
                var hasNewRecord = false;

                for(var i = responseData.length-1;i>=0;i--)
                {
                    if(responseData[i].photo && resultsCache.index[responseData[i]._id] == undefined)
                    {
                        resultList.push(responseData[i]);
                        // resultList[responseData[i]._id] = responseData[i];
                        resultsCache.index[responseData[i]._id] = i;
                        hasNewRecord = true
                    }
                }

                if(resultList.length>0 && hasNewRecord){
                    // resultsCache.data = resultList;
                    resultList.map(function(item){
                        resultsCache.data.push(item)
                    })

                    this.setState({
                        things: resultsCache.data,
                        noMoreData:true,
                        // animating:false,
                    });
                }
                this._stopWaiting();
            })
            .done();

    },
    _styles:{
        contentContainerStyle:{
            alignItems:"center",
            flexDirection:"row",
            justifyContent:"flex-start",
            flexWrap:"wrap"
        },
        scrollViewStyle:{
            flex:1,
            width:Dimensions.get('window').width
        },
        indicatorViewStyle:{
            width:Dimensions.get('window').width,
            justifyContent:"center",
            flexDirection:"row"
        }
    },
    render:function(){
        let _this = this;
        return(
            <View style={{flex:1}}>
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    ref="homeSV"
                    contentContainerStyle={this._styles.contentContainerStyle}
                    style={this._styles.scrollViewStyle}>
                    {
                        this.state.waiting ?
                            <View style={this._styles.indicatorViewStyle}>
                                <IndicatorView/>
                            </View>
                            : null
                    }
                    {
                        this.state.things.map(function(item,index){
                            return(
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
                    <View style={{height:48}}/>
                </ScrollView>

            </View>
        );
    }
});

module.exports = HomePage;
