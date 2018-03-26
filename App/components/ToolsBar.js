/*
  简单的工具栏。
  toolIcons 为必填属性，用于显示绑定的icon，以数组形式传入<Image/> source 属性值。
  toolOnPressEvents 选填属性。以数组形式传入 Func ，Func会在对应index的icon onPress事件中促发。
*/

'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image
} = React;

var Dimensions = require('Dimensions');

var styles=StyleSheet.create({
  toolBar:{
    height:45,
    width:Dimensions.get("window").width,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-around",
  },
  toolBarIcon:{
    margin:5,
  },
  toolBarIconPng:{
    height:30,
    width:30,
    margin:5,
  },
});

var ToolsBar = React.createClass({
  propTypes:{
    toolIcons:React.PropTypes.array.isRequired,
    toolOnPressEvents:React.PropTypes.arrayOf(React.PropTypes.func),
  },
  render:function(){
    var toolBarIconSize = 30;
    var toolBarIconColor = "black";
    // var toolBarIconColor = "#5890FF";

    return(
        <View style={styles.toolBar}>
          {
            this.props.toolIcons.map(function(item,index){
              let _onPressFunc = function(){};
              let _onPressFuncArray = this.props.toolOnPressEvents;
              if(_onPressFuncArray && _onPressFuncArray[index])
              {
                _onPressFunc = _onPressFuncArray[index];
              }
              return(
                <TouchableOpacity key={index} onPress={_onPressFunc}>
                <Image style={styles.toolBarIconPng} source={item}/>
              </TouchableOpacity>
              )
            },this)
          }
        </View>

    )
  }
});

module.exports = ToolsBar;

// var ThingDetailToolBar = React.createClass({
//
//   render:function(){
//     var toolBarIconSize = 30;
//     var toolBarIconColor = "black";
//     // var toolBarIconColor = "#5890FF";
//     return(
//         <View style={styles.toolBar}>
//           <TouchableOpacity>
//             {/*<Icon name="info-circle" style={styles.toolBarIcon} size={toolBarIconSize} color={toolBarIconColor} />*/}
//             <Image style={styles.toolBarIconPng} source={require('image!irregular')}/>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             {/*<Icon name="safari" style={styles.toolBarIcon} size={toolBarIconSize} color={toolBarIconColor} />*/}
//             <Image style={styles.toolBarIconPng} source={require('image!compass')}/>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             {/*<Icon name="commenting-o" style={styles.toolBarIcon} size={toolBarIconSize} color={toolBarIconColor} />*/}
//             <Image style={styles.toolBarIconPng} source={require('image!social')}/>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             {/*<Icon name="upload" style={styles.toolBarIcon} size={toolBarIconSize} color={toolBarIconColor} />*/}
//             <Image style={styles.toolBarIconPng} source={require('image!upload')}/>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             {/*<Icon name="heart-o" style={styles.toolBarIcon} size={toolBarIconSize} color={toolBarIconColor} />*/}
//             <Image style={styles.toolBarIconPng} source={require('image!shape')}/>
//           </TouchableOpacity>
//         </View>
//
//     )
//   }
// });
