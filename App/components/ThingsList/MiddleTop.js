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

var MiddleTop = React.createClass({
	render:function(){
		return (
			<View style={styles.cont}>

				<View style={{flex:1,height:5}}></View>
				<View style={{flex:1, flexDirection:'row',}}>

					<View style={styles.cont1}>
						<Image
							style={{width:50, height:50, borderRadius:25,}}
							source={require('image!pic1')} />
					</View>

					<View style={{flex:10}}>
						<Text style={{fontSize:18, color:'#4F57BF'}}>张三发布</Text>
						<View style={{flex:1,}}>
							<Text style={{fontSize:15}}>
								没错重大新闻就是由戚家基导演，@曾志偉獎門人 监制，@黄宗泽 、@金刚69 、@方皓玟   、徐子珊主演的《刑警兄弟》发布先导海报啦，黄宗泽手撕金刚，战斗即将打响，谁将获得最终的胜利，前排出售瓜子、饮料、板凳、零食!
							</Text>
						</View>
						<Image
							style = {styles.contentImage}
							source = {{ uri:'http://ww4.sinaimg.cn/bmiddle/006dCPs5jw1f18cpht7olj30qo14u7h3.jpg' }}
							/>
						<View>
							<Text style={{marginTop:10, color:'#AFB0B6'}}>2月25日 17:23</Text>
						</View>
					</View>

					<View style={{flex:0.3}}></View>	
				</View>
			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont:{
		flex:1,
	},
//---------
	cont1:{
		flex:2,
		alignItems:'center',
	},
	contentImage: {
		width:150,
		height:229,
		marginTop:10,
	},

});

module.exports = MiddleTop
