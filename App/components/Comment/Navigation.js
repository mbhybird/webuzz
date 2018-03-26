'use strict';

var React = require('react-native');
var {
  Text,
  Navigator,
  Platform,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  WebView,
  Dimensions,
  DeviceEventEmitter,
    TextInput
} = React;

var Icon = require('react-native-vector-icons/FontAwesome');
var GlobalConstants = require('../../constants/GlobalConstants.js');
var Swiper = require('react-native-swiper');
var EventEmitterMixin = require('react-event-emitter-mixin');
var ThingDetailToolBar = require('../ToolsBar');
var ThingToolBar = require('../ThingToolBar.js');

var GlobalEventEmitter = require('../GlobalEventEmitter.ios.js');

/*add by Brian for handle audio play*/
var AudioHandler = require('react-native').NativeModules.AudioHandler;
var g_ConstInfo = require("../../constants/GlobalConstants.js");
var windowWidth = Dimensions.get('window').width;
var marginWidth = 5;
var PeopleAround = require('../Users/PeopleAround');
var IconNumber = require('../IconNumber');
var ThingsRelated = require('../Users/ThingsRelated');

import { GiftedForm, GiftedFormManager } from 'react-native-gifted-form'

//=============== topic edit screen =====================//
class Form extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      form: {
        thingsId:this.props.thingsProfileDTO.thing._id,
        userId:this.props.thingsProfileDTO.user._id,
      }
    }
  }

  handleValueChange(values) {
    console.log('handleValueChange', values)
    this.setState({ form: values })
  }


  render() {
    const { thingsId,userId } = this.state.form
    return (
      <View style={{flex: 1, margin:5, paddingTop: 20, paddingLeft:5}}>
        <GiftedForm
          formName='topicEdit'
          clearOnClose={true}
          openModal={(route) => { this.props.navigator.push(route) }}
          onValueChange={this.handleValueChange.bind(this)}
          validators={{
            title: {
              title: 'Topic title',
              validate: [{
                validator: 'isLength',
                arguments: [1, 23],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters',
              }]
            },
            type:{
              title: 'Topic type',
              validate: [{
                validator: (...args) => {
                  if (args[0] === undefined) {
                    return false;
                  }
                  return true;
                },
                message: '{TITLE} is required',
              }]
            },
          }}
        >
          <GiftedForm.RowWidget
            title='Back'
            onPress={() => { this.props.navigator.pop() }}
            image={ <Icon name="reply" size={20} color={'lightGray'} /> }
            disclosure={false}
          >
          </GiftedForm.RowWidget>
          <GiftedForm.TextInputWidget
            autoFocus={true}
            name='title'
            title='Topic title'
            placeholder='Topic title here...'
            clearButtonMode='while-editing'
            image={ <Icon name="tag" size={20} color={'red'} /> }
          />

          <GiftedForm.GroupWidget title='Choose Type'>
            <GiftedForm.SelectWidget name='type' multiple={false}>
              <GiftedForm.OptionWidget title='Chat' value='Chat' image={ <Icon name="comments" size={20} color={'green'} /> } />
              <GiftedForm.OptionWidget title='Doodle' value='Doodle' image={ <Icon name="paint-brush" size={20} color={'orange'} /> }/>
              <GiftedForm.OptionWidget title='Html' value='Html' image={ <Icon name="file-powerpoint-o" size={20} color={'brown'} /> } />
            </GiftedForm.SelectWidget>
          </GiftedForm.GroupWidget>

          <GiftedForm.SeparatorWidget />

          <GiftedForm.TextInputWidget
            name='link'
            title='Topic link'
            placeholder='e.g.:[http(s)://(www.)things.buzz/(...)]'
            clearButtonMode='while-editing'
            image={ <Icon name="link" size={20} color={'blue'} /> }
          />

          <GiftedForm.SubmitWidget
            title='Save'
            widgetStyles={{
              submitButton: {
                backgroundColor: 'skyblue',
              }
            }}
            onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
              if (isValid === true) {
                // prepare object
                /* Implement the request to your server using values variable
                ** then you can do:
                ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                */

                if(values['type'] == 'Html'){
                  if(values['link'] === undefined){
                    postSubmit(['Link is required']);
                    return;
                  }
                  else{
                    var re = new RegExp(/^([H|h]ttp[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
                    if (re.test(values['link'])) {
                      //post request(html)
                      fetch(GlobalConstants.WEBUZZ_HOST+'/api/things/addtopic', {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                          "title":values['title'],
                          "link":values['link'],
                          "type":values['type'],
                          "createBy":values['userId'],
                          "things":values['thingsId']
                        })
                      })
                      .then(res => res.json())
                      .then(res => {
                        if(res.message=='Topic created!'){
                          postSubmit();
                          this.props.navigator.pop();
                          this.props.handleRefreshTopics();
                        }
                      }
                      );
                    }
                    else{
                      postSubmit(['Link is not validate']);
                      return;
                    }
                  }
                }
                else{
                  //post request(doodle,chat)
                  fetch(GlobalConstants.WEBUZZ_HOST+'/api/things/addtopic', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                      "title":values['title'],
                      "link":'',
                      "type":values['type'],
                      "createBy":values['userId'],
                      "things":values['thingsId']
                    })
                  })
                  .then(res => res.json())
                  .then(res => {
                    if(res.message=='Topic created!'){
                      postSubmit();
                      this.props.navigator.pop();
                      this.props.handleRefreshTopics();
                    }
                  }
                  );
                }
              }
            }}

          />
          <GiftedForm.NoticeWidget
            title='By add topic, you agree to the Terms of Service and Privacy Policity.'
          />
          <GiftedForm.HiddenWidget name='thingsId' value={thingsId} />
          <GiftedForm.HiddenWidget name='userId' value={userId} />
        </GiftedForm>
      </View>
    );
  }
};

