import React from 'react';
import { StyleSheet, Dimensions, ScrollView,View,Image } from 'react-native';
import { Block, theme } from 'galio-framework';
import { Button,FooterVehicle, ButtonCalendarStrip} from "../components";
import { Text } from "galio-framework";
import Images from "../constants/Images";
import axios from 'axios';
const { height, width } = Dimensions.get('screen');

class Stops extends React.Component {
  state = {
    stops:[],
    totalStops:0
  }
  renderFooter = (params, navigation) => {
    return (
      <FooterVehicle 
      params={params}
      selection={{stops:true, trips:false}}
      navigation={navigation}/>
    );
  }
  calendarHandler = (selectedDate) => {
    this.getStops(selectedDate);
  }
  
  calendarHandler = this.calendarHandler.bind(this);
  renderTheStrip = () => {
    var calendarHandler = this.calendarHandler;
    return (
      <ButtonCalendarStrip
        handler = {calendarHandler}/>
    );
  }
  getStops = (selectedDate) => {
    var self = this;
    var todayFrom = new Date(selectedDate);
    todayFrom.setHours(0,0,0,0);
    var todayTo = new Date(selectedDate);
    todayTo.setHours(23,59,59,999);
    var url =  '/rest/stops/?vehicle='
    .concat(self.props.route.params.vehicleId)
    .concat('&startdate=')
    .concat(todayFrom.toISOString())
    .concat('&enddate=')
    .concat(todayTo.toISOString())
    .concat('&ordering=start_time&type=stops&page=1')

    axios({
      method: "get",
      url: url})
      .then(function(response){
        var totalDuration = 0;
        for(var i=0, n=response.data.results.length; i < n; i++) 
        { 
            totalDuration += parseFloat(response.data.results[i]['duration']); 
        }
        self.setState({
          stops: response.data.results,
          totalStops: Math.round(totalDuration)
        })
      }).catch((error) =>{
        alert("Error") 
      });
  }
  componentDidMount(){
    this.getStops(new Date());
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
  renderStopsList = () => {
    return (
      this.state.stops.map((e, index) => {
          return (
            <Block center key={e.id} >
            <Button
            color="secondary"
            style={styles.vehicleName}
            textStyle={styles.buttonTextStyle}>
            <View style={styles.leftContainer}>
            <Text style={{fontWeight: 'bold'}}>Vehicle {this.props.route.params.vehicleName}</Text></View>
            <View style={styles.rightContainer}>
            <Text style={{fontWeight: 'bold'}}>Stop time{"\n"}{this.secondsToHourString(e.duration)} hrs</Text>
            </View>
          </Button>
            <Button
              style={styles.stopsAddress}
                color="secondary"
                textStyle={styles.buttonTextStyle}>
              <View style={styles.leftContainer}>
              <Text>Stop address {e.address}</Text>
              </View>
              <View style={styles.rightContainer}>
              <Text style={{fontWeight: 'bold'}}>{this.toHourMinutes(e.start_time)} hrs {"\n"}{this.toHourMinutes(e.end_time)} hrs</Text>
              </View>
            </Button>
          </Block>
          );
        })
    )
  }

  renderTheStops = () => {
    if (this.state.stops.length > 0) {
      return (
        <ScrollView>
          <Block style={styles.totalContainer}>
              <Button
                style={styles.summary}
                textStyle={styles.buttonTextStyle}>
                <View>
                <Image
                  source={ Images.car}
                  style={styles.buttonImage}
                />
                </View>
                <View>
                <Text>Total stops</Text><Text style={{fontWeight: 'bold'}}>{this.secondsToHourString(this.state.totalStops)} hrs</Text>
                </View>
              </Button>
              <Button style={styles.summaryInvisible}>
              </Button>
          </Block>
          <Block style={{ paddingHorizontal: theme.SIZES.BASE }}>
            {this.renderStopsList()}
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
      {this.renderTheStops()}
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
  },
  summary :{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 240, 
    height: 60,
    backgroundColor:'#fed428'
  },
  summaryInvisible :{
    width: 240, 
    height: 60,
    elevation:0,
    backgroundColor: theme.COLORS.TRANSPARENT
  },
  totalContainer : {
    width:width,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    flexDirection:'row'
  },
  stopsAddress: { width: width - 100, 
    height: 80, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  vehicleName: { 
    width: width - 100,  
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  buttonTextStyle: { 
    color: "black",
    fontSize: 20, 
    fontWeight: "700" 
  }
});

export default Stops;
