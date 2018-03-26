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

var MiddleBottom = React.createClass({
	render:function(){
		return (
			<View style={styles.cont}>
				
				<View style={{flex:1}}></View>

				<View style={styles.cont2}>

					<View style={styles.cont2A_view}>
						<View style={{flex:1.5,marginTop:10, alignItems:'center'}}>
							<Image
								style={styles.cont2Image}
								source={require('image!pic2')} />
						</View>
						<View style={styles.cont2View}>
							<View style={{flex:1, flexDirection:'row'}}>
								<View style={{flex:5}}>
									<Text style={{fontSize:15, color:'#4F57BF',}}>王欣</Text>
								</View>
								<View style={{flex:10}}>
									<Text style={{textAlign:'right', fontSize:13, color:'#AFB0B6',}}>2月25日 17:36</Text>
								</View>
								<View style={{flex:2}}></View>
							</View>

							<Text style={{fontSize:15,}}>听说这部剧非常不错，我一早就留意了，持续关注中！</Text>
						</View>
					</View>

					<View style={styles.cont2A_view}>
						<View style={{flex:1.5,marginTop:10, alignItems:'center'}}>
							<Image
								style={styles.cont2Image}
								source={require('image!pic3')} />
						</View>
						<View style={styles.cont2View}>
							<View style={{flex:1, flexDirection:'row'}}>
								<View style={{flex:5}}>
									<Text style={{fontSize:15, color:'#4F57BF',}}>李琳</Text>
								</View>
								<View style={{flex:10}}>
									<Text style={{textAlign:'right', fontSize:13, color:'#AFB0B6',}}>2月25日 18:11</Text>
								</View>
								<View style={{flex:2}}></View>
							</View>
							<Text style={{fontSize:15, marginBottom:10}}>嗯嗯，主要是剧情非常吸引！</Text>
						</View>
					</View>

					<View style={styles.cont2A_view}>
						<View style={{flex:1.5,marginTop:10, alignItems:'center'}}>
							<Image
								style={styles.cont2Image}
								source={require('image!pic4')} />
						</View>
						<View style={styles.cont2View}>
							<View style={{flex:1, flexDirection:'row'}}>
								<View style={{flex:5}}>
									<Text style={{fontSize:15, color:'#4F57BF',}}>✨天天向上</Text>
								</View>
								<View style={{flex:10}}>
									<Text style={{textAlign:'right', fontSize:13, color:'#AFB0B6',}}>2月25日 21:08</Text>
								</View>
								<View style={{flex:2}}></View>
							</View>
							<Text style={{fontSize:15, marginBottom:10}}>男主角也非常帅气！顺便宣传一下我的商铺：http://baidu.com</Text>
						</View>
					</View>

					<View style={styles.cont2A_view}>
						<View style={{flex:1.5,marginTop:10, alignItems:'center'}}>
							<Image
								style={styles.cont2Image}
								source={require('image!pic5')} />
						</View>
						<View style={styles.cont2View}>
							<View style={{flex:1, flexDirection:'row'}}>
								<View style={{flex:5}}>
									<Text style={{fontSize:15, color:'#4F57BF',}}>星光灿烂</Text>
								</View>
								<View style={{flex:10}}>
									<Text style={{textAlign:'right', fontSize:13, color:'#AFB0B6',}}>2月25日 22:21</Text>
								</View>
								<View style={{flex:2}}></View>
							</View>
							<Text style={{fontSize:15, marginBottom:10}}>终于等到这部电视剧了！</Text>
						</View>
					</View>

					<View style={{flex:1,flexDirection:'row',}}>
						<View style={{flex:1.5,marginTop:10, alignItems:'center'}}>
							<Image
								style={styles.cont2Image}
								source={require('image!pic6')} />
						</View>
						<View style={styles.cont2View}>
							<View style={{flex:1, flexDirection:'row'}}>
								<View style={{flex:5}}>
									<Text style={{fontSize:15, color:'#4F57BF',}}>Ivy</Text>
								</View>
								<View style={{flex:10}}>
									<Text style={{textAlign:'right', fontSize:13, color:'#AFB0B6',}}>2月26日 09:18</Text>
								</View>
								<View style={{flex:2}}></View>
							</View>
							<Text style={{fontSize:15, marginBottom:10}}>i think so！ i hope this movice will good :)</Text>
						</View>
					</View>
					
				</View>

				<View style={{flex:1}}></View>

			</View>
		);
	},
})

const styles = StyleSheet.create({
	cont:{
		flex:1,
		flexDirection:'row',
	},
//-----
	cont2:{
		flex:20,
		backgroundColor:'white',
	},
	cont2A_view:{
		flex:1,
		flexDirection:'row',
		borderBottomColor:'#AFB0B6',
		borderBottomWidth:0.3,
	},
	cont2View:{
		flex:10,
		marginTop:5, 
		marginBottom:5,
	},
	cont2Image:{
		width:35,
		height:35,
		borderRadius:17,
	},
});

module.exports = MiddleBottom
