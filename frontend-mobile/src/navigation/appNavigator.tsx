import React from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Storage from '../utils/storage';

// SCREENS
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import BuatLaporanScreen from '../screens/BuatLaporanScreen';
import SemuaLaporanScreen from '../screens/SemuaLaporanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Profile: undefined;
  About: undefined;
  CreateLaporan: undefined;
  SemuaLaporan: undefined;

  Detail: {
    id: number;
  };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {

  return (
    <Stack.Navigator initialRouteName="Landing">
    
      {/* LANDING PAGE */}
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* LOGIN */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Masuk',
        }}
      />

      <Stack.Screen
      name="SemuaLaporan"
      component={SemuaLaporanScreen}
      options={{
        title: 'Lihat Semua Laporan',
      }}
    />

      {/* REGISTER */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Daftar',
        }}
      />

    <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Beranda',
          headerRight: () => (
            <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('About')}
              style={{ marginRight: 20 }}
              >
              <Image
              source={require('../../assets/about.png')}
              style={{
                width: 26,
                height: 26,
              }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{ marginRight: 15 }}
            >
              <Image
                source={require('../../assets/user.png')}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                }}
              />
            </TouchableOpacity>

            <Pressable
              onPress={async () => {
                await Storage.removeItem('token');
                await Storage.removeItem('user');
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }}
              hitSlop={10}
              style={{ marginRight: 10, padding: 8 }}
            >
              <Image
                source={require('../../assets/log-out.png')}
                style={{
                  width: 26,
                  height: 26,
                }}
              />
            </Pressable>
         </View>
          ),
        })}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />


      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Tentang Aplikasi',
        }}
      />

        <Stack.Screen
        name="CreateLaporan"
        component={BuatLaporanScreen}
      />

      {/* DETAIL */}
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          title: 'Detail Laporan',
        }}
      />
    </Stack.Navigator>
  );
}