//=============== things profile screen =====================//
var Navigation = React.createClass({
  
  mixins:[EventEmitterMixin],
  
  getInitialState: function() {
    return {
      thingsName : this.props.thingsProfileDTO.thing.name,
      thingsPhoto : this.props.thingsProfileDTO.thing.photo,
      thingsTopics: [],
      userPhoto : this.props.thingsProfileDTO.userPhoto,
      userName : this.props.thingsProfileDTO.user.nickname,
      isShowPhoto:true,
      isShowImagePost:false,
      windowHeight:300,
      source:"",
    };
  },
  componentWillMount() {
    this._fecthTopis();
  },
  _fecthTopis(){
    //fecth things topics
    fetch(GlobalConstants.WEBUZZ_HOST+'/api/things/topics/'+this.props.thingsProfileDTO.thing._id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
        this.setState({
          thingsTopics : res
        });

        this.eventEmitter('emit','topicMoveIndex',0);
      }
    );
  },
  componentDidMount(){
      // DeviceEventEmitter.addListener('UIKeyboardNotifications',(data)=>{alert("keyboard will show")});
      // GlobalEventEmitter.addListener(GlobalEventEmitter.UIKeyboardNotifications.UIKeyboardWillShowNotification, (data) => {
      //   console.log("show show show ");
      // });
      //
      // GlobalEventEmitter.addListener(GlobalEventEmitter.UIKeyboardNotifications.UIKeyboardWillHideNotification, (data) => {
      //   console.log("hide hide hide ");
      // });
      this._listenImagePostEvent();

      this.eventEmitter('on','appendComment',(message,title)=>{
        this.state.thingsTopics.find((item) => item.title == title).comments.push(message);

        // let thingsTopic = this.state.thingsTopics.find((item) => item.title == title);
        // let comments = thingsTopic
        // this.eventEmitter('emit','refreshComments',comments,thingsTopic.type,thingsTopic.link,thingsTopic.title);
      });
      this.eventEmitter('on','topicMoveIndex',(index)=>{
        var comments = [];
        if(this.state.thingsTopics[0].code==404) return;
        if(!this.state.thingsTopics[index]||!this.state.thingsTopics[index].comments) return;
        this.state.thingsTopics[index].comments.map((item,index) => {
        // console.log(item);
          if(!item.createBy) return;
          var photoURI = item.createBy.photo;
          if(photoURI===undefined){
            photoURI = { uri: item.createBy.facebook != null? item.createBy.facebook.headimgurl : (item.createBy.wechat !=null? item.createBy.wechat.headimgurl : null)};
          }
          else{
              photoURI = {uri: 'data:image/jpeg;base64,' + item.createBy.photo, isStatic: true};
          }
          if(item.audio)
          {
            AudioHandler.createWavFileWith(item.audio,item._id);
          }
          var c = {
            text:  item.text,
            name:  item.createBy.nickname,
            image: photoURI,
            audio: item.audio ? item.audio : undefined,
            audioName: item.audio ? item._id + ".wav" : undefined,
            //position: (index%2==0)?'left':'right',
            photo:item.photo ? item.photo : undefined,
            date: new Date(item.createDate)
          };
          comments.push(c);
        });
        var thingsTopic=this.state.thingsTopics[index];
        this.eventEmitter('emit','refreshComments',comments,thingsTopic.type,thingsTopic.link,thingsTopic.title);
    });
  },
  render() {
    // return (
    //   <Navigator
    //     initialRoute={{index: 0, title: 'Things Name'}}
    //     renderScene={this.renderScene}
    //     configureScene={(route) => {
    //       if (route.sceneConfig) {
    //         return route.sceneConfig;
    //       }
    //       return Navigator.SceneConfigs.FloatFromRight;
    //     }}
    //
    //     sceneStyle={{paddingTop: (Platform.OS === 'android' ? 56 : 64)}}
    //
    //     navigationBar={this._renderNavBar()}
    //   />
    // );
    return this.renderScene()
  },
  _showSettings(){
    alert('Navigate to the things settings...');
  },
  _renderNavBar() {
    var _self = this;
    var routeMapper = {
      LeftButton(route, navigator, index, navState) {
        return (
          <TouchableOpacity onPress={()=>{_self.props.navigator.pop();_self.props.navigator.Show();}}>
            <Icon name="arrow-left" style={{margin:5}} size={25} color="#FFF" />
          </TouchableOpacity>
        );
      },
      RightButton(route, navigator, index, navState) {
        return (
          <TouchableOpacity onPress={_self._showSettings}>
            <Icon name="navicon" style={{margin:5}} size={25} color="#FFF" />
          </TouchableOpacity>
        );
      },
      Title(route, navigator, index, navState) {
        return (
          <Text style={{
            height:20,
            marginTop:5,
            fontSize:18,
            fontWeight:'bold'
          }}>
            {_self.state.thingsName}
          </Text>
        );
      }
    };
    return (
      <Navigator.NavigationBar
        style={{
          backgroundColor: '#007aff',
          alignItems: 'center',
        }}
        routeMapper={routeMapper}
      />
    );
  },
  _jumpToThingLocation:function(){

    let _thing = this.props.thingsProfileDTO.thing;

    if(!_thing.location){
      alert("This thing hasn't share location yet!");
      return
    }

    let _routes = this.props.navigator.getCurrentRoutes();
    if(_routes && _routes.length>1){
      if(_routes[_routes.length-2].component.displayName=="ThingLocation"){
        this.props.navigator.pop();
        return;
      }
    }
    var ThingLocation = require('../Location/ThingLocation');
    this.props.navigator.push({component:ThingLocation,name:_thing.name,params:{thing:_thing}});

  },
  _showHidePhoto:function(isShow){
    this.setState({
      isShowPhoto:isShow
    });
    console.log(isShow);
  },
  _imageHeight:function(){
    if(this.state.isShowPhoto){
      return 160;
    }
    else{
      return 50;
    }
  },
  _listenImagePostEvent:function(){
    this.eventEmitter('on','imagePost',function(source){
      this.setState({
        isShowImagePost:true,
        source:source
      });
    });
  },
  _quitImagePost:function(){
    this.setState({
      isShowImagePost:false,
    })
  },
  _showHideView:function(isShow){
    if(isShow){
      return {}
    }else{
      return {height:0,opacity:1,overflow:"hidden"}
    }
  },
  renderScene(route, navigator) {
    //render topics & comments
    var GiftedMessengerExample = require('./GiftedMessengerExample');
    // this.props.navigator.Hide();
    return (
      <View>
      {
        this.state.isShowImagePost?<ImagePost exitImagePost={this._quitImagePost} navigator = {this.props.navigator} source={this.state.source}/> : null
      }
        <View style={this._showHideView(!this.state.isShowImagePost)}>
          <View
          >
            <Image
              source={{uri: 'data:image/jpeg;base64,' + this.state.thingsPhoto, isStatic: true}}
              style={{
                  height:this._imageHeight(),
                  width:windowWidth-marginWidth*2,
                  margin:marginWidth,
                  alignItems:"center",
                  flexDirection:"column",
                  justifyContent:"flex-end"
                }}
              resizeMode={Image.resizeMode.cover}>
                <View style={{
                  width:windowWidth-marginWidth*2,
                  height:30,
                  backgroundColor:"black",
                  opacity:0.8,
                  flexDirection:'row',
                  justifyContent:"flex-start",
                  alignItems:"center",
                }}>
                  <View style={{margin:5}}>
                    <PeopleAround  iconWidth={13} iconHeight={13} numberColor={'white'} navigator={this.props.navigator} thing={this.props.thingsProfileDTO.thing}/>
                  </View>

                  <View style={{margin:5}}>
                    <ThingsRelated iconWidth={13} iconHeight={13} iconColor={'orange'} numberColor={'orange'} navigator={this.props.navigator} thing={this.props.thingsProfileDTO.thing}/>
                  </View>
                </View>
              <View style={{width:windowWidth,flexDirection:"row",justifyContent:"center"}}>
                <ThingToolBar selected={"comment"} navigator={this.props.navigator} thing={this.props.thingsProfileDTO.thing}/>
              </View>

            </Image>
            <SwiperComp {...this.props} thingsTopics={this.state.thingsTopics} handleRefreshTopics={()=>{this._fecthTopis()}}/>
          </View>

          <GiftedMessengerExample photoSizeChangeRange={100} keyboardStatusChange={this._showHidePhoto} thingsTopics={this.state.thingsTopics} thingsProfileDTO={this.props.thingsProfileDTO} />
        </View>
      </View>
    );
  },
});

