'user strict'

import React, {
    StyleSheet,
    Text,
    Image,
    View,
    Navigator,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var photoMargin = 5;
var photoWidth = (windowWidth-photoMargin*3)/2;
var photoHeight = photoWidth/4*3-10;
var HomeButtonsBadge = require('./HomeButtonsBadge');
var EventEmitterMixin = require('react-event-emitter-mixin');
var g_Lan = require('../../common/LanguagePackage');

const styles = StyleSheet.create({
    buttonImg:{
        height:photoHeight,
        width:photoWidth,
        marginLeft:photoMargin,
        marginTop:photoMargin,
        flexDirection:"column",
        justifyContent:"flex-start"
    }
});

var HomeButtons = React.createClass({
    mixins:[EventEmitterMixin],
    getInitialState:function(){
        return{
            newBadge:0,
            nearByBadge:0,
            profileBadge:0
        }
    },
    _jumpToNew:function(){
        var NearByPage = require('./NewPage');
        let things = [];
        this.props.navigator.push({component:NearByPage,name:"New"});
    },
    _jumpToNearBy:function(){
        var NearByPage = require('./NearByPage');
        let things = [];
        if (this.props.nearByGroup && this.props.nearByGroup.things.length>0){
            things = this.props.nearByGroup.things;
        }
        this.props.navigator.push({component:NearByPage,name:"Near By",params:{things:things}});
    },
    _jumpToFavor:function(){
        this.eventEmitter('emit','jumptofavor');
    },
    _jumpToProfile:function(){

    },
    refreshNearByBadge:function(badge){
        this.setState({
            nearByBadge:badge
        })
    },
    componentDidMount:function(){

    },



    render:function(){
        return(
            <View style={{flexDirection:"column",justifyContent:"flex-start"}}>
                <View style={{flexDirection:"row"}}>

                    <TouchableOpacity
                        onPress={this._jumpToNearBy}
                    >
                        <Image style={[styles.buttonImg]} resizeMode={"cover"} source={require('image!img-home-nearby')}>
                            <View style={{width:photoWidth,flexDirection:"row",justifyContent:"flex-end"}}>
                                <HomeButtonsBadge badgeNumber={this.state.nearByBadge}/>
                            </View>
                        </Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._jumpToNew}
                    >
                        <Image style={[styles.buttonImg,{marginRight:photoMargin}]} resizeMode={"cover"} source={require('image!img-home-new')}>
                            <View style={{width:photoWidth,flexDirection:"row",justifyContent:"flex-end"}}>
                                <HomeButtonsBadge badgeNumber={this.state.newBadge}/>
                            </View>
                        </Image>
                    </TouchableOpacity>

                </View>
                <View style={{flexDirection:"row",marginBottom:5}}>
                    <TouchableOpacity>
                        <Image style={[styles.buttonImg]} resizeMode={"cover"} source={require('image!img-home-popular')}/>
                        {/*<View style={{width:photoWidth,flexDirection:"row",justifyContent:"flex-end"}}>
                            <HomeButtonsBadge badgeNumber={this.state.profileBadge}/>
                        </View>*/}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._jumpToFavor}
                    >
                        <Image style={[styles.buttonImg,{marginRight:photoMargin}]} resizeMode={"cover"} source={require('image!img-home-favor')}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

module.exports = HomeButtons;