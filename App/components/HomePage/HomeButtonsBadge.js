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

const styles = StyleSheet.create({
    buttonImg:{
        height:photoHeight,
        width:photoWidth,
        marginLeft:photoMargin,
    }
});

var HomeButtonsBadge = React.createClass({


    getInitialState:function(){
        return{
            badgeNumber:0
        }

    },
    // shouldComponentUpdate: function(nextProps, nextState) {
    //
    //     return nextProps.badgeNumber != this.props.badgeNumber
    // },
    render:function(){
        return(
            <View>
                {
                    this.props.badgeNumber>0?
                <Image source={require('image!main-badge')} style={{height:35,width:35,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{fontWeight:"bold",color:"#808285"}}>{this.props.badgeNumber}</Text>
                </Image>:null
                }
            </View>
        );
    }
});

module.exports = HomeButtonsBadge;