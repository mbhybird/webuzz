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

var ThingChat = React.createClass({
	render:function(){
		if (this.props.direction==='left') {
			return (
				<View style={styles.cont}>

					<View style={styles.lcont1}>
						<Image
							style={{width:50, height:50, borderRadius:25,}}
							source={require('image!pic1')} />
					</View>

					<View style={{flex:1, transform:[{rotate:'25deg'}]} 
						//旋转框，形成聊天对话框的效果
					}>
						<View style={{marginLeft:9, width:40,height:30,backgroundColor:"white",borderWidth:0.5}}></View>
					</View>

					<View style={styles.lcont2}>
						
						<Text style={ styles.l2text}>
							没错重大新闻就是由戚家基导演，@曾志偉獎門人 监制，@黄宗泽 、@金刚69 、@方皓玟   、徐子珊主演的《刑警兄弟》发布先导海报啦，黄宗泽手撕金刚，战斗即将打响，谁将获得最终的胜利，前排出售瓜子、饮料、板凳、零食
						</Text>
						
					</View>
					<View style={styles.lcont3}></View>

				</View>
			);
		}else {
			return (
				<View style={styles.cont}>

					<View style={styles.rcont1}></View>

					<View style={styles.rcont2}>
						<View style={{flex:1}}></View>
						<View style={styles.rcount22}>
							<Text style={styles.r2text}>好期待啊！</Text>
						</View>
					</View>

					<View style={styles.rcont3}>
						<Image
							style={{width:50, height:50, borderRadius:25,}}
							source={require('image!pic2')} />
					</View>

				</View>
			);
		};
	},
})

const styles = StyleSheet.create({
	cont: {
		flex:1,
		flexDirection:'row',
		marginTop:5,
		
	},
//------left
	lcont1:{
		flex:5,
		// marginLeft:5,
		alignItems:'center',
	},
	//-----
	lcont2:{
		flex:20,
		backgroundColor:'#fff',
		marginRight:3,
		borderRadius:8,
		borderWidth:0.3,
	},
	l2text:{
		margin: 5,
	},
	//-----
	lcont3:{
		 flex:5,
	},

//--------right
	rcont1:{
		flex:5,
	},
	//-----
	rcont2:{
		flex:20,
		flexDirection:'row',
		// backgroundColor:'#ee5',
	},
	rcount22:{
		flexDirection:'column',
		marginRight:3,
		marginLeft:3,
		borderWidth:0.2,
		borderRadius:8,
		backgroundColor:'#fff'
	},
	r2text:{
		margin: 5,
		writingDirection:'ltr',
	},
	//-----
	rcont3:{
		flex:5,
		marginRight:5,
	},
});

module.exports = ThingChat
