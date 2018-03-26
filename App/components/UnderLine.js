'use strict';
var React = require('react-native');
var {
    View,
    Dimensions,
} = React;

var windowWidth = Dimensions.get('window').width;


var UnderLine = React.createClass({

    render:function(){
        var bColor = '#D1D3D4';
        if(this.props.color){
            bColor = this.props.color;
        }
      return(
        <View style={{height:1,marginLeft:10,marginRight:10,overflow:"hidden"}}>
          <View style={{height:1,borderColor:bColor,width:windowWidth-20,borderBottomWidth:1}}>
          </View>
        </View>
      );
    }
});

module.exports = UnderLine;
