'use strict';

var React = require('react-native');
import Message from './Message';
var GiftedSpinner = require('react-native-gifted-spinner');
var {
  Text,
  View,
  ListView,
  TextInput,
  Dimensions,
  Animated,
  Image,
  TouchableHighlight,
  Platform,
  PixelRatio,
  WebView,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} = React;

var moment = require('moment');
var Icon = require('react-native-vector-icons/FontAwesome');
var Button = require('react-native-button/Button');
var EventEmitterMixin = require('react-event-emitter-mixin');
//BrianLi:When I jump into ScrollView's js code(react-native/libraries/components/ScrollView/ScrollView.js)
//I found this dark magic. LOL.. now i can hide the keyboard in everywhere.
var dismissKeyboard = require('dismissKeyboard');
var UnderLine = require('../UnderLine');
var UserInfoHelper = require('../../common/UserInfoHelper');

var ImagePickerManager = NativeModules.ImagePickerManager;

//And I also found these to listen keyboard show & hide event...cheers!
// this.addListenerOn(RCTDeviceEventEmitter, 'keyboardWillShow', this.scrollResponderKeyboardWillShow);
// this.addListenerOn(RCTDeviceEventEmitter, 'keyboardWillHide', this.scrollResponderKeyboardWillHide);
// this.addListenerOn(RCTDeviceEventEmitter, 'keyboardDidShow', this.scrollResponderKeyboardDidShow);
// this.addListenerOn(RCTDeviceEventEmitter, 'keyboardDidHide', this.scrollResponderKeyboardDidHide);

var tabBarHeight = 0;

var audioRecord = {
  audioName: "",
  audio: ""
};

var g_ConstInfo = require("../../constants/GlobalConstants.js");
var AudioHandler = require('react-native').NativeModules.AudioHandler;

