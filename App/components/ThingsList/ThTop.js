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
} = React;

var ThTop = React.createClass({

	render:function(){
		return (
			
			<View style={styles.cont}>

				<View style={styles.cont1}>
					<Text
					 style={{fontSize:35, color:'white'}}
					 onPress={()=>{ this.props.navigator()  }  }> ← </Text>
					<Text style={{fontSize:28, color:'black'}}>| </Text>
					<Text style={{fontSize:18, color:'white'}}>电影刑警兄弟</Text>
				</View>

			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont: {
		flex:1,
		// opacity:0.6,
		backgroundColor:'#8A5E5E'
	},
//--------
	cont1:{
		flex:2,
		alignItems:'center',
		
		flexDirection:'row',
		
	},
});

module.exports = ThTop
