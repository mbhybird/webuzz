'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	TextInput,
	Image,
	ScrollView,
	Dimensions,
  	DeviceEventEmitter
} = React;
var ThingChat = require('./ThingChat');
var MiddleTop = require('./MiddleTop');
var MiddleBottom = require('./MiddleBottom');
var UIManager = require('UIManager');

var EventEmitterMixin = require('react-event-emitter-mixin');

var ThMiddle = React.createClass({
	mixins:[EventEmitterMixin],

	  getInitialState:function(){
	    return {
	      visibleHeight:0,
	      svHeight:0,
	    }
	  },

	  componentWillMount:function(){
	    DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow)
	    DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide)
	    this.eventEmitter('on','eventA',(a,b)=>{
            this.refs._viewp.measure(this.loLayout);
        });
	  },

	  keyboardWillShow:function(e) {
	    let newSize = e.endCoordinates.height
	    this.setState({visibleHeight: newSize})
	    // this.eventEmitter('emit','eventB',this.state.visibleHeight)
	  },
	  keyboardWillHide:function(e) {
	    this.setState({visibleHeight: 0})
	    this.refs._scrollv.scrollTo(0)
	  },

	  moveSv:function(_hei){
	  	// console.log()
	  	this.refs._scrollv.scrollTo(_hei-this.state.visibleHeight)
	  },

	loLayout:function(ox,oy,width,height,px,py){
		this.moveSv(height);
		console.log(width, height, px, py)
	},

	render:function(){
		return (
			<View style={styles.cont}>
			
					<ScrollView
						ref='_scrollv'
						contentContainerStyle={{}}
						>
						<View ref='_viewp'>
							<MiddleTop />
							<View style={{height:40}}></View>
							<MiddleBottom />
						</View>
					</ScrollView>

				<View style={{height:this.state.visibleHeight}}></View>

			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont: {
		flex:1,
	},
//------
	cont1:{
		flex:1,

	},
//-----
	cont2:{
		flex:30,
		//backgroundColor:'#fff',
	},
//-----
	cont3:{
		flex:1,
	}
});

module.exports = ThMiddle
