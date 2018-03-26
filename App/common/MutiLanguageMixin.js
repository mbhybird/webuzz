'use strict';

var EventEmitterMixin = require('react-event-emitter-mixin');

var MutiLanguageMixin = {
    getInitialstate(){

        return{
            mixinStateCurrentLanguageIndex:false
        }

    },
    componentWillMount(){

        if(!this.eventEmitter){
            EventEmitterMixin.componentWillMount();
        }
    },
    componentWillUnmount(){

        if(!this.eventEmitter)
        {
            EventEmitterMixin.componentWillUnmount();
        }
    },
    componentDidMount(){
        let _this = this;
        if(!_this.eventEmitter){
            EventEmitterMixin.eventEmitter('on', 'LanguageRefresh', function(cl){
                _this.setState({
                    mixinStateCurrentLanguageIndex:cl
                })
            });
        } else {
            this.eventEmitter('on', 'LanguageRefresh', function(cl){
                this.setState({
                    mixinStateCurrentLanguageIndex:cl
                })
            });
        }
    }
}

module.exports = MutiLanguageMixin;