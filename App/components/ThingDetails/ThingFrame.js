/**
 * Created by BrianLee on 16/6/27.
 */
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
var ThingSelected = require('react-native/../../components/HomePage/ThingSelected');
var PeopleAround = require('react-native/../../components/Users/PeopleAround');
var IconNumber = require('react-native/../../components/IconNumber');
var ThingsRelated = require('react-native/../../components/Users/ThingsRelated');
var Dimensions = require('Dimensions');
var ViewItemWith = (Dimensions.get('window').width - 15) / 2;

var ThingFrame = React.createClass({

    getInitialState: function () {
        return {
            peopleAround: parseInt(Math.random() * 10),
            selected: this.props.selected ? true : false
        }
    },
    unselectFrame: function () {
        this.setState({
            selected: false,
        });
        this.props.changeIndex(-1);
    },
    selectFrame: function () {
        this.setState({
            selected: true
        })
    },
    componentDidMount: function () {
        if (this.props.selected) {
            this._navigateTODetail();
        }
    },
    _navigateTODetail: function (thing) {
        // this.props.navigator.push({component:ThingsDetailPage,name:thing.name,params:{userId:userid,thingItem:thing}});
        this.props.onFrameClick(this.props.keyIndex);
        this.selectFrame();
        this.props.changeIndex(this.props.keyIndex);
    },

    _styles:StyleSheet.create({
        thingframe: {
            // width:138,
            height: ViewItemWith,
            // height:96,
            marginLeft: 5,
            marginBottom: 5
        },
        thingframe_img: {
            // width:138,
            width: ViewItemWith,
            height: ViewItemWith,
            // borderRadius:10
            justifyContent: "flex-end",
            flexDirection: "column",
        },
        thingframe_imgBar: {
            width: ViewItemWith,
            height: ViewItemWith / 6,
            backgroundColor: "black",
            opacity: 0.8,
            flexDirection: 'row',
            justifyContent: "flex-start",
            alignItems: "center",
        }
    }),

    render: function () {
        var _thing = this.props.thing;
        if (this.state.selected == true) {
            return (<ThingSelected
                onFrameClick={()=>{
            this.setState({
              selected:false,
            });
            this.props.changeIndex(-1);
        }}
                thing={this.props.thing}
                onSelectLayOut={this.props.onSelectLayOut}
                navigator={this.props.navigator}
            />);
        }
        return (
            <View style={this._styles.thingframe}>
                <View style={this._styles.frame_img}>
                    <TouchableOpacity
                        style={this._styles.frame_img}
                        onPress={()=>{this._navigateTODetail(_thing)}}
                    >
                        <Image
                            style={this._styles.thingframe_img}
                            source={{uri:'data:image/jpeg;base64,'+_thing.photo}}
                        >
                            <View style={this._styles.thingframe_imgBar}>
                                <View style={{margin:5}}>
                                    <PeopleAround
                                        iconWidth={10}
                                        iconHeight={13}
                                        numberColor={'white'}
                                        navigator={this.props.navigator}
                                        thing={this.props.thing}/>
                                </View>

                                <View style={{margin:5}}>
                                    <ThingsRelated
                                        iconWidth={13}
                                        iconHeight={10}
                                        iconColor={'orange'}
                                        numberColor={'gold'}
                                        navigator={this.props.navigator}
                                        thing={this.props.thing}/>
                                </View>
                            </View>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

module.exports = ThingFrame;