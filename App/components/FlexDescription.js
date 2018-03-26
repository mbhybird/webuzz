'use strict';
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image
} = React;
var Dimensions = require('Dimensions');
// const MainTextHeight = Dimensions.get('window').height/8+(Dimensions.get('window').height-568)/2-4
var MainTextHeight=90;
// var MainTextHeight = 175;
// var MainTextHeight = 90;
var windowWidth = Dimensions.get('window').width;

const styles=StyleSheet.create({
  container:{
    marginTop:5,
    marginLeft:10,
    marginRight:10,
    marginBottom:5,
    width:windowWidth-20,
    flex:1
  },

  descriptionView:{

  },

  shortMode:{
    overflow:"hidden",
    // height:MainTextHeight
    flex:1
  },
  description:{
    width:windowWidth-24,
    marginLeft:10,
    fontSize:16
  },
  moreView:{
    flexDirection:"row",
    justifyContent:"flex-end",
    // marginTop:10
  },
  more:{
    color:"blue"
  }
});

var FlexDescription = React.createClass({
  propTypes:{
    description:React.PropTypes.string,
    onMoreButtonClick:React.PropTypes.func,
    descriptionHeight:React.PropTypes.number,
    autoFlexText:React.PropTypes.bool
  },
  getDefaultProps:function(){
    return{
      autoFlexText:false
    }
  },
  getInitialState:function(){
    return{
      ShowMore:false,
      TextHeight:90,
      canShowMore:true,
    }
  },
  _setDescriptionHeight:function(){
    if(this.props.descriptionHeight && this.props.descriptionHeight!=0){
      MainTextHeight = this.props.descriptionHeight;
      this.setState({
        TextHeight:this.props.descriptionHeight
      })
    }

  },
  componentWillMount:function(){
    // alert(Dimensions.get('window').height);
    this._setDescriptionHeight();
  },
  _flexViewStyle:function(){
    if(this.state.ShowMore && this.state.canShowMore){
      return {};
    }
    else {
      return {
        overflow:"hidden",
        height:this.state.TextHeight,
      };
    }
  },
  _resetFlexViewText:function(){
    // alert(this.refs.aaa);
    if(this.state.ShowMore){
      return "Shortening";
    }
    else {
      return "More..";
    }
  },
  render:function(){
    return(
    <View style={styles.container}>
      <View style={[this._flexViewStyle()]}>
        {/*<View
          onLayout={(event) => {
          // var {x, y, width, height} = event.nativeEvent.layout;
          if(event.nativeEvent.layout.height<MainTextHeight)
          {
          this.setState({
          ShowMore:false
          });
          if(this.props.onMoreButtonClick)
          {
          this.props.onMoreButtonClick(this.state.ShowMore);
          }
          }
          }}
        style={{flex:1}}>*/}
        <Text  onLayout={(event) => {
          // var {x, y, width, height} = event.nativeEvent.layout;
          console.log(event.nativeEvent.layout.height);

          if(this.props.autoFlexText==true){
            MainTextHeight=event.nativeEvent.layout.height,
            this.setState({
              canShowMore:false,
              TextHeight:event.nativeEvent.layout.height
            });
            return;
          }

          if(event.nativeEvent.layout.height<=this.state.TextHeight)
          {
            console.log(this.state.canShowMore);
            this.setState({
              canShowMore:false
            })
          }
          else {
            console.log(this.state.canShowMore);
            this.setState({
              canShowMore:true
            })
          }

        }}
          style={styles.description}>{this.props.description}</Text>
        {/*</View>*/}
      </View>
      <View style={styles.moreView}>
        {
        this.state.canShowMore?

        <TouchableOpacity
          style={{height:20}}
          onPress={()=>{
            if(this.state.canShowMore)
            {
              this.setState({
                ShowMore:!this.state.ShowMore
              });
            }
            if(this.props.onMoreButtonClick)
            {
              this.props.onMoreButtonClick(this.state.ShowMore);
            }
          }}
        >

          <Text style={styles.more}>{this._resetFlexViewText()}</Text>

        </TouchableOpacity>
          : null
        }
      </View>
    </View>
    );
  }

});

module.exports = FlexDescription;
