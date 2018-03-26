/**
 * Created by BrianLee on 16/6/29.
 */
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

var AppLogin = require('react-native').NativeModules.AppLogin;
var Icon = require('react-native-vector-icons/FontAwesome');
var UserInfoHelper = require('../../common/UserInfoHelper');
var g_ConstInfo = require('react-native/../../constants/GlobalConstants');
var g_Lan = require('react-native/../../common/LanguagePackage');
var IndicatorView = require('react-native/../../components/IndicatorView');
var storageHandler = require('react-native/../../common/StorageHandler');
var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var UnderLine = require('react-native/../../components/UnderLine');



var CategoriesFrame = React.createClass({

    _styles:StyleSheet.create({
        linkRow:{
            width:windowWidth-10,
            height:50,
            flexDirection:"row",
            justifyContent:"flex-start",
            alignItems:"center"
        },
        linkRowLeft:{
            // flex:1,
            flexDirection:"row",
            justifyContent:"flex-start",
            marginLeft:10
        },
        linkMiddle:{
            flex:1,
            marginLeft:10,
            flexDirection:"column",
            alignItems:"flex-start",
            justifyContent:"flex-end",
            height:20
        },
        linkRowRight:{
            flex:1,
            flexDirection:"row",
            justifyContent:"flex-end",
            alignItems:'center',
            marginRight:5
        },
    }),
    _jumpToHomePage: function () {
        var ThingsType = require('react-native/../../components/HomePage/ThingsType');
        this.props.navigator.push({component:ThingsType,name:this.props.rowData.name,params:{typeName:this.props.rowData.name}})
    },
    render:function () {
        let angleRight = <Icon name="angle-right" style={{margin:5}} size={30} color="gainsboro" />;
        return(
            <View
                style={{
                    width:windowWidth,
                    flexDirection:"column",
                    justifyContent:"center",
                    height:50,
                    borderBottomWidth:1,
                    borderBottomColor:"aliceblue"
                }}>

                    <TouchableOpacity
                        onPress={this._jumpToHomePage}
                        style={this._styles.linkRow}>
                        <View style={[this._styles.linkRowLeft]}>
                            <Text>{this.props.rowData.name}</Text>
                        </View>

                        <View style={this._styles.linkMiddle}>
                        </View>

                        <View style={this._styles.linkRowRight}>
                            {angleRight}
                        </View>
                    </TouchableOpacity>
            </View>
        )
    }
});

var Categories = React.createClass({

    getInitialState: function () {
        return{
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    },

    componentDidMount:function () {
      this._getCategories();
    },

    _getCategories: function(){
        let _this = this;
        storageHandler.getTypes(function(data){
            _this.listGetDataSource(data);
        });
    },

    listRenderRow: function(rowData, sectionID, rowID, highlightRow){

        return (
            <CategoriesFrame navigator={this.props.navigator} rowData = {rowData}/>
        )
    },

    listGetDataSource: function(types){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // console.log(ds.cloneWithRows(friendsThings));
        // return this.state.dataSource.cloneWithRows(friendsThings);
        this.setState({
            dataSource:ds.cloneWithRows(types)
        });
    },

    render:function () {
        return(
            <ListView
                renderRow={this.listRenderRow}
                dataSource={this.state.dataSource}
            />
        )
    }

});

module.exports = Categories;