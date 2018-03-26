/**
 * Created by BrianLee on 16/6/27.
 */
'use stric';

var React = require('react-native');
var AppLogin = require('react-native').NativeModules.AppLogin;
var Icon = require('react-native-vector-icons/FontAwesome');
var UserInfoHelper = require('../../common/UserInfoHelper');
var g_ConstInfo = require('react-native/../../constants/GlobalConstants');
var IndicatorView = require('react-native/../../components/IndicatorView');
var storageHandler = require('react-native/../../common/StorageHandler');
var UnderLine = require('react-native/../../components/UnderLine');

var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var headImageWidth = windowWidth / 1242 * 355;
var ThingFrame = require("react-native/../../components/ThingDetails/ThingFrame");

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

var FriendDetail = React.createClass({
    getInitialState:function(){
        return{
            selectIndex:-1
        }
    },

    _styles:StyleSheet.create({
        headerView:{
            width:windowWidth,
            height:windowWidth*2/4,
            flexDirection:"column",
            justifyContent:"flex-start"
        },
        headerImage:{
            width:headImageWidth,
            height:headImageWidth,
            position:"absolute",
            left:(windowWidth/2)-(headImageWidth/2),
            top:(windowWidth*2/4)/7.39,
        },

        headerMask:{
            width:windowWidth,
            height:windowWidth*2/4,
            flexDirection:"column",
            justifyContent:"flex-end",
            alignItems:"center"
        }
    }),

    unselectCurrentIndex: function () {
        let index = this.state.selectIndex;
        if (index >= 0 && this['thingFrame' + index]) {
            this['thingFrame' + index].unselectFrame();
        }
    },

    render:function(){
        let imageSource = UserInfoHelper.getUserPhotoWithUserInfo(this.props.ownerInfo);
        let _this = this;
        return(
            <ScrollView ref="homeSV">
                <View style={this._styles.headerView}>
                    <Image source={imageSource} style={this._styles.headerImage} resizeMode={"cover"}/>
                    <Image source={require('image!img-friends-headimg')} style={this._styles.headerMask} >
                    {
                        <View
                            style={{
                                height:windowWidth*2/4-(windowWidth*2/4)/7.39-headImageWidth,
                                width:windowWidth,
                                flexDirection:"column",
                                justifyContent:"center",
                                alignItems:"center"
                            }}>
                            <Text style={this._styles.nickName}>
                            {
                                this.props.ownerInfo.nickname
                            }
                            </Text>
                        </View>
                    }
                    </Image>
                </View>
                <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                {
                    this.props.things.map(function (item, index) {
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
                </View>
                <View style={{height:48}}/>
            </ScrollView>
        )

    }
});




module.exports = FriendDetail;