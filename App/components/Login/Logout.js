'use strict';

var React = require('react-native');
var {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	TextInput,
	Image,

} = React;
var AppLogin = require('react-native').NativeModules.AppLogin;
var FBLoginManager = require('react-native').NativeModules.FBSDKLoginManager;
var Login = require('./Login');
var storageHandler = require('../../common/StorageHandler');
var EventEmitterMixin = require('react-event-emitter-mixin');

var Logout = React.createClass({

	mixins:[EventEmitterMixin],

	_setCheckState:function(){
		this.props.name();
	},
  _releaseStorage:function(){
    storageHandler.releaseAllStorage();
  },
	render:function(){
		return (
			<View style={styles.continer}>

				<View style={{justifyContent:'center'}}>
					<TouchableHighlight
					 	onPress={()=>{
						  FBLoginManager.logOut(()=>
							  {
								this._setCheckState()
							  });
							  AppLogin.logoutApp();
							  this._setCheckState();
							  this._releaseStorage();
							  this.eventEmitter('emit','LogOut');
						   }}
					 >
						<Text style={styles.cont1}>Logout</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont1: {
		width:150,
		height:50,
		backgroundColor:'#ff2',
		borderRadius: 10,
		textAlign:'center',
		fontSize:30,
	},
	continer: {
		flex:1,
		justifyContent: 'center',
		alignItems:'center',

	},
});

module.exports = Logout
