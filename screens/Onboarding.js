import React from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen")
import axios from 'axios';
import { Icon, Input } from "../components";
import argonTheme from "../constants/Theme";
import Images from "../constants/Images";
import { NativeModules } from 'react-native'
const Networking = NativeModules.Networking;
class Onboarding extends React.Component {
  state = {
    email: 'dev2@autotracking.dk',
    password: 'cornsirup',
  }
  login = () => {
    var self = this
    Networking.clearCookies((cleared) => {
      axios.get("/ecodrive/")
      .then(function (response) {
        const headers = response.headers;
        var setCookie = headers['set-cookie'][0];
        const key1 = "csrftoken";
        const key2 = ";";
        var csrfTokenCookie = setCookie.substr(setCookie.indexOf(key1), setCookie.indexOf(key2)); 
        const csrfToken = csrfTokenCookie.substr(csrfTokenCookie.indexOf('=') + 1,csrfTokenCookie.length);
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken',csrfToken);
        formData.append('email',self.state.email);
        formData.append('password',self.state.password);
        formData.append('locale','en');
        axios.defaults.headers.common['Cookie'] = csrfTokenCookie.concat(";")
        axios.post('/ecodrive/',formData)
          .then(function(response){
            if(response.data.search('alert alert-danger') == -1) {
              self.props.navigation.navigate("App"); 
            } else {
              alert("Incorrect login information")
            }
          }).catch((error) =>{
            alert("Error login")
            alert(error)
          });
      })
      .catch(function (error) {
        alert("Error connection")
        alert(error)
      })
      .then(function () {
      })
  
    });
  }
  onChangeTextEmail = (value) => {
    this.setState({ email: value });
  } 
  onChangeTextPassword = (value) => {
    this.setState({ password: value });
  }  
  render() {
    const { navigation } = this.props;
    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
        <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block top space="between" style={styles.padded}>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block style={styles.title}>
                <Block>
                  <Text color="white" size={60}>
                    Auto
                  </Text>
                </Block>
                <Block>
                  <Text color="white" size={60}>
                    Tracking
                  </Text>
                </Block>
                <Block style={styles.subTitle}>
                  <Text color="white" size={16}>
                    ReactNative Assignment
                  </Text>
                </Block>
              </Block>
              <Block >
              <Block width={width - 60} style={{ marginBottom: 15 }}>
                      <Input
                        onChangeText={this.onChangeTextEmail}
                        defaultValue={this.state.email}
                        borderless
                        placeholder="Email"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width - 60}>
                      <Input
                        onChangeText={this.onChangeTextPassword}
                        defaultValue={this.state.password}
                        password
                        borderless
                        placeholder="Password"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
              </Block>
              </Block>
              <Block center>
                <Button 
                  onPress={this.login}
                  //onPress={() => navigation.navigate("App")}
                  style={styles.button}
                  color={argonTheme.COLORS.SECONDARY}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
                  Login
                </Button>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width -60,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;
