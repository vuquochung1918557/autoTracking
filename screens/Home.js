import React from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Button} from "../components/";
import { Text } from "galio-framework";
import axios from 'axios';
const { width } = Dimensions.get('screen');

class Home extends React.Component {
  
  state = {
    vehicles:[]
  }
  getVehicleList = () => {
    var self = this;
    axios({
      method: "get",
      url: 'https://frontend.autotracking.dk/rest/vehicles/?page=1',
      withCredentials: true})
      .then(function(response){
        self.setState({
          vehicles: response.data.results
        })
      }).catch((error) =>{
          
      });
  }
  componentDidMount(){
    this.getVehicleList()
  }
  renderVehicleList = () => {
    return (
      this.state.vehicles.map((e, index) => {
          return (
            <Block center key={e.id}>
            <Button
            onPress={() => this.props.navigation.navigate("Stops", {vehicleId : e.id, vehicleName: e.name})}
            color="secondary"
            textStyle={{ color: "black", fontSize: 12, fontWeight: "700" }}>
            {e.name}
          </Button>
          </Block>
          );
          })
    )
  }

  render() {
    const { navigation } = this.props;
    if (this.state.vehicles.length > 0) {
      return (
        <ScrollView>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          {this.renderVehicleList()}
        </Block>
        </ScrollView>
      );
    } else {
      return (
      <ScrollView>
      <Text>Loading data</Text>
      </ScrollView>);
    }
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  }
});

export default Home;
