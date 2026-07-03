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

import { RootStackParamList } from '../navigation/appNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function RegisterScreen({
  navigation,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        'Error',
        'Semua field wajib diisi'
      );
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      Alert.alert(
        'Berhasil',
        'Registrasi berhasil'
      );

      navigation.replace('Login');
    } catch (error: any) {
      console.log(error?.response?.data);

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Register gagal'
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
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>📝</Text>
          </View>

          <Text style={styles.title}>
            Daftar Akun Baru
          </Text>

          <Text style={styles.subtitle}>
            Bergabung dengan SIPEMA untuk
            menyampaikan laporan masyarakat
            dengan mudah dan cepat.
          </Text>

          <View style={styles.featureBox}>
            <Text style={styles.feature}>
              ✓ Registrasi mudah
            </Text>

            <Text style={styles.feature}>
              ✓ Pengaduan realtime
            </Text>

            <Text style={styles.feature}>
              ✓ Aman & terpercaya
            </Text>

            <Text style={styles.feature}>
              ✓ Gratis digunakan
            </Text>
          </View>
        </View>

        {/* FORM */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            Registrasi
          </Text>

          <Text style={styles.formSubtitle}>
            Lengkapi data di bawah ini
          </Text>

          <TextInput
            placeholder="Nama Lengkap"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                Daftar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.replace('Login')
            }
          >
            <Text style={styles.loginText}>
              Sudah punya akun?{' '}
              <Text style={styles.loginLink}>
                Login
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },

  featureBox: {
    gap: 12,
  },

  feature: {
    backgroundColor: 'rgba(255,255,255,0.15)',
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

  loginText: {
    textAlign: 'center',
    color: '#64748b',
  },

  loginLink: {
    color: '#f97316',
    fontWeight: 'bold',
  },
});