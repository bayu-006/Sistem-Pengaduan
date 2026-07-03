import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../api/api';
import Storage from '../utils/storage';

import { RootStackParamList } from '../navigation/appNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function LoginScreen({
  navigation,
}: Props) {

  const [email, setEmail] = useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert(
        'Error',
        'Email dan password wajib diisi'
      );
      return;
    }

    try {

      setLoading(true);

      console.log('🔐 Login attempt:', { email, password: '***' });

      const response = await api.post(
        '/auth/login',
        {
          email,
          password,
        }
      );

      console.log('✅ Login berhasil:', response.data);

      const { token, user } =
        response.data;

      // simpan token
      await Storage.setItem(
        'token',
        token
      );

      // simpan user
      await Storage.setItem(
        'user',
        JSON.stringify(user)
      );

      Alert.alert(
        'Berhasil',
        'Login berhasil'
      );

      navigation.replace('Home');

    } catch (error: any) {

      console.log('❌ Login error:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        fullError: error,
      });

      const errorMessage = 
        error?.response?.data?.message ||
        error?.message ||
        'Login gagal - Periksa koneksi ke server';

      Alert.alert(
        'Error',
        errorMessage
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="#f97316"
        barStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={
          styles.container
        }
      >

        {/* HEADER */}
        <View style={styles.header}>

          <View
            style={
              styles.logoContainer
            }
          >
            <Text style={styles.logo}>
              📝
            </Text>
          </View>

          <Text style={styles.title}>
            Selamat Datang di SIPEMA
          </Text>

          <Text style={styles.subtitle}>
            Sistem Pengaduan
            Masyarakat modern untuk
            membantu warga
            menyampaikan laporan
            secara cepat dan
            transparan.
          </Text>

          {/* FITUR */}
          <View style={styles.featureBox}>

            <Text style={styles.feature}>
              ✓ Lapor kapan saja
            </Text>

            <Text style={styles.feature}>
              ✓ Monitoring realtime
            </Text>

            <Text style={styles.feature}>
              ✓ Respon cepat
            </Text>

            <Text style={styles.feature}>
              ✓ Mudah digunakan
            </Text>

          </View>
        </View>

        {/* FORM */}
        <View
          style={styles.formContainer}
        >

          <Text style={styles.formTitle}>
            Masuk Akun
          </Text>

          <Text
            style={styles.formSubtitle}
          >
            Silakan login untuk
            melanjutkan
          </Text>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* PASSWORD */}
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* BUTTON LOGIN */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text
                style={
                  styles.buttonText
                }
              >
                Masuk
              </Text>

            )}

          </TouchableOpacity>

          {/* REGISTER */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Register'
              )
            }
          >

            <Text
              style={
                styles.registerText
              }
            >
              Belum punya akun?{' '}

              <Text
                style={
                  styles.registerLink
                }
              >
                Daftar
              </Text>

            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#fff7ed',
  },

  header: {
    backgroundColor: '#f97316',
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor:
      'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  logo: {
    fontSize: 45,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },

  subtitle: {
    color:
      'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },

  featureBox: {
    gap: 12,
  },

  feature: {
    backgroundColor:
      'rgba(255,255,255,0.15)',
    color: 'white',
    padding: 14,
    borderRadius: 14,
    fontSize: 14,
  },

  formContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: -30,
    borderRadius: 25,
    padding: 25,
    elevation: 5,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },

  formSubtitle: {
    color: '#64748b',
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
    color: '#0f172a',
  },

  button: {
    backgroundColor: '#f97316',
    padding: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  registerText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },

  registerLink: {
    color: '#f97316',
    fontWeight: 'bold',
  },

});