import React from "react";
import { Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// screens
import Vehicles from "../screens/Vehicles";
import Onboarding from "../screens/Onboarding";
import Stops from "../screens/Stops";
import Trips from "../screens/Trips";
import Map from "../screens/Map";

// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Header } from "../components";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function StopsStack(route,props) {
  const { vehicleId, vehicleName } = route.route.params;
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Stops"
        component={Stops}
        options={{
          header: ({ scene }) => (
            <Header
              title="Stops"
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
        initialParams={{ vehicleId: vehicleId, vehicleName:vehicleName }}
      />
    </Stack.Navigator>
  );
}

function MapStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          header: ({ scene }) => (
            <Header
              title="Map"
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

function TripsStack(route,props) {
  const { vehicleId, vehicleName } = route.route.params;
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Trips"
        component={Trips}
        options={{
          header: ({ scene }) => (
            <Header
              title="Trips"
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
        initialParams={{ vehicleId: vehicleId, vehicleName:vehicleName }}
      />
    </Stack.Navigator>
  );
}

function VehiclesStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Vehicles"
        component={Vehicles}
        options={{
          header: ({  scene }) => (
            <Header
              title="Vehicles"
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Vehicles"
    >
      <Drawer.Screen unmountOnBlur={true} options={{unmountOnBlur: true}} name="Vehicles" component={VehiclesStack} />
      <Drawer.Screen unmountOnBlur={true} options={{unmountOnBlur: true}} name="Map" component={MapStack} />
      <Drawer.Screen unmountOnBlur={true} options={{unmountOnBlur: true}} name="Stops" component={StopsStack} />
      <Drawer.Screen unmountOnBlur={true} options={{unmountOnBlur: true}} name="Trips" component={TripsStack} />
    </Drawer.Navigator>
  );
}

