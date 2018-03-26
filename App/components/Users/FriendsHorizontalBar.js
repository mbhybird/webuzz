'use strict'
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} = React;
var Dimensions = require('Dimensions');
let m_ImageArray =[require('image!pic2'),require('image!pic3'),require('image!pic5'),require('image!pic6')];
const styles = StyleSheet.create({
  headerImage:{
    width:50,
    height:50,
    // borderRadius:20,
    margin:5
  },
})

var FriendsHorizontalBar = React.createClass({
  getInitialState:function(){
    return{
      Refresh:false
    }
  },
  componentDidMount:function(){
    // let _width = Dimensions;
    // alert(_width);
  },
  // _FetchMoreFriends
  render:function(){
    return(
      <ScrollView
        horizontal = {true}
        showsVerticalScrollIndicator = {false}
        showsHorizontalScrollIndicator = {false}
        contentContainerStyle={
          {
            flexDirection:"row",
            alignItems:"center",
            justifyContent:"space-around"
          }
        }
        style={{height:60,marginLeft:5,marginRight:5}}
        onMomentumScrollEnd={(e)=>{
          //由于ScrollEnd 和 ScrollBegin的时候都会促发此事件，因此需监测contentOffset
          //若大于0才说明到达End
          let x = e.nativeEvent.contentOffset.x;
          // alert(x);
          if(m_ImageArray.length==6 || x>0)
          {
            m_ImageArray.push(require('image!pic2'));
            this.setState({
              Refresh:!this.state.Refresh
            })
          }
        }}
      >
        {
          m_ImageArray.map(function(item,index){
            return(<Image key={index} style={styles.headerImage} source={item}/>);
          })
        }
      </ScrollView>
    )
  }
});

module.exports = FriendsHorizontalBar;
