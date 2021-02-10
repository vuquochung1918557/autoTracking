import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Block, theme } from 'galio-framework';
import Button from "./Button";
import { Text } from "galio-framework";
import argonTheme from '../constants/Theme';
const { width } = Dimensions.get('screen');
class FooterVehicle extends React.Component {
  renderTabs = (selection, params, navigation) => {
    return (
      <Block row>
        <Button style={{ ...styles.tab, 
          backgroundColor: selection.stops ? 'black' : theme.COLORS.TRANSPARENT}} onPress={() => navigation.navigate('Stops',
        {vehicleId : params.vehicleId, vehicleName: params.vehicleName})}>
          <Block row middle>
            <Text size={16} style={{ ...styles.tabTitle, 
            color: selection.stops ? '#fed428' : argonTheme.COLORS.HEADER}}>{'Stops'}</Text>
          </Block>
        </Button>
        <Button style={{ ...styles.tab, 
          backgroundColor: selection.trips ? 'black' : theme.COLORS.TRANSPARENT}} onPress={() => navigation.navigate('Trips',
        {vehicleId : params.vehicleId, vehicleName: params.vehicleName})}>
          <Block row middle>
            <Text size={16} style={{ ...styles.tabTitle, 
            color: selection.trips ? '#fed428' : argonTheme.COLORS.HEADER}}>{'Trips'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  render() {
    const { selection, params, navigation } = this.props;
    return (
        <Block center style={styles.tabContainer}>
         { this.renderTabs(selection, params, navigation)}
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

export default FooterVehicle;
