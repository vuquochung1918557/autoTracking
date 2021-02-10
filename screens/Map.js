import React from 'react';
import { StyleSheet, Dimensions,View} from 'react-native';
import {Picker} from '@react-native-community/picker'
import { Block,Button } from 'galio-framework'
import { Input,FooterApp } from "../components";
import { Text } from "galio-framework";
import axios from 'axios';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import argonTheme from "../constants/Theme";
const { height, width } = Dimensions.get("screen")
const VehicleMarker = (props) => (
  <View>
  <View
    style={{
      alignSelf:"flex-start",
      padding: 0,
      flexDirection:'row',
      backgroundColor: "white",
      borderColor: "white",
      borderRadius: 5,
      elevation: 10
    }}
  >
    <View style={{ backgroundColor: props.highlight ? "red" : "green", width:25, height:25,borderRadius: 5}} />
    <Text style={{ color: "black" }}>{props.name}</Text>
  </View>
  <View style={{ alignSelf:"center", borderColor:"white", borderWidth:2, backgroundColor: "cyan", width:15, height:15,borderRadius: 100}} />
  </View>
);

class Map extends React.Component {
  
  state = {
    Vehicles:[],
    Locations:[],
    AllLocations:[],
    SelectionList:[],
    selectedGroupId:0,
    searchVechicleName:''
  }
  renderFooter = (navigation) => {
    return (
      <FooterApp params={{vehicles:false, map:true}} navigation={navigation}/>
    );
  }
  getVehicleList = () => {
    var self = this;
    axios({
      method: "get",
      url: '/rest/vehicles/?page=1'})
      .then(function(response){
        self.setState({
          vehicles: response.data.results
        })
        for(var i=0, n=response.data.results.length; i < n; i++) 
        { 
          self.addNewLocation(response.data.results[i])
          self.getVehicleGroups(response.data.results[i])
        }
        var AllLocations = self.state.AllLocations
        self.setState({
          Locations: AllLocations,
          AllLocations: AllLocations
        })
      }).catch((error) =>{
        alert("Error")
      });
  }
  getVehicleGroups = (data) => {
    var SelectionList = this.state.SelectionList
    for(var i=0;i<data.Position.properties.groups.length;i++) {
      const found = this.state.SelectionList.some(el => el.id === data.Position.properties.groups[i].id);
      if (!found) {
        SelectionList.push(data.Position.properties.groups[i]);
      }
    }
    this.setState({
      SelectionList: SelectionList
    })
  }

  addNewLocation = (data) => {
    this.state.AllLocations.push({id: data.id, Position: data.Position, name: data.name})
  }
  componentDidMount(){
   this.getVehicleList()
  }
  renderTheMarkers = () => {
    return (
      this.state.Locations.map((e, index) => {
          return (
            <Marker key={e.id} coordinate={{ latitude: e.Position.geometry.coordinates[1], longitude: e.Position.geometry.coordinates[0] }}>
              <VehicleMarker highlight={e.highlight} name={e.name}/>
            </Marker>
          );
          })
    )
  }
  onSelectionChange = (id) => {
    var Locations = this.state.AllLocations
    if(id !== '0') {
      var Locations = this.state.AllLocations.filter(function (el) {
        return el.Position.properties.groups && el.Position.properties.groups[0] 
        && el.Position.properties.groups[0].id && el.Position.properties.groups[0].id == id
      });
    }
    this.setState({
      Locations: Locations,
      selectedGroupId: id
    })
  }
  searchTheName = () => {
    var Locations = this.state.Locations;
    var value = this.state.searchVechicleName;
    for (var i=0; i<Locations.length;i++) {
      if(Locations[i].name === value) {
        Locations[i].highlight = true;
      } else {
        Locations[i].highlight = false;
      }
    }
    this.setState({ 
      Locations: Locations});
  }
  onChangeTextSearch = (value) => {
    this.setState({ 
      searchVechicleName: value });
  } 
  renderVehicleGroups = () => {
    let items = this.state.SelectionList.map( (e, i) => {
      return <Picker.Item key={e.id} value={e.id} label={e.name} />
    });
    return items;
  }
  render() {
    const { navigation } = this.props;
    let items =  this.renderVehicleGroups();
    let markers =  this.renderTheMarkers();
      return (
        <Block style={{ height: height - 40 }}>
          <Block center>
            <Block center>
              <Picker style={{width: width * 0.9}}
                selectedValue={this.state.selectedGroupId}
                onValueChange={(id) => this.onSelectionChange(id)}>
                <Picker.Item key={'0'} value={'0'} label={'Vehicle Group'} />
                {items}
              </Picker>
            </Block>
            <Block row>
                <Input
                  style={{width: width * 0.63}}
                  onChangeText={this.onChangeTextSearch}
                  defaultValue={this.state.searchVechicleName}
                  borderless
                  placeholder="Vehicle Name"
                />
                <View>
                <Button
                  style={{width: width * 0.23}}
                  onPress={this.searchTheName}
                  color={argonTheme.COLORS.SECONDARY}>
                  <Text>Search</Text>
                </Button>
                </View>
            </Block>
          </Block>
          <Block center>
          <MapView style={styles.map} 
          initialRegion={{
            latitude: 55.676098,
            longitude: 12.568337,
            latitudeDelta: 5,
            longitudeDelta: 5
          }}>
            {markers}
          </MapView>
        </Block>
          {this.renderFooter(navigation)}
        </Block>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width:Dimensions.get('window').width,
    height: height - 100 
  },
  map: {
    width: width,
    height: height - 250
  },
});
export default Map;
