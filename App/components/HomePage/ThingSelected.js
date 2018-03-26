'use strict';

var React = require('react-native');
//增加NavigatorIOS
var {
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
} = React;

var windowWidth = Dimensions.get('window').width;
var windowHeight = windowWidth*3/4;
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var ThingToolBar = require('../ThingToolBar.js');
var imageMargin = 5;
var FlexDescription = require('../FlexDescription');

var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');

const styles = StyleSheet.create({
    thingframe_imgBar:{
        width:windowWidth,
        height:windowWidth/10,
        backgroundColor:"black",
        opacity:0.8,
        flexDirection:'row',
        justifyContent:"flex-start",
        alignItems:"center",
    },
});

var ThingSelected = React.createClass({

    getInitialState:function(){
        return{
            peopleAround:parseInt(Math.random() * 10 )
        }
    },

    _navigateTODetail:function(thing){
        this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
    },
    _setDescriptionHeight:function(){
        let windowHeight = Dimensions.get('window').height;
        // alert(windowHeight);
        if(windowHeight==667) {
            return 150;
        }
        else if (windowHeight==736) {
            return 195;
        }
        else {
            return 0;
        }
    },
    render:function(){
        var _thing = this.props.thing;
        return(
            <View onLayout={(e)=>{
                // console.log(e.nativeEvent.layout.y);
                this.props.onSelectLayOut(e.nativeEvent.layout);
            }}>
                <TouchableOpacity
                    onPress={this.props.onFrameClick}
                >
                    <Image style={{
                                width:windowWidth-10,
                                height:windowHeight,
                                marginLeft:imageMargin,
                                justifyContent:"flex-end",
                                flexDirection:"column",
                            }}
                           source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+_thing.photo}}
                    >
                        <View style={styles.thingframe_imgBar}>
                            <View style={{margin:5}}>
                                <PeopleAround  iconWidth={13} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thing}/>
                            </View>

                            <View style={{margin:5}}>
                                <ThingsRelated iconColor={'orange'} iconWidth={13} iconHeight={13} numberColor={'gold'} navigator={this.props.navigator} thing={this.props.thing}/>
                            </View>
                            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                                <Text style={{color:"white",marginRight:20}}>{_thing.name}</Text>
                            </View>
                        </View>
                    </Image>
                </TouchableOpacity>
                {/*<FlexDescription
                 descriptionHeight = {this._setDescriptionHeight()}
                 description={this.props.thing.description}
                 autoFlexText={true}
                 />*/}
                <View style={{margin:5}}>
                    <ThingToolBar navigator={this.props.navigator} thing={this.props.thing}/>
                </View>
            </View>
        );
    }
});

module.exports = ThingSelected;