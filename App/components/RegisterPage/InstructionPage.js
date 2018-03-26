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
  Image
} = React;

const styles = StyleSheet.create({
  page_container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#96CDCD',
  },
  page_header:{
    flex:1,
    justifyContent:"flex-end",
    alignItems:"center",
    flexDirection:"column",
    // marginLeft:20
  },
  page_header_text:{
    fontSize:36,
    marginBottom:10,
    color:"white",
    alignItems:"flex-end",
    // fontWeight: 'bold',
    // underLine:true
  },
  page_header_subText:{
    color:"white"
  },
  page_content:{
    flex:3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:"row"
  },
  page_footer:{
    flex:2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:"row"
  }
});

var InstructionPage = React.createClass({
  getInitialState:function()
  {
    return{

    }
  },
  render:function(){
    return(
      <View style={[styles.page_container,
        {backgroundColor:this.props.backgroundColor ? this.props.backgroundColor:'#CDAA7D'}]}>
        <View style={styles.page_header}>
          <Text style={styles.page_header_text}>Make Things Buzz</Text>
          <Text style={styles.page_header_subText}>Register your thing</Text>
          {/*<Image style={{height:64,width:64,borderRadius:10}} source={require('image!Webuzz')}/>*/}

        </View>
        <View style={styles.page_content}>
          {
            this.props.children
          }
        </View>
        <View style={styles.page_footer}>
        </View>
      </View>
        // <View/>
  );
  }
});

module.exports = InstructionPage;