var LoginGuidePage = React.createClass({
  _showLoginPage: function() {
    let _this = this;
    UserInfoHelper.getUserIdWithCheck(function(data){
      if(data && data != ""){
        UserInfoHelper.getCommentDTOUserInfo(_this.props.thingsProfileDTO,function(dto){
          if(dto.user){
            _this.props.setLogin(true);
          }
        })
      }
    });
  },
  render:function(){
    let windowHeight = Dimensions.get('window').height;
    return(
      <View style={{flexDirection:'row',height:50,justifyContent:'center',alignItems:'center'}}>
        {/*<Text style={{marginRight:10,color:"orange"}}>
          Join us and post your words...
        </Text>*/}
        <TouchableOpacity
          style={{
            borderWidth:1,
            borderColor:"orange",
            // width:80,
            height:30,
            borderRadius:2,
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',

          }}
            onPress={this._showLoginPage}
        >
          <Text style={{fontSize:12,color:'orange',margin:10}}>Link Your Social Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var GiftedMessenger = React.createClass({
  mixins:[EventEmitterMixin],

  firstDisplay: true,
  listHeight: 0,
  footerY: 0,

  getDefaultProps() {
    return {
      displayNames: true,
      placeholder: 'Type a message...',
      styles: {},
      autoFocus: true,
      onErrorButtonPress: (message, rowID) => {},
      loadEarlierMessagesButton: false,
      loadEarlierMessagesButtonText: 'Load earlier messages',
      onLoadEarlierMessages: (oldestMessage, callback) => {},
      parseText: false,
      handleUrlPress: (url) => {},
      handlePhonePress: (phone) => {},
      handleEmailPress: (email) => {},
      initialMessages: [],
      messages: [],
      handleSend: (message, rowID) => {},
      maxHeight: Dimensions.get('window').height,
      senderName: 'Sender',
      senderImage: null,
      sendButtonText: 'Send',
      onImagePress: null,
      onMessageLongPress: (msg) => { alert('onMessageLongPress') },
      hideTextInput: false,
      submitOnReturn: true,
      forceRenderImage: false,
      onChangeText: (text) => {},
      thingsProfileDTO:{},
      /* add by Brian */
      onMessagePress:(msg) => { alert('onPress') },
    };
  },

  propTypes: {
    displayNames: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    styles: React.PropTypes.object,
    autoFocus: React.PropTypes.bool,
    onErrorButtonPress: React.PropTypes.func,
    loadMessagesLater: React.PropTypes.bool,
    loadEarlierMessagesButton: React.PropTypes.bool,
    loadEarlierMessagesButtonText: React.PropTypes.string,
    onLoadEarlierMessages: React.PropTypes.func,
    parseText: React.PropTypes.bool,
    handleUrlPress: React.PropTypes.func,
    handlePhonePress: React.PropTypes.func,
    handleEmailPress: React.PropTypes.func,
    initialMessages: React.PropTypes.array,
    messages: React.PropTypes.array,
    handleSend: React.PropTypes.func,
    onCustomSend: React.PropTypes.func,
    renderCustomText: React.PropTypes.func,
    maxHeight: React.PropTypes.number,
    senderName: React.PropTypes.string,
    senderImage: React.PropTypes.object,
    sendButtonText: React.PropTypes.string,
    onImagePress: React.PropTypes.func,
    onMessageLongPress: React.PropTypes.func,
    hideTextInput: React.PropTypes.bool,
    forceRenderImage: React.PropTypes.bool,
    onChangeText: React.PropTypes.func,
    thingsProfileDTO: React.PropTypes.object,
    audioLongPress: React.PropTypes.func,
    audioLongPressEnd: React.PropTypes.func,
    showPhotoPost:React.PropTypes.func
  },

  getInitialState: function() {
    this._data = [];
    this._rowIds = [];

    var textInputHeight = 0;
    if (this.props.hideTextInput === false) {
      textInputHeight = 44;
    }
    var marginWidth=5;
    var functionButtonHeight = 50;
    this.listViewMaxHeight = this.props.maxHeight - textInputHeight - functionButtonHeight-tabBarHeight;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      if (typeof r1.status !== 'undefined') {
        return true;
      }
      return r1 !== r2;
    }});
    return {
      dataSource: ds.cloneWithRows([]),
      text: '',
      link: 'http://arts.things.buzz/empty.html',
      disabled: true,
      height: new Animated.Value(this.listViewMaxHeight),
      lvHeight: new Animated.Value(this.listViewMaxHeight),
      showInputTextAndFuncButton:true,
      isLoadingEarlierMessages: false,
      allLoaded: false,
      appearAnim: new Animated.Value(0),
      title: null,
      showRecorder:false,
      showFunctionButton:true,
      audio:'',
      audioName:'',
      photo:'',
    };
  },

  getMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID)]];
      }
    }
    return null;
  },

  getPreviousMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID - 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]];
      }
    }
    return null;
  },

  getNextMessage(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID + 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]];
      }
    }
    return null;
  },

  renderDate(rowData = {}, rowID = null) {
    var diffMessage = null;
    if (rowData.isOld === true) {
      diffMessage = this.getPreviousMessage(rowID);
    } else {
      diffMessage = this.getNextMessage(rowID);
    }
    if (rowData.date instanceof Date) {
      if (diffMessage === null) {
        return (
          <Text style={[this.styles.date]}>
            {moment(rowData.date).calendar()}
          </Text>
        );
      } else if (diffMessage.date instanceof Date) {
        let diff = moment(rowData.date).diff(moment(diffMessage.date), 'minutes');
        if (diff > 5) {
          return (
            <Text style={[this.styles.date]}>
              {moment(rowData.date).calendar()}
            </Text>
          );
        }
      }
    }
    return null;
  },
  
  
  
  renderRow(rowData = {}, sectionID = null, rowID = null) {

    var diffMessage = null;
    /*
    if (rowData.isOld === true) {
      diffMessage = this.getPreviousMessage(rowID);
    } else {
      diffMessage = this.getNextMessage(rowID);
    }*/

    return (
      <View>
        {/*this.renderDate(rowData, rowID)*/}
        <Message
          navigator={this.props.navigator}
          rowData={rowData}
          rowID={rowID}
          onErrorButtonPress={this.props.onErrorButtonPress}
          displayNames={this.props.displayNames}
          diffMessage={diffMessage}
          position={rowData.position}
          forceRenderImage={this.props.forceRenderImage}
          onImagePress={this.props.onImagePress}
          onMessageLongPress={this.props.onMessageLongPress}
          renderCustomText={this.props.renderCustomText}
          onMessagePress={this.props.onMessagePress}
          styles={this.styles}
        />
        <UnderLine/>
      </View>
    )
  },

  onChangeText(text) {
    this.setState({
      text: text
    })
    if (text.trim().length > 0) {
      this.setState({
        disabled: false
      })
    } else {
      this.setState({
        disabled: true
      })
    }

    this.props.onChangeText(text);
  },

  componentDidMount() {
    
    this._photoSendHandler();
    this._showHideFunctionButton(false);
    this.eventEmitter('on','refreshComments',(comments,type,link,title)=>{
      if(type=="Html"){
        if(link.substr(0,7).toLowerCase()!="http://" && link.substr(0,8).toLowerCase()!="https://"){
          link = "http://" + link;
        }
        var realURL = link + (link.indexOf('?')!=-1 ? "&id=" + this.props.thingsProfileDTO.thing._id : "?id=" + this.props.thingsProfileDTO.thing._id);
        this.setState({
          showInputTextAndFuncButton:false,
          height:0,
          link:realURL
        })
      }
      else{
        this.setState({
          showInputTextAndFuncButton:true,
          height:this.state.lvHeight,
          link:'http://arts.things.buzz/empty.html',
          title:title,
        })
      }
    });

    this.scrollResponder = this.refs.listView.getScrollResponder();

    if (this.props.messages.length > 0) {
      this.appendMessages(this.props.messages);
    } else if (this.props.initialMessages.length > 0) {
      this.appendMessages(this.props.initialMessages);
    } else {
      // Set allLoaded, unless props.loadMessagesLater is set
      if (!this.props.loadMessagesLater) {
        this.setState({
          allLoaded: true
        });
      }
    }

  },

  _photoSendHandler:function(){
    this.eventEmitter("on","imagePostConfirm",function(source,desc){
      this.setState({
        photo:source,
        text:desc,
        audio:null,
        audioName:null
      });
      this.onSend();
    });
  },

  componentWillReceiveProps(nextProps) {
    this._data = [];
    this._rowIds = [];
    this.appendMessages(nextProps.messages);
  },

  onKeyboardWillHide(e) {

    try{
      Animated.timing(this.state.height, {
        toValue: this.listViewMaxHeight,
        duration: 150,
      }).start();
    }catch(e){}
    this.props.keyboardStatusChange(true);
  },

  onKeyboardWillShow(e) {

    try{
      Animated.timing(this.state.height, {
        toValue: this.listViewMaxHeight + tabBarHeight + this.props.photoSizeChangeRange - (e.endCoordinates ? e.endCoordinates.height : e.end.height),
        duration: 200,
      }).start();
    }catch(e){}
  },

  onKeyboardDidShow(e) {
    if(React.Platform.OS == 'android') {
      this.onKeyboardWillShow(e);
    }
    this.scrollToBottom();
    this.props.keyboardStatusChange(false);
  },
  onKeyboardDidHide(e) {
    if(React.Platform.OS == 'android') {
      this.onKeyboardWillHide(e);
    }
  },

  scrollToBottom() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this.scrollResponder.scrollTo({
        y: -scrollDistance,
      });
    }
  },

  scrollWithoutAnimationToBottom() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this.scrollResponder.scrollTo({
        x: 0,
        y: -scrollDistance,
        animated: false,
      });
    }
  },

  onSend() {
    var message = {
      text: this.state.text.trim(),
      name: this.props.senderName,
      image: this.props.senderImage,
      audio: this.state.audio,
      audioName:this.state.audioName,
      position: 'right',
      photo:this.state.photo,
      date: new Date(),
      userId: this.props.thingsProfileDTO.user._id,
      thingsId: this.props.thingsProfileDTO.thing._id,
      title: this.state.title,
      createBy:{
        photo:this.props.thingsProfileDTO.userPhoto,
        nickname:this.props.thingsProfileDTO.user.nickname},
    };

    if(message.title==null) { alert('please choose topic first!'); return;}
    if (this.props.onCustomSend) {
      this.props.onCustomSend(message);
    } else {
      var rowID = this.appendMessage(message, true);
      this.props.handleSend(message, rowID);
      this.onChangeText('');
    }
  },

  postLoadEarlierMessages(messages = [], allLoaded = false) {
    this.prependMessages(messages);
    this.setState({
      isLoadingEarlierMessages: false
    });
    if (allLoaded === true) {
      this.setState({
        allLoaded: true,
      });
    }
  },

  preLoadEarlierMessages() {
    this.setState({
      isLoadingEarlierMessages: true
    });
    this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this.postLoadEarlierMessages);
  },

  renderLoadEarlierMessages() {
    if (this.props.loadEarlierMessagesButton === true) {
      if (this.state.allLoaded === false) {
        if (this.state.isLoadingEarlierMessages === true) {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <GiftedSpinner />
            </View>
          );
        } else {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Button
                style={this.styles.loadEarlierMessagesButton}
                onPress={() => {this.preLoadEarlierMessages()}}
              >
                {this.props.loadEarlierMessagesButtonText}
              </Button>
            </View>
          );
        }
      }
    }
    return null;
  },

  prependMessages(messages = []) {
    var rowID = null;
    for (let i = 0; i < messages.length; i++) {
      this._data.push(messages[i]);
      this._rowIds.unshift(this._data.length - 1);
      rowID = this._data.length - 1;
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
    return rowID;
  },

  prependMessage(message = {}) {
    var rowID = this.prependMessages([message]);
    return rowID;
  },

  appendMessages(messages = []) {
    var rowID = null;
    for (let i = 0; i < messages.length; i++) {
      messages[i].isOld = true;
      this._data.push(messages[i]);
      this._rowIds.push(this._data.length - 1);
      rowID = this._data.length - 1;
      messages[i].position = 'left';//(rowID%2==0)?'left':'right';
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });

    return rowID;
  },

  appendMessage(message = {}, scrollToBottom = true) {
    var rowID = this.appendMessages([message]);

    if (scrollToBottom === true) {
      setTimeout(() => {
        // inspired by http://stackoverflow.com/a/34838513/1385109
        this.scrollToBottom();
      }, (Platform.OS === 'android' ? 200 : 100));
    }

    return rowID;
  },

  refreshRows() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
  },

  setMessageStatus(status = '', rowID) {
    if (status === 'ErrorButton') {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = 'ErrorButton';
        this.refreshRows();
      }
    } else {
      if (this._data[rowID].position === 'right') {
        this._data[rowID].status = status;

        // only 1 message can have a status
        for (let i = 0; i < this._data.length; i++) {
          if (i !== rowID && this._data[i].status !== 'ErrorButton') {
            this._data[i].status = '';
          }
        }
        this.refreshRows();
      }
    }
  },

  renderWebView(){
    var _scrollView: ScrollView;
    return(
      <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          style={{
            height:Dimensions.get('window').height,
          }}>
        <WebView
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            height: 2000,
          }}
          renderError={()=>{
              return (<View style={{margin:20}}><Text>Page not found,please check the url</Text></View>);
            }
          }
          onLoadStart={() => { _scrollView.scrollTo({y: 0}); }}
          source={{uri:this.state.link}}
          startInLoadingState={true}
        />
      </ScrollView>
    );
  },

  renderAnimatedView() {
    console.log(this.state.dataSource);
    return (
      <Animated.View
        style={{
          height: this.state.height,
        }}

      >
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderLoadEarlierMessages}
          onTouchEnd={()=>{dismissKeyboard();this._showHideFunctionButton(false);}}
          onLayout={(event) => {
            var layout = event.nativeEvent.layout;
            this.listHeight = layout.height;
            if (this.firstDisplay === true) {
              requestAnimationFrame(() => {
                this.firstDisplay = false;
                this.scrollWithoutAnimationToBottom();
              });
            }

          }}
          renderFooter={() => {
            return <View onLayout={(event)=>{
              var layout = event.nativeEvent.layout;
              this.footerY = layout.y;
            }}></View>
          }}




          style={this.styles.listView}


          // not working android RN 0.14.2
          onKeyboardWillShow={this.onKeyboardWillShow}
          onKeyboardDidShow={this.onKeyboardDidShow}
          onKeyboardWillHide={this.onKeyboardWillHide}
          onKeyboardDidHide={this.onKeyboardDidHide}

          /*
            keyboardShouldPersistTaps={false} // @issue keyboardShouldPersistTaps={false} + textInput focused = 2 taps are needed to trigger the ParsedText links
            keyboardDismissMode='interactive'
          */

          keyboardShouldPersistTaps={true}
          keyboardDismissMode='on-drag'


          initialListSize={10}
          pageSize={this.props.messages.length}


          {...this.props}
        />

      </Animated.View>
    );
  },

  render() {
    // alert(this.props.hideTextInput);
    return (
      <View
        style={this.styles.container}
        ref='container'
      >
        {this.renderAnimatedView()}

        {this.props.isLogin?this.renderTextInput():(this.props.hideTextInput==true || !this.state.showInputTextAndFuncButton?null:<LoginGuidePage setLogin={this.props.setLogin} thingsProfileDTO = {this.props.thingsProfileDTO}/>)}
        {/*this.renderAudioRecord()*/}
        {this.renderFunctionButton()}
        {this.renderWebView()}
      </View>
    )
  },
  _selectPhoto:function(){
    const options = {
      title: 'Photo Picker',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 300,
      allowsEditing:true,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePickerManager.launchImageLibrary(options, (response) => {
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
        this.eventEmitter('emit','imagePost',response.data);
      }
    });
  },
  _takePhoto:function(){
    const options = {
      title: 'Photo Picker',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 300,
      allowsEditing:true,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePickerManager.launchImageLibrary(options, (response) => {
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
        this.eventEmitter('emit','imagePost',response.data);
      }
    });
  },
  renderFunctionButton(){
    if(!this.state.showInputTextAndFuncButton || !this.state.showFunctionButton){
      return null;
    }
    return (
      <View style={this.styles.toolbarContainer}>
        <Button
          onPress={()=>{
            this._showHideFunctionButton();
            this.onRecorderSwitchClick(true);
          }}
          style={this.styles.sendButton}>
          <Image style={{height:30,width:30}} source={require('image!icon-black-audio')}/>
        </Button>
        <Button
          onPress={this._takePhoto}
          style={this.styles.sendButton}>
          <Image style={{height:30,width:30}} source={require('image!icon-black-photo')}/>
        </Button>
        <Button
          onPress={this._selectPhoto}
          style={this.styles.sendButton}>
          <Image style={{height:30,width:30}} source={require('image!icon-black-album')}/>
        </Button>
        <Button
          style={this.styles.sendButton}>
          <Image style={{height:30,width:30}} source={require('image!icon-black-doodle')}/>
        </Button>
        <Button
          style={this.styles.sendButton}>
          <Image style={{height:30,width:30}} source={require('image!icon-black-keyboard')}/>
        </Button>
      </View>
    );
  },
  renderAudioRecord:function(){
    return(
        <View style={this.styles.textInputContainer}>
          <TouchableOpacity
              style={[this.styles.textInput,{borderWidth:1,borderColor:"gainsboro",flexDirection:"column",justifyContent:"center",alignItems:"center"}]}>
              <Text style={{textAlign:"center"}}>Press and speak</Text>
          </TouchableOpacity>
          <Button
              style={this.styles.sendButton}
              styleDisabled={this.styles.sendButtonDisabled}
              onPress={this.onSend}
              disabled={this.state.disabled}
          >
            {this.props.sendButtonText}
          </Button>
        </View>
    );
  },
  onRecorderSwitchClick:function(isRecord){
    if(isRecord==undefined){
      isRecord = !this.state.showRecorder;
    }
    this.setState({
      showRecorder:isRecord
    });
  },
  startRecord(){
    // console.log("start record!");
    let _this = this;
    AudioHandler.startRecord(function (data) {

      audioRecord = {audioName: "", audio: ""};
      audioRecord.audioName = data+".wav";
      _this.props.setProgressBar(true);
      // _this._getPower();
    })

  },
  endRecord(){
    // console.log("end record!");

    let _this = this;
    AudioHandler.stopRecord(function (data) {
      audioRecord.audio = data;
      // _this._postVoiceCommentToServer(thingId,_this.state.title,userId,audioRecord);
      _this.setState({
        audio:data,
        audioName:audioRecord.audioName,
        text:"",
        photo:null,
      });
      _this.onSend();
    });

    this.props.setProgressBar(false);

  },
  _showHideFunctionButton:function(isShow){
    if(isShow==undefined){
      isShow = this.state.showFunctionButton ? false:true;
    }
    var textInputHeight = 0;
    if (this.props.hideTextInput === false) {
      textInputHeight = 50;
    }

    var functionButtonHeight = 50;
    if(!isShow){
      functionButtonHeight = 0;
    }
    this.listViewMaxHeight = this.props.maxHeight - textInputHeight - functionButtonHeight-tabBarHeight;
    this.setState({
      height: new Animated.Value(this.listViewMaxHeight),
      lvHeight: new Animated.Value(this.listViewMaxHeight),
      showFunctionButton:isShow

    })
    dismissKeyboard();
  },
  renderTextInput() {
    if(!this.state.showInputTextAndFuncButton){
      return null;
    }
    if (this.props.hideTextInput === false) {
      return (
        <View style={[this.styles.textInputContainer,{justifyContent:"center",alignItems:"center"}]}>
          <TouchableOpacity
            style={{
              marginRight:5,
              justifyContent:"center",
              alignItems:"center",
              // height:30,width:30,borderRadius:15,borderWidth:1,borderColor:"gainsboro"
            }}
            onPress={()=>this.onRecorderSwitchClick()}
          >
            {
              this.state.showRecorder===true ?
                <Image style={{height:25,width:25}} source={require('image!icon-black-keyboard')}/> :
                <Image style={{height:25,width:25}} source={require('image!icon-black-audio')}/>

            }
          </TouchableOpacity>
          {
            this.state.showRecorder===true ?
            <TouchableOpacity
                onLongPress={this.startRecord}
                onPressOut={this.endRecord}
                style={[this.styles.speakButton,{borderWidth:1,borderColor:"gainsboro",flexDirection:"column",justifyContent:"center",alignItems:"center"}]}>
              <Text style={{textAlign:"center"}}>Press and speak</Text>
            </TouchableOpacity>
                :
            <TextInput
              style={this.styles.textInput}
              placeholder={this.props.placeholder}
              ref='textInput'
              onChangeText={this.onChangeText}
              value={this.state.text}
              autoFocus={this.props.autoFocus}
              returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
              onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}
              enablesReturnKeyAutomatically={true}
              blurOnSubmit={false}
            />
          }
          <TouchableOpacity style={{
            marginLeft:5,
            justifyContent:"center",
            alignItems:"center",
            // height:30,
            // width:30,
            // borderRadius:15,
            // borderWidth:1,
            // borderColor:"gainsboro"
            }}
            onPress={()=>{this._showHideFunctionButton()}}
          >
            {

              <Image style={{height:30,width:30}} source={require('image!icon-black-morecomment')}/>

            }
          </TouchableOpacity>
          {/*<Button
            style={this.styles.sendButton}
            styleDisabled={this.styles.sendButtonDisabled}
            onPress={this.onSend}
            disabled={this.state.disabled}
          >
            {this.props.sendButtonText}
          </Button>*/}
        </View>
      );
    }
    return null;
  },

  componentWillMount() {
    this.styles = {
      container: {
        flex: 1,
        backgroundColor: '#FFF',
      },
      listView: {
        flex: 1,
      },
      textInputContainer: {
        height: 44,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#b2b2b2',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
      },
      toolbarContainer: {
        height: 44,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#b2b2b2',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:"center",
        paddingLeft: 10,
        paddingRight: 10,
      },
      textInput: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
        margin: 0,
        fontSize: 15,
      },
      sendButton: {
        marginTop: 11,
        marginLeft: 10,
      },
      date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      link: {
        color: '#007aff',
        textDecorationLine: 'underline',
      },
      linkLeft: {
        color: '#000',
      },
      linkRight: {
        color: '#fff',
      },
      loadEarlierMessages: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadEarlierMessagesButton: {
        fontSize: 14,
      },
      speakButton:{
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
        margin: 0
      }
    };

    Object.assign(this.styles, this.props.styles);
  },
});

module.exports = GiftedMessenger;
