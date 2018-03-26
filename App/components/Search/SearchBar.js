/**
 * Created by BrianLee on 16/7/4.
 */
var React = require('react-native');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    ListView,
    Image,
    TextInput
} = React;

var Dimensions = require('Dimensions');
var windowWidth = Dimensions.get('window').width;
var EventEmitterMixin = require('react-event-emitter-mixin');
var TextInputState = require('TextInputState');
var UIManager = require('UIManager');

var SearchBar = React.createClass({
    mixins:[EventEmitterMixin],
    getInitialState:function(){
        return{
            text:"",
            textAlign:"center"
        }
    },
    componentDidMount:function () {
      this._clearSearchEvent();
    },
    _sendSearchEvent:function () {
        this.eventEmitter("emit","searchBar",this.state.text);
    },
    _clearSearchEvent:function () {

        this.eventEmitter("on","clearSearch",function(){
            this.setState({
                text:"",
                textAlign:"center"
            })
        });
    },
    onFocus:function () {
        this.setState({
            textAlign:"left"
        });
        UIManager.focus(TextInputState.currentlyFocusedField());
    },
    onBlur:function(){
        if(this.state.text==""){
            this.setState({
                textAlign:"center"
            })
        }
    },
    render: function () {
        return(
            <View style={{borderRadius:10,marginTop:7,backgroundColor:"white",overflow:"hidden",paddingLeft:10}}>
                <TextInput
                    onSubmitEditing={this._sendSearchEvent}
                    onFocus = {this.onFocus}
                    onBlur={this.onBlur}
                    clearButtonMode={"while-editing"}
                    autoFocus={false}
                    returnKeyType = {"search"}
                    placeholder={" Search"}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    textAlign={this.state.textAlign}
                    style={{width:windowWidth-100,height:25,backgroundColor:"white"}}/>
            </View>
        )

    }
});

module.exports = SearchBar;