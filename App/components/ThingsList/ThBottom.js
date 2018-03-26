
'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	TextInput,
	Image,
	TabBarIOS,
	Alert,
	TouchableOpacity,
} = React;
var EventEmitterMixin = require('react-event-emitter-mixin');

const THBTextInput = React.createClass({
	mixins:[EventEmitterMixin],
	name:'ThBottom',
	render:function(){
		if (this.props.show) {
			return (
				<View style={{flex:1,}}>
					<View style={{flex:1, flexDirection:'row',}}>
					 	<TextInput
					 		style={{width:this.props._textViewWidth,height:25 }}
					 		onChange={()=>{}} 
					 		onFocus={
					 			()=>{this.eventEmitter('emit','eventA','foo','bar');}
					 		}
					 		onBlur={()=>{ this.eventEmitter('emit','eventB',1,0) }}/>
					 	<Text> 😊 </Text>
					</View>
				 	<View style={{flex:0.5, height:0.5, backgroundColor:"#979797"}}></View>
			 	</View>
			)
		}else{
			return (
				<View style={{flex:1, flexDirection:'row'}}>
					<View style={{flex:0.5}}></View>
					<View style={{flex:5}}>
						<View style={{flex:0.2}}></View>
						<TouchableOpacity
							onPress={()=>{alert('说话')}}>
							<View style={{flex:5,alignItems:'center', borderColor:'#555',borderRadius:3, borderWidth:0.3}}>
								<Text style={{fontSize:18}}> 按 住  说 话 </Text>
							</View>
						</TouchableOpacity>
						<View style={{flex:0.2}}></View>
					</View>
					<View style={{flex:0.5}}></View>
				</View>
			)
		}
	}
});


var ThBottom = React.createClass({
	mixins:[EventEmitterMixin],
	name:'ThBottom2',
	getInitialState:function(){
		return {
			textViewWidth:0,
			onVedio: false,
			text_Viewheight:0,
			viewflex:true,
		}
	},

	render:function(){
		return (
			<View style={styles.cont}>

				<View style={{flex:0.01, backgroundColor:"red"}}></View>

				<View style={styles.cont1}>
					<View style={{flex:0.2,}}></View>
					<View style={{flex:1}}>

						<TouchableOpacity
							onPress={()=>{
								this.setState({onVedio:!this.state.onVedio})
							}}>
						<Image 
							source={ this.state.onVedio ? require('image!vedio') : require('image!keyboard')} />
						</TouchableOpacity>

					</View>

					<View
						style={{flex:8,}}
						onLayout={(event)=>{
							var _lay = event.nativeEvent.layout
							this.setState({textViewWidth:(_lay.width*0.90), text_Viewheight:_lay.height});

						}}>
							<THBTextInput show={this.state.onVedio} _textViewWidth={this.state.textViewWidth}/>
					</View>

					<View style={{flex:1, alignItems:'center'}}>
						<Text
						  onPress={()=>{
						  	if(this.state.viewflex){	
						  		this.eventEmitter('emit','eventB',2,8) 
						  	}
						   	else{
						   		this.eventEmitter('emit','eventB',2,0)
						   	}
						   	this.setState({viewflex:!this.state.viewflex}) 
						  }}>➕</Text>
					</View>
				</View>

			</View>
		);
	},
})


const styles = StyleSheet.create({
	cont: {
		flex:1,
		backgroundColor:"#fff"
	},
	cont1:{
		flex:1,
		alignItems:'center',
		flexDirection:'row',

	},
});

module.exports = ThBottom

