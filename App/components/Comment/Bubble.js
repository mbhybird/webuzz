import React, {Text, View, Animated, Image, StyleSheet, Dimensions,TouchableOpacity} from 'react-native';

var g_ConstInfo = require("../../constants/GlobalConstants.js");

var Lightbox = require('react-native-lightbox');

const windowWidth = Dimensions.get('window').width;
const marginWidth = 5;
var photoWidth = (windowWidth-marginWidth*2)*50/72;
var photoHeight = photoWidth*33/50;

var AudioHandler = require('react-native').NativeModules.AudioHandler;
var storageHandler = require('../../common/StorageHandler');

let styles = StyleSheet.create({
  bubble: {
    // borderRadius: 15,
    // paddingLeft: 14,
    // paddingRight: 14,
    // paddingBottom: 10,
    // paddingTop: 8,
    flexWrap:"wrap"
  },
  text: {
    color: '#6D6E71'
    // fontSize:12,
  },
  textLeft: {

  },
  textRight: {
   //color: '#fff',
  },
  bubbleLeft: {
    marginRight: 70,
    // backgroundColor: '#e6e6eb',
    alignSelf: "flex-start",
  },
  bubbleRight: {
    marginLeft: 70,
    // backgroundColor: '#007aff',
    alignSelf: "flex-end"
  },
  bubbleError: {
    backgroundColor: '#e01717'
  },

});

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      imgWidth:64,
      imgHeight:64,
      duration:0,
      audioStatus:false,
      textWidth:0,
    }
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  componentDidMount() {
    this.getAudioDuration(this.props.audioName);
    this.checkAudioRead()
  }
  renderText(text = "", position) {
    if (this.props.renderCustomText) {
      return this.props.renderCustomText(text, position);
    }
    return (
      <Text
          style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight),{width:windowWidth-50-marginWidth*2}]}
      >
        {text}
      </Text>
    );
  }

  checkAudioRead(){

    let _this = this;

    storageHandler.checkAudioReadStatus(this.props.audioName,function(data){
      _this.setState({
        audioStatus:(data?true:false)
      })
    })
  }

  renderImage(source){
    // style={{width:this.state.imgWidth,height:this.state.imgHeight}}
    if(!source || source==""){
      return;
    }
    else {
      // return(
      // {/*<Lightbox navigator={this.props.navigator}
      //  onOpen={()=>{this.setState({
      //  imgWidth:windowWidth,
      //  imgHeight:windowWidth*3/4
      //  })}}
      //  onClose={()=>{this.setState({
      //  imgWidth:64,
      //  imgHeight:64
      //  })}}
      //  >
      //  <Image resizeMode="contain"
      //  style={{width:this.state.imgWidth,height:this.state.imgHeight}}
      //  source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+source}}/>
      //  </Lightbox>*/}
      //
      //
      // );
      return (
          <Image
                     style={{width:photoWidth,height:photoHeight,marginBottom:5}}
                     source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+source}}/>
      );
    }
  }

  getAudioDuration(audioname){
    let _this = this;
    if(!audioname || audioname==""){
      return;
    }else{
      AudioHandler.getSoundFileDuration(audioname,function(data){
        _this.setState({
          duration:parseInt(data+0.5)
        })
      })
    }
  }

  playAudio(audioName){
    if(audioName && audioName != ""){
      AudioHandler.playAudioWithName(audioName);
      storageHandler.recordAudioReadStatus(audioName);
      this.setState({
        audioStatus:true
      })
    }
  }

  renderAudio(position){
    if(!this.props.audioName){return}
    let audioLength = (windowWidth)/20*this.state.duration;
    let minLength = 100;
    let maxLength = windowWidth - 60;
    if (audioLength<minLength) {audioLength = minLength}
    if(audioLength>maxLength){audioLength = maxLength}
    if(audioLength!=0){
      return (
          <View
              style={{flexDirection:"row"}}
          >
            <TouchableOpacity
                style={{
                  width:minLength>audioLength?minLength:audioLength,
                  backgroundColor:"#E6E7E8",
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingBottom: 10,
                  paddingTop: 8,
                  alignItems:"center",
                  justifyContent:"flex-start",
                  flexDirection:"row"
                }}
                onPress={()=>{
                    this.playAudio(this.props.audioName)
                }}
            >
              <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
                {this.state.duration+"''"}
              </Text>
            </TouchableOpacity>
            {!this.state.audioStatus?<View style={{backgroundColor:"red",height:8,width:8,borderRadius:4,marginLeft:5}}/>:null}
          </View>

      );
    }
    else{
      return null;
    }
  }
  render(){
    var flexStyle = {};
    if ( this.props.text.length > 40 ) {
     flexStyle.flex = 1;
    }

    return (
      <View style={[styles.bubble,
        (this.props.position === 'left' ? styles.bubbleLeft : styles.bubbleRight),
        (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
        flexStyle]}>
        {this.renderImage(this.props.photo)}
        {this.renderText(this.props.text, this.props.position)}
        {this.renderAudio(this.props.position)}
      </View>
    )
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left','right']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func
}
