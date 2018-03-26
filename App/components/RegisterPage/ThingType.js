
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
  Picker,
  NativeModules
} = React;

var g_ConstInfo = require("../../constants/GlobalConstants.js");

var ThingType = React.createClass({
  propTypes:{
    type:React.PropTypes.string,
    subType:React.PropTypes.string,
  },
  getInitialState:function(){
    return{
      type:"",
      subType:"",
      types:[],
      subTypes:[],
      typeExist:false,
    }
  },
  componentDidMount:function(){
    this._getThingType();
    this._getTypes();
  },
  _refreshSubType:function(type){

    // this.setState({type:type})
    let subTypes = [];
    for (var statetype of this.state.types) {
      if(statetype.name==type){
        subTypes = statetype.subType
      }
    }
    this.setState({
      type:type,
      subType:subTypes[0].name,
      subTypes:subTypes,
    });
    this.props.setType(this.state.type,this.state.subType);
  },
  _subTypeChange:function(type){
    this.props.setType("",type);
    this.setState({
      subType:type
    });
  },
  _getTypes:function(){
    let url = g_ConstInfo.WEBUZZ_API_TYPE();
    let _this = this
    // let url = "";
    fetch(url)
      .then((response)=>response.json())
      .catch((error) => {
        alert("error");
      })
      .then((responseData)=>{
        if(responseData){

          let subTypes = [];
          for (var type of responseData) {
            if(type.name==_this.props.type){
              subTypes = type.subType
            }
          }
          if(!subTypes || subTypes.length<=0)
          {
            subTypes = responseData[0].subType;
            _this.setState({
              type:responseData[0].name,
              subType:responseData[0].subType[0].name,
            })
            _this.props.setType(_this.state.type,_this.state.subType)
          }
          _this.setState({
            types:responseData,
            subTypes:subTypes,
          });
        }

      })
      .done();
  },
  _getThingType:function()
  {

    let defaltType = "";
    let defaltSubType = "";

    if(this.props.type && this.props.subType){
      defaltType = this.props.type;
      defaltSubType = this.props.subType;
    }

    this.setState({
        type:defaltType,
        subType:defaltSubType,
    })
  },
  render:function(){
    return(
      <View style={{flexDirection:"column",flex:1,height:190,backgroundColor:"#8FBC8F"}}>
        <View style={{borderColor:'lightgray',flexDirection:"row",justifyContent:"flex-start"}}>
          <Text style={{color:"grey",fontSize:16}}>Select Thing's Type</Text>
        </View>
        <View style={{height:200,overflow:"hidden"}}>
          <Picker
            style={{height:200}}
            selectedValue={this.state.type}
            onValueChange={this._refreshSubType}>
            {
              this.state.types.map(function(type,index){
                return (<Picker.Item  key={index} label={type.tag} value={type.name} />)
              })
            }
          </Picker>
        </View>
        <View style={{borderColor:'lightgray',flexDirection:"row",justifyContent:"flex-start"}}>
          <Text style={{color:"grey",fontSize:16}}>Sub Type</Text>
        </View>
        <View style={{height:200,overflow:"hidden"}}>
          <Picker
            style={{height:200}}
            selectedValue={this.state.subType}
            onValueChange={this._subTypeChange}>
            {
              this.state.subTypes.map(function(subType,index){
                return (<Picker.Item key={index} label={subType.tag} value={subType.name} />)
              })
            }
          </Picker>
        </View>
      </View>
    )
 }
});

module.exports = ThingType;
