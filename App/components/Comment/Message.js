import React, {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native';
import Bubble from './Bubble';
import ErrorButton from './ErrorButton';

var styles = StyleSheet.create({
  rowContainer: {
    marginTop:10,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems:"center"
  },
  name: {
    // color: '#aaaaaa',
    color:"black",
    fontSize: 15,
    marginLeft: 0,
    marginBottom: 10,
  },
  rightName: {
    color: '#aaaaaa',
    alignSelf: 'flex-end',
    fontSize: 12,
    marginRight: 55,
    marginBottom: 5,
  },
  imagePosition: {
    height: 40,
    width: 40,
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 20,
  },
  imageLeft: {
  },
  imageRight: {
  },
  spacer: {
    width: 10,
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
});

export default class Message extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      cellHeight:0,
    }
  }
  
  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderName(name, position, displayNames, diffMessage){
    if (displayNames === true) {
      if (diffMessage === null || name !== diffMessage.name) {
        return (
          <Text style={(position === 'left' ? styles.name : styles.rightName)}>
            {name}
          </Text>
        );
      }
    }
    return null;
  }

  renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress){
    if (rowData.image !== null) {
      if (forceRenderImage === true) {
        diffMessage = null; // force rendering
      }

      if (diffMessage === null || (diffMessage != null && (rowData.name !== diffMessage.name || rowData.id !== diffMessage.id))) {
        if (typeof onImagePress === 'function') {
          return (
            <TouchableHighlight
              underlayColor='transparent'
              onPress={() => onImagePress(rowData, rowID)}
            > 
            <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
            </TouchableHighlight>
          );
        } else {
          return (
            <Image source={rowData.image} style={[styles.imagePosition, styles.image, (rowData.position === 'left' ? styles.imageLeft : styles.imageRight)]}/>
          );
        }
      } else {
        return (
          <View style={styles.imagePosition}/>
        );
      }
    }
    return (
      <View style={styles.spacer}/>
    );
  }

  renderErrorButton(rowData, rowID, onErrorButtonPress){
    if (rowData.status === 'ErrorButton') {
      return (
        <ErrorButton
          onErrorButtonPress={onErrorButtonPress}
          rowData={rowData}
          rowID={rowID}
          styles={styles}
        />
      )
    }
    return null;
  }

  renderStatus(status){
    if (status !== 'ErrorButton' && typeof status === 'string') {
      if (status.length > 0) {
        return (
          <View>
            <Text style={styles.status}>{status}</Text>
          </View>
        );
      }
    }
    return null;
  }

  render(){

    var {
      rowData,
      rowID,
      onErrorButtonPress,
      position,
      displayNames,
      diffMessage,
      forceRenderImage,
      onImagePress,
      onMessageLongPress,
      onMessagePress,
    } = this.props;

    var flexStyle = {};
    var RowView = Bubble;
    if ( rowData.text.length > 40 ) {
      flexStyle.flex = 1;
    }

    if ( rowData.view ) {
      RowView = rowData.view;
    }

    var messageView = (
      <View>
        {/*position === 'left' ? this.renderName(rowData.name, displayNames, diffMessage) : null*/}

        <View
            style={[styles.rowContainer, {
              justifyContent: position==='left'?"flex-start":"flex-end",
            }]}
            onLayout={(e)=>{
              this.setState({
                cellHeight:e.nativeEvent.layout.height
              });
            }}
        >
          <View style={{flexDirection:'column',justifyContent:"flex-start",height:this.state.cellHeight}}>
            {position === 'left' ? this.renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress) : null}
          </View>
          {position === 'right' ? this.renderErrorButton(rowData, rowID, onErrorButtonPress) : null}
          <View style={{flexDirection:'column',flex:1}}>
          {this.renderName(rowData.name, rowData.position, displayNames, diffMessage)}
          <RowView
            navigator={this.props.navigator}
            {...rowData}
            renderCustomText={this.props.renderCustomText}
            styles={styles}
            />
            {/*rowData.position === 'right' ? this.renderImage(rowData, rowID, diffMessage, forceRenderImage, onImagePress) : null*/}
          </View>
        </View>
        {/*rowData.position === 'right' ? this.renderStatus(rowData.status) : null*/}
      </View>
    );
    
    if (typeof onMessageLongPress === 'function') {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onLongPress={() => onMessageLongPress(rowData, rowID)}
          onPress={()=> onMessagePress(rowData,rowID)}
        >

          {messageView}
        </TouchableHighlight>
      );
    } else {
      return messageView;
    }
  }
}
