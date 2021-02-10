import React from 'react';
import { StyleSheet, Dimensions,ScrollView,TouchableOpacity, View} from 'react-native';
import { Block } from 'galio-framework';
import Button from "./Button";
import { Text } from "galio-framework";
const { width } = Dimensions.get('screen');
class ButtonCalendarStrip extends React.Component {
    state = {
        daysOfAMonth:[],
        selectedButton:''
    }
   addDays = (date, days) => {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
   populateDaysOfAMonth = () => {
    if(this.state.daysOfAMonth.length == 0) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var today = new Date();
        //var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var daysOfAMonth = []
        var todayDate = today.getDate();
        while (firstDay <= today) {
            var generatedDate = new Date (firstDay);
            var date = generatedDate.getDate();
            var weekDayInText = days[generatedDate.getDay()]
            weekDayInText = weekDayInText.substring(0,3);
            var structuredData = {
                date:date,
                fullDate:generatedDate,
                weekDayInText: weekDayInText 
            }
            daysOfAMonth.push(structuredData);
            firstDay = this.addDays(firstDay,1);
        }
        this.setState({
            daysOfAMonth: daysOfAMonth,
            selectedButton: todayDate
        })
    }
   }

   innerHandler = (handler, value, key) => {
       handler(value)
       this.setState({
        selectedButton:key
      })
   }

  renderTabs = (handler) => {
    return (
        this.state.daysOfAMonth.map((e, index) => {
            return (
              <View key={e.date} style={styles.stripButtonContainer}>
                <TouchableOpacity 
                style={this.state.selectedButton === e.date ? styles.stripButtonActive : styles.stripButton }
                onPress={() => this.innerHandler(handler, e.fullDate, e.date)}>
                <Text style={{color: this.state.selectedButton === e.date ? '#ff8901' : 'silver', paddingTop:7, fontSize: 13}}>{e.weekDayInText}</Text>
                <Text style={{color: this.state.selectedButton === e.date ? '#ff8901' : 'silver', fontSize: 15}}>{e.date}</Text>
                </TouchableOpacity>
              </View>
            );
        })
    )
  }
  componentDidMount() {
    this.populateDaysOfAMonth()
  }
  render() {
    const { handler } = this.props;
    if (this.state.daysOfAMonth.length > 0) {
    return (
        <Block center style={styles.tabContainer}>
         <ScrollView horizontal={true} >
             <Block row>
                {this.renderTabs(handler)}
            </Block>
          </ScrollView>
        </Block>
      );
    } else {
        return (<Text>Not available at the moment</Text>);
    }
  }
}

const styles = StyleSheet.create({
  tabContainer: {
    width:width,
    height:90,
    backgroundColor:'white',
  },
  stripButtonContainer: {
    flexDirection:"row",
    padding:10
  },
  stripButton: {
    flex:2,
    alignItems: 'center',
    backgroundColor:'#f1f2f6',
    width:50,
    height:55,
    borderRadius:5
  },
  stripButtonActive: {
    flex:2,
    alignItems: 'center',
    backgroundColor:'white',
    borderWidth:2,
    borderColor:'#ff8901',
    width:50,
    height:60,
    borderRadius:5
  }
});

export default ButtonCalendarStrip;