var ImagePost = React.createClass({
  mixins:[EventEmitterMixin],

  getInitialState:function(){
    return{
      desc:""
    }
  },

  componentDidMount:function(){

    this.props.navigator.Hide();

  },

  componentWillUnmount:function(){

    this.props.navigator.Show();

  },
  _confirm:function(){
    this.eventEmitter("emit","imagePostConfirm",this.props.source,this.state.desc);
    this.props.exitImagePost();
  },
  render:function(){
    return(
        <View style={{flex:1}}>
          <View style={{backgroundColor:"white",height:60}}/>
          <TouchableOpacity
              onPress={this.props.exitImagePost}
              style={{
              position:"absolute",
              top:30,
              left:5,
              backgroundColor:"white",
              height:40
            }}>
            <Text>cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={this._confirm}
              style={{
              position:"absolute",
              top:30,
              right:5,
              backgroundColor:"white",
              height:40
            }}>
            <Text>confirm</Text>
          </TouchableOpacity>
          <View style={{borderColor:'lightgray',borderBottomWidth: 1,borderTopWidth: 1,flex:1,justifyContent:"flex-start"}}>
            <TextInput
                textAlign={0}
                defaultValue={this.state.desc}
                onChangeText={(text)=>{this.setState({desc:text})}}
                placeholder={"Say Something about your this"}
                multiline={true}
                style={{
                  width:Dimensions.get('window').width,
                  height:150,
                  color:"black",
                  fontSize:16
                }}
            />
            
            <TouchableOpacity
                style={{margin:5}}>
              <Image style={{width:64,height:64}} source={{uri:g_ConstInfo.IMAGE_BASE64_PREFIX+this.props.source}}/>
            </TouchableOpacity>
          </View>
        </View>
    )
  }
});
//=============== topic swiper region =====================//

