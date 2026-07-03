import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Storage from '../utils/storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfileScreen({
  navigation,
}: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await Storage.removeItem('token');
      await Storage.removeItem('user');

      navigation.replace('Login');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await Storage.getItem('user');

        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#f97316"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || 'Unknown User'}
        </Text>

        <Text style={styles.email}>
          {user?.email || '-'}
        </Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role || 'User'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Informasi Akun
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Nama Lengkap
        </Text>
        <Text style={styles.value}>
          {user?.name || '-'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Email
        </Text>
        <Text style={styles.value}>
          {user?.email || '-'}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Role
        </Text>
        <Text style={styles.value}>
          {user?.role || '-'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Log out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#f97316',
    margin: 15,
    borderRadius: 24,
    paddingVertical: 30,
    alignItems: 'center',
    elevation: 5,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f97316',
  },

  name: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  email: {
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },

  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 15,
  },

  roleText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginHorizontal: 15,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 18,
    borderRadius: 16,
    elevation: 2,
  },

  label: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },

  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f97316',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  logoutText: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: 'bold',
  },
});