import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Block, theme } from 'galio-framework';
import Button from "./Button";
import { Text } from "galio-framework";
import argonTheme from '../constants/Theme';
const { width } = Dimensions.get('screen');
class FooterApp extends React.Component {
  renderTabs = (params, navigation) => {
    return (
      <Block row>
        <Button style={{ ...styles.tab, 
          backgroundColor: params.vehicles ? 'black' : theme.COLORS.TRANSPARENT}}
           onPress={() => navigation.navigate('Vehicles')}>
          <Block row middle>
            <Text size={16} style={{ ...styles.tabTitle, 
            color: params.vehicles ? '#fed428' : argonTheme.COLORS.HEADER}}>{'Vehicles'}</Text>
          </Block>
        </Button>
        <Button style={{ ...styles.tab, 
          backgroundColor: params.map ? 'black' : theme.COLORS.TRANSPARENT}}
           onPress={() => navigation.navigate('Map')}>
          <Block row middle>
            <Text size={16} style={{ ...styles.tabTitle, 
            color: params.map ? '#fed428' : argonTheme.COLORS.HEADER}}>{'Map'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  render() {
    const { params, navigation } = this.props;
    return (
        <Block center style={styles.tabContainer}>
         { this.renderTabs(params, navigation)}
        </Block>
      );
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    width:Dimensions.get('window').width,
    height:100,
    backgroundColor:'#fed428',
    zIndex:1
  },
  tab: {
    justifyContent: 'center',
    width: width * 0.35,
    borderRadius: 1,
    borderWidth: 2,
    height: 30,
    elevation:0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400'
  },
});

export default FooterApp;
