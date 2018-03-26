/**
 * Created by BrianLee on 16/7/1.
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

var AppLogin = require('react-native').NativeModules.AppLogin;
var Icon = require('react-native-vector-icons/FontAwesome');
var UserInfoHelper = require('../../common/UserInfoHelper');
var g_ConstInfo = require('react-native/../../constants/GlobalConstants');
var g_Lan = require('react-native/../../common/LanguagePackage');
var IndicatorView = require('react-native/../../components/IndicatorView');
var storageHandler = require('react-native/../../common/StorageHandler');

var UnderLine = require('react-native/../../components/UnderLine');

var Dimensions = require('Dimensions');
var imageWidth = (Dimensions.get('window').width - 10) / 4;
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;
var ThingsDetailPage = require("react-native/../../components/ThingDetails/ThingDetailMain");
// var RegisterVeiw = require("../RegisterPage/RegisterMainPage");


var ThingsTypeFrame = React.createClass({


    componentDidMount: function () {

    },

    _styles: StyleSheet.create({
        frameStyle: {
            alignItems: 'center',
            backgroundColor: 'white',
            flexDirection: 'column',
            justifyContent: "flex-start",
            margin: 5,
            flex: 1
        },
        titleView: {
            marginLeft: 10,
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            height: imageWidth / 4 * 3
        },
        titleStyle: {
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 5
        },
        locationViewStyle:{
            flexDirection:"row",
            marginLeft:10,
            alignItems:"center"
        },
    }),

    _jumpToThingsDetail:function () {
        this.props.navigator.push({component:ThingsDetailPage,name:this.props.thing.name,params:{userId:this.props.ownerId,thingItem:this.props.thing}});
    },

    render: function () {
        let PeopleAround = require('react-native/../../components/Users/PeopleAround');
        let ThingsRelated = require('react-native/../../components/Users/ThingsRelated');

        return (
            <View Style={this._styles.frameStyle}>

                <View style={{flexDirection:'row'}}>
                    <View>
                        <TouchableOpacity
                            onPress={this._jumpToThingsDetail}
                            style={{width:imageWidth}}>
                            <Image resizeMode={"cover"} style={{height:imageWidth,width:imageWidth,margin:10}}
                                   source={{uri:'data:image/jpeg;base64,'+this.props.thing.photo}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={this._styles.titleView}>
                        <Text style={this._styles.titleStyle}>
                            {this.props.thing.name}
                        </Text>
                        <View style={this._styles.locationViewStyle}>
                            <Image style={{width:10,height:13}} source={require('image!img-things-location')}/>
                            <Text style={{fontSize:12,color:"#A7A9AC",fontWeight:"normal",marginLeft:5}}>
                                {this.props.thing.name}
                            </Text>
                        </View>
                        <View style={{flexDirection:"row",marginTop:20}}>
                            <View style={{margin:5}}>
                                <PeopleAround iconWidth={13} iconHeight={13} navigator={this.props.navigator}
                                              iconColor={'gray'} numberColor={"#808285"} thing={this.props.thing}/>
                            </View>
                            <View style={{margin:5}}>
                                <ThingsRelated iconWidth={13} iconHeight={13} navigator={this.props.navigator}
                                               iconColor={'gray'} numberColor={"#808285"} thing={this.props.thing}/>
                            </View>
                        </View>
                    </View>

                </View>

                <UnderLine/>
            </View>
        )
    }
});

var ThingsType = React.createClass({
    getInitialState: function () {
        return {
            things: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    },

    componentDidMount: function () {
        this._getThingsType(this.props.typeName);
    },

    _getThingsType: function (typeName) {
        let _this = this;
        this._loading.show();
        storageHandler.getThingsByTypes(typeName, function (data) {
            _this.listGetDataSource(data);
            _this._loading.hidden();
        })
    },

    listRenderRow: function (rowData, sectionID, rowID, highlightRow) {

        return (
            <ThingsTypeFrame navigator={this.props.navigator} thing={rowData}/>
        )
    },

    listGetDataSource: function (things) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // console.log(ds.cloneWithRows(friendsThings));
        // return this.state.dataSource.cloneWithRows(friendsThings);
        this.setState({
            dataSource: ds.cloneWithRows(things)
        });
    },
    listRenderFooter:function () {
        return(
            <View style={{width:windowWidth,height:50}} />
        )
    },

    render: function () {
        return (
            <View style={{flex:1}}>
                <IndicatorView refMode={true} ref={(c) => {this._loading = c}}/>
                <ListView
                    renderRow={this.listRenderRow}
                    dataSource={this.state.dataSource}
                    renderFooter={this.listRenderFooter}
                />
            </View>
        );

        // return(
        //     <View>
        //         <Text>1111</Text>
        //     </View>
        // )
    }
});

module.exports = ThingsType;