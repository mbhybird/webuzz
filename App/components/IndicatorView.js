var React = require('react-native');
var {
    ActivityIndicatorIOS
} = React;

var IndicatorView = React.createClass({
    getInitialState:function(){
        return{
            isShow:false
        }
    },

    show: function(){
        this.setState({
            isShow:true
        })
    },

    hidden: function(){
        this.setState({
            isShow:false
        })
    },

    render:function(){
        if(this.props.refMode && this.state.isShow==false){
            return null;
        }
        return(
            <ActivityIndicatorIOS
                animating={this.props.refMode? this.state.isShow : true}
                style={{height: 80}}
                size="small"
            />)
    }
});

module.exports = IndicatorView;