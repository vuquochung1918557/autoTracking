import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image} from 'react-native';
import { Block, theme } from 'galio-framework';
import { Button, FooterApp} from "../components";
import Images from "../constants/Images";
import { Text } from "galio-framework";
import axios from 'axios';
const { height, width } = Dimensions.get('screen');
class Home extends React.Component {
  
  state = {
    vehicles:[]
  }
  getVehicleList = () => {
    var self = this;
    axios({
      method: "get",
      url: '/rest/vehicles/'})
      .then(function(response){
        self.setState({
          vehicles: response.data.results
        })
      }).catch((error) =>{
        alert("Error")
      });
  }
  componentDidMount(){
    this.getVehicleList()
  }
  renderDirectionImage = () => {
    return (
      <Image
        source={ Images.arrowUp}
        style={styles.directionImage}
      />
    )
  }
  toDateTime = (sDate) => {
    var date = new Date(sDate)
    return date.toLocaleString();
  }
  renderVehicleList = (navigation) => {
    return (
      this.state.vehicles.map((e, index) => {
          return (
            <Block center key={e.id}>
            <Button
            onPress={() => navigation.navigate("Stops",
             {vehicleId : e.id, vehicleName: e.name})}
            style={{ height: 100, width: width - 100}}
            color="secondary">
            <Block row style={styles.vehicleButtonContent}>
              <Block row>
                {this.renderDirectionImage()}
              </Block>
              <Block>
                <Text style={styles.buttonText}>{e.name}</Text>
                <Text style={styles.buttonText2}>{this.toDateTime(e.state_changed)}</Text>
              </Block>
            </Block>
          </Button>
          </Block>
          );
          })
    )
  }
  renderFooter = (navigation) => {
      return (
        <FooterApp params={{vehicles:true, map:false}} navigation={navigation}/>
      );
  }
  render() {
    const { navigation } = this.props;
    if (this.state.vehicles.length > 0) {
      return (
        <Block style={{ height: height - 40 }}>
        <ScrollView >
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          {this.renderVehicleList(navigation)}
        </Block>
        </ScrollView>
          {this.renderFooter(navigation)}
        </Block>
      );
    } else {
        return (
        <Block style={{ height: height - 40 }}>
        <ScrollView>
        <Text>Not available at the moment</Text>
        </ScrollView>
          {this.renderFooter(navigation)}
        </Block>
      );
    }
  }
}

const styles = StyleSheet.create({
  vehicleButtonContent: {
    textAlign: 'left', 
    alignSelf: 'stretch'
  },
  buttonText: {
    textAlign: 'left', 
    alignSelf: 'stretch', 
    color: "black", 
    fontSize: 25, 
    fontWeight: "700"
  },
  buttonText2: {
    textAlign: 'left', 
    alignSelf: 'stretch', 
    color: "black"
  },
  directionImage: {
    width: 50,
    height: 50
  },
});

export default Home;
