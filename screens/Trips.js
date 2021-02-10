import React from 'react';
import { StyleSheet, Dimensions, ScrollView,View,Image } from 'react-native';
import Images from "../constants/Images";
import { Block, theme } from 'galio-framework';
import { Button,FooterVehicle, ButtonCalendarStrip} from "../components";
import { Text } from "galio-framework";
import axios from 'axios';

const { height,width } = Dimensions.get('screen');

class Trips extends React.Component {
  state = {
    Trips:[],
    totalTrips:0,
    totalTime:0
  }
  calendarHandler = (selectedDate) => {
    this.getTrips(selectedDate);
  }
  calendarHandler = this.calendarHandler.bind(this);
  getTrips = (selectedDate) => {
    var self = this;
    var todayFrom = new Date(selectedDate);
    todayFrom.setHours(0,0,0,0);
    var todayTo = new Date(selectedDate);
    todayTo.setHours(23,59,59,999);
    var url = '/rest/autotrip?vehicle='
    .concat(self.props.route.params.vehicleId)
    .concat('&startdate=')
    .concat(todayFrom.toISOString())
    .concat('&enddate=')
    .concat(todayTo.toISOString())
    .concat('&ordering=gps_time&page=1');
    axios({
      method: "get",
      url: url})
      .then(function(response){
        var totalTravelling = 0;
        var totalSeconds = 0;
        for(var i=0, n=response.data.features.length; i < n; i++) 
        { 
          totalTravelling += parseFloat(response.data.features[i].properties['distance']); 
          const theSeconds = self.getTheSecondsFromARange(response.data.features[i].properties['start_time'], response.data.features[i].properties['end_time'])
          totalSeconds += theSeconds;
        }
        self.setState({
          Trips: response.data.features,
          totalTrips: Math.round(totalTravelling),
          totalTime: Math.round(totalSeconds)
        })
      }).catch((error) =>{
        alert("Error")
      });
  }
  renderTheStrip = () => {
    var calendarHandler = this.calendarHandler;
    return (
      <ButtonCalendarStrip
        handler = {calendarHandler}/>
    );
  }
  componentDidMount(){
    this.getTrips(new Date());
  }
  secondsToHourString = (totalSeconds) => {
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor(totalSeconds % 3600 / 60);

    var hDisplay = h.toString();
    var mDisplay = m.toString();
    return hDisplay.concat(':').concat(mDisplay); 
  }
  toHourMinutes = (time) => {
    var date = new Date(time);
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var hourMinutes = hour.toString().concat(":").toString().concat(minutes);
    return hourMinutes;
  }
  getTheMsFromARange = (sDate1,sDate2) => {
    var date1 = new Date(sDate1);
    var date2 = new Date(sDate2);
    var diffMs = (date2 - date1);
    return diffMs;
  }
  toHoursMinutesFromARange = (sDate1,sDate2) => {
    const diffMs = this.getTheMsFromARange(sDate1, sDate2);
    var diffHrs = Math.round(Math.floor((diffMs % 86400000) / 3600000)); 
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    return diffHrs.toString().concat(":").concat(diffMins)
  }
  getTheSecondsFromARange = (sDate1,sDate2) => {
    var date1 = new Date(sDate1);
    var date2 = new Date(sDate2);
    var seconds = (date2.getTime() - date1.getTime()) / 1000;
    return seconds;
  }
  renderFooter = (params, navigation) => {
    return (
      <FooterVehicle 
      params={params}
      selection={{stops:false, trips:true}}
      navigation={navigation}/>
    );
  }
  renderTripsList = () => {
    return (
      this.state.Trips.map((e, index) => {
          return (
            <Block center key={e.id}>
            <Button
              style={styles.vehicleName}
                color="secondary"
              textStyle={styles.buttonTextStyle}>
            <View style={styles.leftContainer}>
            <Text style={{fontWeight: 'bold'}}>Vehicle {this.props.route.params.vehicleName}</Text> 
            </View>
            <View style={styles.rightContainer}>
            <Text style={{fontWeight: 'bold'}}>{e.properties.distance} km {"\n"}{this.toHoursMinutesFromARange(e.properties.start_time,e.properties.end_time)} hrs </Text>
              </View>
          </Button>
            <Button
              style={styles.tripsInfo}
              color="secondary"
              textStyle={styles.buttonTextStyle}>
              <View style={styles.leftContainer}>
              <Text>Start{"\n"}{e.properties.start_address}</Text>
              </View>
              <View style={styles.rightContainer}>
              <Text style={{fontWeight: 'bold'}}>{this.toHourMinutes(e.properties.start_time)} hrs</Text>
              </View>
            </Button>
            <Button
              style={styles.tripsInfo}
              color="secondary"
              textStyle={styles.buttonTextStyle}>
              <View style={styles.leftContainer}>
              <Text>End{"\n"}{e.properties.end_address}</Text>
              </View>
              <View style={styles.rightContainer}>
              <Text style={{fontWeight: 'bold'}}>{this.toHourMinutes(e.properties.end_time)} hrs</Text>
              </View>
            </Button>
          </Block>
          );
        })
    )
  }

  renderTheTrips = () => {
    if (this.state.Trips.length > 0) {
    return (
      <ScrollView>
          <Block style={styles.totalContainer}>
            <Button
              style={ styles.summary}>
              <View>
              <Image
                source={ Images.car}
                style={styles.buttonImage}
              />
              </View>
              <View>
              <Text>Total trips</Text>
              <Text style={{fontWeight: 'bold'}}>{this.state.totalTrips} km</Text>
              </View>
            </Button>
            <Button
            style={ styles.summary2}>
              <View>
              <Image
                source={ Images.dollar}
                style={styles.buttonImage}
              />
              </View>
              <View>
              <Text>Total time</Text>
              <Text style={{fontWeight: 'bold'}}>{this.secondsToHourString(this.state.totalTime)} hrs</Text>
              </View>
            </Button>
          </Block>
        <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
          {this.renderTripsList()}
        </Block>
        </ScrollView>
    );
    } else {
      return (
        <Block style={styles.totalContainer}>
        <Text>Not available at the moment</Text>
        </Block>
      );
    }
  }

  render() {
    const { route, navigation } = this.props;
      return (
        <Block style={{ height: height - 40 }}>
        {this.renderTheStrip()}
        {this.renderTheTrips()}
        {this.renderFooter(route.params,navigation)}
        </Block>
      );
    }
}

const styles = StyleSheet.create({
  buttonImage: {
    width: 50,
    height: 50
  },
  tripsInfo: { 
    width: width - 100,
    height: 120, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  summary2 :{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 240, 
    height: 60,
    backgroundColor:'#ff8901'
  },
  buttonTextStyle:{ 
    color: "black",
    fontSize: 20,
    fontWeight: "700" 
  },
  vehicleName: { 
    width: width - 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  leftContainer: {
    padding:10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    padding:10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  summary :{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 240, 
    height: 60,
    backgroundColor:'#fed428'
  },
  totalContainer : {
    width:width,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection:'row'
  }
});

export default Trips;
