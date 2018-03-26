/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

var EventEmitterMixin = require('react-event-emitter-mixin');

var Child = React.createClass({
    mixins:[EventEmitterMixin],
    name:'child',
    render(){
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>{
                        this.eventEmitter('emit','eventA','foo','bar');
                    }}
                >
                    <Text>press to emit event</Text>
                </TouchableOpacity>
            </View>
        );
    }
});
var Parent = React.createClass({
    mixins:[EventEmitterMixin],
    name:'parent',
    componentWillMount(){
        this.eventEmitter('on','eventA',(a,b)=>{
            alert(this.name); //'parent'
            alert(a+b); //'foobar'
        });
    },
    render(){
        return (
            <View style={{padding:100}}>
                <Child />
            </View>
        );
    }
});

class EventEmitterMixinComp extends Component {
  render() { 
    return (
        <Parent/>
    );
  }
}

var styles = StyleSheet.create({
  row: { flexDirection: 'row', margin: 40 },
  image: { width: 40, height: 40, marginRight: 10 },
  text: { flex: 1, justifyContent: 'center'},
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14 },
});

module.exports = EventEmitterMixinComp;
