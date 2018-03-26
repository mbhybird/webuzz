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
    TouchableOpacity,
    NativeAppEventEmitter,
    AppState,
    PushNotificationIOS
} = React;

var Dimensions = require('Dimensions');
var ScrollItemWith = (Dimensions.get('window').width - 15)/2;
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Swiper = require('react-native-swiper');
var UnderLine = require("../UnderLine");
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");
var AppLogin = require('react-native').NativeModules.AppLogin;
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var HomePage = require('../HomePage/HomePage');
var EventEmitterMixin = require('react-event-emitter-mixin');
var ThingsHomePage = require('./ThingsGroupPage');
var HomeButtons = require('./HomeButtons');
var userid;

var storageHandler = require('../../common/StorageHandler');

var ThingSelected = require('./ThingSelected');
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');
var IndicatorView = require('../IndicatorView');

const styles = StyleSheet.create({
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

var ThingsPromotePage = React.createClass({
    propTypes:{
        promoteGroup:React.PropTypes.object,
    },
    getInitialState:function(){
        return{
            dataSource:[],
        }
    },
    componentDidMount:function(){
        let _this = this;
        this._getPromoteThingPage();
        NativeAppEventEmitter.addListener('WeChat_Req',(req)=>{
            // console.log(this.state.isChecked);
            // this.setState({
            //     isLoading:true
            // });

            console.log(req);
            storageHandler.getThingFromStorage(req,function(thing){
                _this._navigateTODetail(thing);
            })
        });
    },
    shouldComponentUpdate:function(nextProps,nextState){
        // this.setState({
        //   this.state.dataSource = nextProps.promoteGroup,
        // });
        // alert(nextProps.promoteGroup.name);
        // alert(nextProps.promoteGroup.name);
        if(nextProps.promoteGroup !== this.props.promoteGroup)
        {
            this._refreshDataSource(nextProps.promoteGroup.things);
        }
        return nextProps.promoteGroup !== this.props.promoteGroup || nextState.dataSource !==this.state.dataSource;
    },
    _refreshDataSource:function(data){
        this.setState({
            dataSource:data,
        });
    },
    _getPromoteThingPage:function(){
        let url = g_ConstInfo.WEBUZZ_API_GROUPS('56fa02b9887a17e004000038');
        fetch(url)
            .then(response => response.json())
            .then(responseData => {

                this.setState({
                    dataSource:responseData.things,
                });

            });
    },
    _navigateTODetail:function(thing){
        this.props.navigator.push({
            component: ThingsDetailPage,
            name: thing.name,
            params: {thingItem: thing}
        });
    },
    render:function(){
        return(
            <Swiper
                autoplay={false}
                autoplayTimeout={10}
                showsPagination={true}
                automaticallyAdjustContentInsets={true}
                height = {128}
                dot={<View style={{backgroundColor:'white', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3}} />}
                paginationStyle={{
                  bottom: 0,
                  opacity:0.8,
                  left:Dimensions.get('window').width-this.state.dataSource.length*14,
                }}
                style={{height:128}}>
                {
                    this.state.dataSource.map(function(thing,index)
                    {
                        return(
                            <View key={index}>
                                <TouchableOpacity
                                    onPress={()=>this._navigateTODetail(thing)}
                                >
                                    <Image
                                        key={index}
                                        style={{width:Dimensions.get('window').width,height:128}}
                                        source={{uri:'data:image/jpeg;base64,'+thing.photo}}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    },this)
                }
            </Swiper>
        );
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

        this.props.navigator.push({
                component: ThingsDetailPage,
                name: thing.name,
                params: {thingItem: thing}
            });

        // this.props.onFrameClick(this.props.keyIndex);
        // this.selectFrame();
        // this.props.changeIndex(this.props.keyIndex);
    },

    render:function(){
        var _thing = this.props.thing;
        // if(this.state.selected==true){
        //     return(<ThingSelected
        //         onFrameClick={()=>{
        //             this.setState({
        //               selected:false,
        //             });
        //             this.props.changeIndex(-1);
        //         }}
        //         thing={this.props.thing}
        //         onSelectLayOut = {this.props.onSelectLayOut}
        //         navigator={this.props.navigator}
        //     />);
        // }
        return(
            <View style={styles.thingframe}>
                    <TouchableOpacity style={styles.frame_img} onPress={()=>{this._navigateTODetail(_thing)}} >
                        <Image style={styles.thingframe_img} source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+_thing.photo}}>

                            <View style={styles.thingframe_imgBar}>
                                <View style={{margin:5}}>
                                    <PeopleAround  iconWidth={13} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                                </View>
                                {
                                <View style={{margin:5}}>
                                    <ThingsRelated iconWidth={13} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                                </View>
                                }
                            </View>

                        </Image>
                    </TouchableOpacity>
            </View>
        );
    }
});

var m_nearByGroup ={
    "name":"near by",
    "things":[]
};

var ThingsMainScreen = React.createClass({
    mixins:[EventEmitterMixin],

    getInitialState:function(){
      return{
          things:[],
          nearByGroup:{
              "name":"near by",
              "things":[]
          },
          selectIndex:-1,
          waiting:true,
      }
    },
    componentDidMount:function(){
        this._getThingsGroup();
        this._onWalkInThings();
        this._onWalkOutThings();
        this._onLocalNotification();
    },
    _getThingsGroup:function(){
        // console.log("_getThingsGroup2");
        this._waiting();
        let url = g_ConstInfo.WEBUZZ_API_GROUPS('56fa53e08491984c0d000003');
        fetch(url)
            .then(response => response.json())
            .catch(err=>{this._stopWaiting()})
            .then(responseData => {
                if(responseData){
                    storageHandler.updateThingsStorage(responseData.things);
                }
                this.setState({
                    things:responseData.things
                })
                this._stopWaiting();
            });
    },
    unselectCurrentIndex:function(){
        let index = this.state.selectIndex;
        if(index>=0){
            this['thingFrame'+index].unselectFrame();
        }
    },
    _presentLocalNotification: function(thing){
        console.log("presentLocalNotification");
        //Add thing to data map
        storageHandler.setPushNotificationThing(thing);
        PushNotificationIOS.presentLocalNotification({
            alertBody:"发现一个新thing" + "\r\n" + thing.name,
            soundName:"default"
        })
    },
    _onWalkOutThings:function(){
        let _this = this;
        let _storage = g_ConstInfo.WEBUZZ_STORAGE;
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
                                });
                                _this.homeButtons.refreshNearByBadge(m_nearByGroup.things.length);
                                return;
                            }
                        }
                    }
                }
            }
        });
    },
    _onWalkInThings:function(){
        let _this = this;
        let _storage = g_ConstInfo.WEBUZZ_STORAGE;
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

                            if(AppState.currentState=="background"){
                                this._presentLocalNotification(responseData);
                            }

                            // if(routeList.length==1)
                            // {
                            //     // _this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
                            //     this._jumpToComment(thing);
                            // }
                            this.props.thingsNearBy(m_nearByGroup.things);

                            _storage.save({
                                key: 'nearByGroup',  //注意:请不要在key中使用_下划线符号!
                                rawData:m_nearByGroup,
                                //如果不指定过期时间，则会使用defaultExpires参数
                                //如果设为null，则永不过期
                                expires: 1000 * 3600
                            });

                            _this.homeButtons.refreshNearByBadge(m_nearByGroup.things.length);

                            this.setState({
                                nearByGroup:m_nearByGroup
                            })
                        }
                    })
                    .done();
            }
        })
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
    _onLocalNotification:function(){
        this.eventEmitter("on","localNotification",function(thing){
            if(thing && thing._id){
                this._navigateTODetail(thing);
            }
        });
    },
    _navigateTODetail:function(thing){
        this.props.navigator.push({
            component: ThingsDetailPage,
            name: thing.name,
            params: {thingItem: thing}
        });
    },
    render:function(){
        let _this = this;
        return(
            <ScrollView
                onLayout={(e)=>{
                    console.log(e.nativeEvent.layout);
                }}
                ref="homeSV"
                contentContainerStyle={{

                    flexDirection:"row",
                    justifyContent:"flex-start",
                    flexWrap:"wrap",
                    alignItems:"center",
                }}
                automaticallyAdjustContentInsets={false}
                style={{width:Dimensions.get('window').width}}
            >
                    <ThingsPromotePage  navigator={this.props.navigator}/>

                    <HomeButtons navigator={this.props.navigator} nearByGroup={this.state.nearByGroup} ref={(c)=>{_this.homeButtons =c}}/>
                    {
                        /*this.state.nearByGroup.things.map(function(item,indexNear){
                            let index = indexNear+_this.state.things.length;
                            return(<ThingFrame
                                ref={(c)=>{
                                    _this['thingFrame'+index]=c;

                                }}
                                selected={(indexNear===0 && _this.state.selectIndex===-1)}
                                changeIndex={(selectIndex)=>{
                                        _this.setState({
                                            selectIndex:selectIndex
                                        });
                                    }}
                                key={index}
                                keyIndex={index}
                                thing={item}
                                onSelectLayOut={(layout)=>{
                                        _this.refs.homeSV.scrollTo({x:0,y:layout.y,true})
                                    }}
                                navigator={_this.props.navigator}
                                onFrameClick={(i)=>_this.unselectCurrentIndex()}
                            />)
                        })*/
                    }
                    {
                        this.state.waiting?
                        <View
                            style={{width:Dimensions.get('window').width,justifyContent:"center",flexDirection:"row"}}
                        >
                            <IndicatorView/>
                        </View>:
                        this.state.things.map(function(item,index){
                            return(
                                <ThingFrame
                                    ref={(c)=>{_this['thingFrame'+index]=c}}
                                    changeIndex={(selectIndex)=>{
                                        _this.setState({
                                            selectIndex:selectIndex
                                        });
                                    }}
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
                    <View style={{height:48,width:Dimensions.get('window').width}}/>
            </ScrollView>
        );
    }
});

module.exports = ThingsMainScreen;