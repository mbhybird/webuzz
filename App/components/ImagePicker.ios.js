/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  NativeModules,
  PixelRatio,
} from 'react-native';

var ImagePickerManager = NativeModules.ImagePickerManager;

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarSource: null,
      videoSource: null
    };
  }

  componentDidMount(){
    fetch('http://192.168.0.202:2397/api/users/56dfd4962d173d700b000003', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
        this.setState ({
          avatarSource : {uri: 'data:image/jpeg;base64,' + res.photo, isStatic: true}
        });
      }
    );
  }

  selectPhotoTapped() {
    const options = {
      title: 'Photo Picker',
      quality: 0.5,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true
      }
    };

     ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};

        fetch('http://192.168.0.202:2397/api/users', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "firstname":"test",
            "lastname":"test",
            "nickname":"test",
            "password":"test",
            "gender":"F",
            "email":"test@qq.com",
            "photo":response.data,
            "facebook":{
                "id":"11111"
            },
            "wechat":{
                "id":"22222"
            }
          })
        })
        .then(res => res.json())
        .then(res => alert(res.message));

        this.setState({
          avatarSource: source
        });
      }
    });
  }


  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

     ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.selectVideoTapped}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity>
        { this.state.videoSource &&
          <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource.bind(this)}</Text>
        }
      </View>
      );
  }
}

class ImagePicker extends Component {
  render() {
    return (
      <Example/>
    );
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', margin: 15, },
  cell: {
      flex: 1,
      height: 50,
      backgroundColor: 'transparent'
  },
  celltext: {
      flex: 1,
      height: 50,
      fontSize: 25,
      marginLeft: 5,
      backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 150,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});

module.exports = ImagePicker;