var SwiperComp = React.createClass({
  getInitialState:function(){
    return{
      swiperIndex:0,
      canAddTopic:false,
    }
  },
  mixins:[EventEmitterMixin],

  componentDidMount:function(){
    this._checkAddTopicRight();
  },
  _onMomentumScrollEnd: function (e, state, context) {
    this.eventEmitter('emit','topicMoveIndex',state.index);
    this.setState({
      swiperIndex:state.index,
    })
  },
  _onMomentumScrollBegin: function (e, state, context) {

  },
  _addTopic: function(){
    this.props.navigator.push({component:Form,params:{...this.props}});
    this.eventEmitter('emit','topicMoveIndex',0);
  },
  _checkAddTopicRight:function(){
    let ownerId = this.props.thingsProfileDTO.thing.owner._id?this.props.thingsProfileDTO.thing.owner._id : this.props.thingsProfileDTO.thing.owner;
    let userId = this.props.thingsProfileDTO.user._id;
    this.setState({
      canAddTopic:ownerId==userId
    })
  },
  render: function() {
    console.log("Owner:"+this.props.thingsProfileDTO.thing.owner);
    console.log("User:"+this.props.thingsProfileDTO.user._id);
    var topics = this.props.thingsTopics;
    if(topics.length==0){
      topics.push({title:'Oops...topic not found',code:404});
    }
    var topicsView = topics.map((item,index) => {
      return  (
        <View style={styles.slide} key={index}>
          { item.code==404? <Icon name="warning" size={20} color="gray" /> : null }
          <Text size={20} style={{fontSize:15}}>{item.title}</Text>
          {
            this.state.canAddTopic?
            <TouchableOpacity onPress={this._addTopic}>
              <Icon name="plus-circle" size={20} color="gray" />
            </TouchableOpacity> : null
          }

        </View>
      );
    });
    return (
      <View>
        <Swiper style={styles.wrapper}
          height={40}
          renderPagination={renderPagination}
          showsButtons={true}
          loop={false}
          onMomentumScrollEnd = {this._onMomentumScrollEnd}
          onScrollBeginDrag = {this._onMomentumScrollBegin}
          index={this.state.swiperIndex}
        >
          {topicsView}
        </Swiper>
      </View>
    )
  }
});

var renderPagination = function (index, total, context) {
  return (
    /*
    <View style={{
      position: 'absolute',
      bottom: -1,
      right: 10,
    }}>
      <Text style={{fontWeight:'bold'}}><Text style={{
        color: '#007aff',
        fontSize: 20,
      }}>{index + 1}</Text>/{total}</Text>
    </View>*/
    <View/>
  )
}

const styles=StyleSheet.create({
  hide:{
    opacity:0
  },
  show:{
    opacity:1
  },
  wrapper: {
  },
  slide: {
    flex: 1,
    margin:5,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
  }
});


module.exports = Navigation;
