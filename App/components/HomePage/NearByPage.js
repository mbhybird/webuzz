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



var g_ConstInfo = require("../../constants/GlobalConstants.js");
var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width-10)/2;
var EventEmitterMixin = require('react-event-emitter-mixin');
var storageHandler = require('../../common/StorageHandler');
var AppLogin = require('react-native').NativeModules.AppLogin;


var ThingSelected = require('../HomePage/ThingSelected');
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');
var IndicatorView = require('../IndicatorView');
var ScrollItemWith = (Dimensions.get('window').width - 15)/2;
var ThingsDetailPage = require("../ThingDetails/ThingDetailMain");

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
                    <TouchableOpacity
                        style={styles.frame_img}
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

var NearByPage = React.createClass({

    mixins:[EventEmitterMixin],

    getInitialState: function() {
        return {
            things:[],
            noMoreData:false,
            selectIndex:-1,
            waiting:false,
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
                        this.props.things?
                        this.props.things.map(function(item,index){
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
                        }):null
                    }
                    <View style={{height:48}}/>
                </ScrollView>

            </View>
        );
    }
});

module.exports= NearByPage;
