
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
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  NativeModules
} = React;

//需要push base64的photo资料
var m_photoList = [];
//用于显示图片缩略图，需要push image source json格式{uri:...}
var m_photoData = [];
var ImagePickerManager = NativeModules.ImagePickerManager;
var PhotoPicker = React.createClass({
  propTypes:{
    photoList:React.PropTypes.array,
  },
  getInitialState:function()
  {
    return{
      isRefresh:false,
      photoList:m_photoList
    }
  },
  componentWillUnmount:function(){
    m_photoList=[];
    m_photoData = [];

  },
  componentDidMount:function(){
    this._getPhotos();
  },
  _getPhotos:function(){
    var _photoList = this.props.photoList;
    if(_photoList && _photoList.length>0){
      m_photoList=[];
      m_photoData = [];
      m_photoData =_photoList;
      m_photoData.map(function(photo,index){
        let _source = {uri:'data:image/jpeg;base64,'+photo};
        m_photoList.push(_source);
      });
      this.setState({
        photoList:m_photoList
      });
    }
  },
  _AddPhoto:function(){
    if(m_photoList.length==1){
      alert("only 1 photos allowed");
      return;
    }
    else {
      this._selectPhoto();
    }
    // m_photoList.push("http:\/\/wx.qlogo.cn\/mmopen\/1bpicrfuAibxE9lL4XPUmvagiaXjVFyEp9iaueeQ0lLF47gOrR8UJPd3CjQqy6Oh8fmyJt3kZj51F8OjKZGepmnQOAdlxVPib3AJw\/0");
    // this.props.updatePhotos(m_photoList);
    // this.setState({
    //   photoList:m_photoList
    // });
  },
  _removePhoto:function(index)
  {
    m_photoList.splice(index,1);
    m_photoData.splice(index,1);
    this.setState({
      photoList:m_photoList
    });
    // alert(index)
  },
  _selectPhoto:function(){
    const options = {
      title: 'Photo Picker',
      quality: 0.5,
      maxWidth: 300,
      maxHeight: 300,
      allowsEditing:true,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else{
        var source = {uri: response.uri.replace('file://', ''), isStatic: true};
        m_photoData.push(response.data);
        m_photoList.push(source);
        this.props.updatePhotos(m_photoData);
        this.setState({
          photoList:m_photoList
        });
      }
    });
  },
  render:function(){
    return (
        <View style={{flexDirection:"column",flex:1,height:190}}>
          <View style={{borderColor:'lightgray',borderBottomWidth: 1,flexDirection:"row",justifyContent:"flex-start"}}>
            <Text style={{color:"grey",fontSize:16}}>Select Your Images</Text>
          </View>
          <View style={{margin:35,flexDirection:"row",flexWrap:"wrap"}}>
            {

              this.state.photoList.map(function(photo,index){
                return(
                  <TouchableOpacity
                  key={index}
                  onPress={()=>{this._removePhoto(index)}}
                  style={{margin:5}}>
                  <Image style={{width:64,height:64}} source={photo}/>
                </TouchableOpacity>
                )
              },this)
            }
            <TouchableOpacity
              onPress={this._AddPhoto}
              style={{borderWidth:1,borderColor:'lightgray',height:70,width:70,alignItems:'center'}}>
              <Image source={require('image!plus-symbol')}/>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
});
module.exports = PhotoPicker;
