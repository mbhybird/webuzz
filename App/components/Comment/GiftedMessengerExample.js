'use strict';

var React = require('react-native');
var {
  LinkingIOS,
  Platform,
  ActionSheetIOS,
  Dimensions,
  View,
  Text,
  ProgressViewIOS
} = React;

var GiftedMessenger = require('./GiftedMessenger');
var Communications = require('react-native-communications');
var GlobalConstants = require('../../constants/GlobalConstants.js');
var EventEmitterMixin = require('react-event-emitter-mixin');

var Lightbox = require('react-native-lightbox');

/*add by Brian for handle audio play*/
var AudioHandler = require('react-native').NativeModules.AudioHandler;
var storageHandler = require('../../common/StorageHandler');

var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var windowHeight = Dimensions.get('window').height;

var g_ConstInfo = require("../../constants/GlobalConstants.js");

var GiftedMessengerExample = React.createClass({

  mixins:[EventEmitterMixin],

  getInitialState: function() {
    return {
      title : null,
      comments : [],
      recordStart:false,
      isLogin:false
    };
  },
  getMessages() {
    return [
      {
        text: 'Are you building a chat app?',
        name: 'React-Native',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2015, 10, 16, 19, 0)
      },
      {
        text: "Yes, and I use Gifted Messenger!",
        name: 'Developer',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'right',
        date: new Date(2015, 10, 17, 19, 0)
        // If needed, you can add others data (eg: userId, messageId)
      },
    ];
  },

  handleSend(message = {}, rowID = null) {
    // Your logic here
    // Send message.text to your server

    // this._GiftedMessenger.setMessageStatus('Sent', rowID);
    // this._GiftedMessenger.setMessageStatus('Seen', rowID);
    // this._GiftedMessenger.setMessageStatus('Custom label status', rowID);
    let type = "T";
    if(message.photo){
      type = "P";
    }
    if(message.audio){
      type = "A";
    }
    fetch(GlobalConstants.WEBUZZ_HOST+'/api/things/addcomment/'+message.thingsId+'/'+message.title, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        "text":message.text,
        "html": null,
        "photo": message.photo?message.photo:null,
        "audio": message.audio?message.audio:null,
        "video": null,
        "doodle": null,
        "type": type,
        "createBy": message.userId
      })
    })
    .then(res => res.json())
    .then(res => {
      if(res.message=='Comments update!'){
        if(message.audio && message.audio != ''){
          AudioHandler.renameAudioFile(message.audioName, res.data + ".wav");
          message.audioName = res.data+ ".wav";
        }
        this._GiftedMessenger.refreshRows();
        this.eventEmitter('emit','appendComment',message,message.title);
        let comments =  this.state.comments;
        comments.push(message);
        this.setState({
          comments:comments
        });

        // if (res.status == 'success') {
        //
        // }
        // else {
        //   //TODO:Add this audioRecord to fail list. Help user to repost it.
        //   storageHandler.addAudioNeedRepost(audiorecord);
        // }
      }

      else{
          this._GiftedMessenger.setMessageStatus('ErrorButton', rowID); // => In this case, you need also to set onErrorButtonPress
        if(message.audio && message.audio != ''){
          let audiorecord = {};
          audiorecord.audio = message.audio;
          audiorecord.audioName = message.audioName;
          storageHandler.addAudioNeedRepost(audiorecord)
        }
      }
    });
  },

  // @oldestMessage is the oldest message already added to the list
  onLoadEarlierMessages(oldestMessage = {}, callback = () => {}) {

    // Your logic here
    // Eg: Retrieve old messages from your server

    // newest messages have to be at the begining of the array
    var earlierMessages = [
      {
        text: 'This is a touchable phone number 0606060606 parsed by taskrabbit/react-native-parsed-text',
        name: 'Developer',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'right',
        date: new Date(2014, 0, 1, 20, 0),
      }, {
        text: 'React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React. https://github.com/facebook/react-native',
        name: 'React-Native',
        image: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
        position: 'left',
        date: new Date(2013, 0, 1, 12, 0),
      },
    ];

    setTimeout(() => {
      callback(earlierMessages, false); // when second parameter is true, the "Load earlier messages" button will be hidden
    }, 1000);
  },

  handleReceive(message = {}) {
    this._GiftedMessenger.appendMessage(message);
  },

  onErrorButtonPress(message = {}, rowID = null) {
    // Your logic here
    // Eg: Re-send the message to your server

    setTimeout(() => {
      // will set the message to a custom status 'Sent' (you can replace 'Sent' by what you want - it will be displayed under the row)
      this._GiftedMessenger.setMessageStatus('Sent', rowID);
      setTimeout(() => {
        // will set the message to a custom status 'Seen' (you can replace 'Seen' by what you want - it will be displayed under the row)
        this._GiftedMessenger.setMessageStatus('Seen', rowID);
        setTimeout(() => {
          // append an answer
          this.handleReceive({text: 'I saw your message', name: 'React-Native', image: {uri: 'https://facebook.github.io/react/img/logo_og.png'}, position: 'left', date: new Date()});
        }, 500);
      }, 1000);
    }, 500);
  },

  // will be triggered when the Image of a row is touched
  onImagePress(rowData = {}, rowID = null) {
    // Your logic here
    // Eg: Navigate to the user profile
    alert('Navigate to the user profile...');
  },
  componentDidMount(){
    this.eventEmitter('on','refreshComments',(comments,type,link,title)=>{
      this.setState({
        title : title,
        comments:comments,
      })
    });
    if(this.props.thingsProfileDTO.user){
      this.setState({
        isLogin:true
      })
    }
  },
  onMessagePress(rowData,rowID){
    // console.log(rowData.audio)
    // this.playAudio(rowData);
  },
  // showPhoto(rowData){
  //   if(rowData.photo){
  //     this.eventEmitter("emit","ShowLargePhoto",rowData.photo);
  //   }
  // },
  _postVoiceCommentToServer: function (thingId, title, userid, audiorecord) {

    /**
     *  audiorecord struck is audioRecord = {audioName: "", audio: ""}
     */
    if (!audiorecord || audiorecord.audio=='' || audiorecord.audioName=='') {
      return;
    }

    let url = g_ConstInfo.WEBUZZ_API_THINGS_ADDCOMMENT(thingId, title);

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": "",
        "html": null,
        "photo": null,
        "audio": audiorecord.audio,
        "video": null,
        "doodle": null,
        "type": "A",
        "createBy": userid
      })
    })
        .catch(err=>{
          console.log(err)
        })
        .then(res => res.json())
        .then(res => {
          if (res.status == 'success') {
            AudioHandler.renameAudioFile(audiorecord.audioName + ".wav", res.data + ".wav");
          }
          else {
            //TODO:Add this audioRecord to fail list. Help user to repost it.
            storageHandler.addAudioNeedRepost(audiorecord);
          }
        });
  },
  _setProgressBar:function(isShow){
    this.setState({
      recordStart:isShow
    })
  },
  render() {
    return (
      <View style={{flex:1}}>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}

          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#e6e6eb',//'#007aff',
            },
          }}
          imageWindowHeight = {this.props.imageWindowHeight}
          navigator={this.props.navigator}
          autoFocus={false}
          messages={ this.state.comments/*this.getMessages()*/}
          handleSend={this.handleSend}
          onErrorButtonPress={this.onErrorButtonPress}
          maxHeight={Dimensions.get('window').height - navBarHeight - statusBarHeight - 200}
          loadEarlierMessagesButton={true}
          onLoadEarlierMessages={this.onLoadEarlierMessages}
          setProgressBar = {this._setProgressBar}
          senderName={this.props.thingsProfileDTO.user.nickname}//'Developer'
          senderImage={this.props.thingsProfileDTO.userPhoto}//{null}
          onImagePress={this.onImagePress}
          displayNames={true}
          thingsProfileDTO={this.props.thingsProfileDTO}
          showPhotoPost = {this.props.showPhotoPost}

          parseText={true} // enable handlePhonePress and handleUrlPress
          handlePhonePress={this.handlePhonePress}
          handleUrlPress={this.handleUrlPress}
          handleEmailPress={this.handleEmailPress}

          inverted={true}

          keyboardStatusChange={this.props.keyboardStatusChange}
          photoSizeChangeRange = {this.props.photoSizeChangeRange}

          onMessagePress={this.onMessagePress}
          audioLongPress={this.startRecord}
          audioLongPressEnd={this.endRecord}
          isLogin = {this.state.isLogin}
          setLogin = {(state)=>{
            this.setState({
              isLogin:state
            });
            console.log(this.props.thingsProfileDTO.user.nickname);
          }}
        />
        {this.state.recordStart ? <AudioProgress/> : null }
      </View>
    );
  },

  handleUrlPress(url) {
    if (Platform.OS !== 'android') {
      LinkingIOS.openURL(url);
    }
  },

  handlePhonePress(phone) {
    if (Platform.OS !== 'android') {
      var BUTTONS = [
        'Text message',
        'Call',
        'Cancel',
      ];
      var CANCEL_INDEX = 2;

      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
        }
      });
    }
  },

  handleEmailPress(email) {
    Communications.email(email, null, null, null, null);
  },
});

