import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Platform, Dimensions,View} from 'react-native';
import {  Block, NavBar, theme } from 'galio-framework';

import Icon from './Icon';
import argonTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }
  render() {
    const { back, title, white, transparent, bgColor, iconColor, titleColor, navigation, ...props } = this.props;
    const headerStyles = [
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <View>
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          transparent={transparent}
          rightStyle={{ alignItems: 'center' }}
          left={
            <Icon 
              name={back ? 'chevron-left' : "menu"} family="entypo" 
              size={20} onPress={this.handleLeftPress} 
              color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
              style={{ marginTop: 2 }}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
      </Block>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    textAlign:'center',
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  }
});

export default withNavigation(Header);
