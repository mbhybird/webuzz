'use strict';

var React = require('react-native');
var {
	StyleSheet,
	Text,
	View,
} = React;

var ThBottom = require('./ThBottom')
var ThMiddle = require('./ThMiddle')
var ThTop = require('./ThTop')
var EventEmitterMixin = require('react-event-emitter-mixin');

var ThingsList = React.createClass({
	mixins: [EventEmitterMixin],
	name: 'ThingList',
	getInitialState:function(){
		return {
			_height: 0,
			_viewflex:0
		}
	},
	componentWillMount:function(){
		this.eventEmitter('on','eventB',(bs,a)=>{
			if (bs==1){
				this.setState({_height:a})
			}else if(bs==2){
				this.setState({_viewflex:a})
			}
            
        });
	},
	render:function(){
		return (
			<View style={styles.container}>
				<View style={styles.header}></View>

				<View style={styles.con1}>
					<ThTop navigator = { ()=>{this.props.navigator.pop()} }/>
				</View>

				<View style={styles.con2}>
					<ThMiddle />
				</View>

				<View style={styles.con3}>
					<ThBottom />
				</View>

				<View style={{height:this.state._height}}></View>
				<View style={{flex:this.state._viewflex}}>
				</View>
			</View>
		);
	},
})

var styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#F7F0F0',
	},
	header: {
		height: 20,
		backgroundColor:'#3C3434',
		opacity:0.8,
	},
	con1:{
		flex:1.8,
	},
	con2:{
		flex:20,
	},
	con3:{
		flex:1.5,
	},
});

module.exports = ThingsList