var timerId;
var AudioProgress = React.createClass({

  getInitialState:function(){
    return{
      progress:0.5,
    }
  },

  componentDidMount:function(){

    // timerId = setInterval(this._getPower,100);
    // console.log("start getPower");
    timerId = setInterval(this._getPower,100);

  },

  componentWillUnmount:function(){

    // clearInterval(timerId);
    // console.log("end getPower");
    clearInterval(timerId);

  },

  _getPower:function(){
    let _this = this;
    AudioHandler.powerProgress(function(data){
      _this.setState({
        progress:data
      });
    })
  },

  render:function(){
    return(
        <View style={{opacity:0.5,backgroundColor:"black",position:"absolute",top:windowHeight/8,left:windowWidth/8,width:windowWidth*3/4,height:40,justifyContent:"center",alignItems:"center"}}>
          <ProgressViewIOS
              style={{width:windowWidth*3/4}}
              progress={this.state.progress}
          />
        </View>
    )
  },
});

var navBarHeight = (Platform.OS === 'android' ? 56 : 64);
// warning: height of android statusbar depends of the resolution of the device
// http://stackoverflow.com/questions/3407256/height-of-status-bar-in-android
// @todo check Navigator.NavigationBar.Styles.General.NavBarHeight
var statusBarHeight = (Platform.OS === 'android' ? 25 : 0);


module.exports = GiftedMessengerExample;
