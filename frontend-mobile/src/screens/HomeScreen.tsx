import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';

import Storage from '../utils/storage';
import api from '../api/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/appNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type Laporan = {
  id: number;
  title: string;
  description: string;
  status: string;
  category_name: string;
  user_name: string;
  location?: string;
  image?: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export default function HomeScreen({ navigation }: Props) {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const onRefresh = async () => {
  setRefreshing(true);

  await getLaporan();

  setRefreshing(false);
};

  const getLaporan = async () => {
    try {
      setLoading(true);

      const token = await Storage.getItem('token');

      if (!token) {
        navigation.replace('Login');
        return;
      }

      const userData = await Storage.getItem('user');

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }

const response = await api.get('/laporan', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log(
  'DATA API:',
  JSON.stringify(response.data, null, 2)
);

      console.log('DATA API:', response.data);

      if (Array.isArray(response.data)) {
        setLaporan(response.data);
      } else if (Array.isArray(response.data.data)) {
        setLaporan(response.data.data);
      } else if (Array.isArray(response.data.laporan)) {
        setLaporan(response.data.laporan);
      } else {
        setLaporan([]);
      }
    } catch (error: any) {
      console.log('ERROR:', error?.response?.data || error);

      Alert.alert(
        'Error',
        'Gagal mengambil data laporan'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLaporan();
    });

    return unsubscribe;
  }, [navigation]);

  const stats = useMemo(() => {
    const total = laporan.length;

    const pending = laporan.filter(
      (l) => l.status === 'pending'
    ).length;

    const approved = laporan.filter(
      (l) => l.status === 'approved'
    ).length;

    const rejected = laporan.filter(
      (l) => l.status === 'rejected'
    ).length;

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, [laporan]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#16a34a';

      case 'rejected':
        return '#dc2626';

      default:
        return '#f59e0b';
    }
  };

  const renderItem = ({ item }: { item: Laporan }) => {
  console.log('ITEM IMAGE:', item.id, item.image);

  const imageUrl =
    `${String(api.defaults.baseURL).replace('/api', '')}/uploads/${item.image}`;

  console.log('IMAGE URL:', imageUrl);

  const remoteImageSource = {
    uri: imageUrl,
  };

    const imageSource =
      item.image && !failedImages[item.id]
        ? remoteImageSource
        : require('../../assets/user.png');

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() =>
          navigation.navigate('Detail', {
            id: item.id,
          })
        }
      >
        <Image
          source={imageSource}
          style={styles.image}
          onError={(e) => {
            console.log('IMAGE ERROR:', item.image, e.nativeEvent.error);
            setFailedImages((prev) => ({
              ...prev,
              [item.id]: true,
            }));
          }}
        />
        <View style={styles.reportBody}>
        <Text style={styles.reportTitle}>
          {item.title}
        </Text>

        <Text style={styles.category}>
          📂 {item.category_name}
        </Text>

        <Text style={styles.category}>
          📍 {item.location || 'Lokasi tidak tersedia'}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.user}>
            👤 {item.user_name}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: getStatusColor(item.status),
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#f97316"
        />

        <Text style={{ marginTop: 10 }}>
          Memuat data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
       <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
      {/* HEADER */}
      {/* HEADER */}
<View style={styles.header}>
  <View style={styles.headerTop}>
    <View>
      <Text style={styles.greeting}>
        Halo, {user?.name || 'User'} 👋
      </Text>

      <Text style={styles.headerTitle}>
        Selamat Datang di SIPEMA
      </Text>
    </View>

  </View>

  <Text style={styles.headerSubtitle}>
    Sistem Informasi Pengaduan Masyarakat yang membantu warga
    menyampaikan laporan secara cepat, mudah, aman, dan transparan.
  </Text>
</View>

     {/* STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {stats.total}
          </Text>

          <Text style={styles.statLabel}>
            📊 Total
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {stats.pending}
          </Text>

          <Text style={styles.statLabel}>
            ⏳ Pending
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {stats.approved}
          </Text>

          <Text style={styles.statLabel}>
            ✅ Approved
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {stats.rejected}
          </Text>

          <Text style={styles.statLabel}>
            ❌ Rejected
          </Text>
        </View>
      </View>

      {/* SECTION */}
      <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>
    📋 Laporan Terbaru
  </Text>

  <View style={{ flexDirection: 'row' }}>

    <TouchableOpacity
      style={styles.createButton}
      onPress={() =>
        navigation.navigate('CreateLaporan')
      }
    >
      <Text style={styles.createButtonText}>
        + Buat
      </Text>
    </TouchableOpacity>
  </View>
</View>
      {/* LIST */}
      <FlatList
      data={laporan.slice(0, 6)}
      keyExtractor={(item: Laporan) => item.id.toString()}
      renderItem={renderItem}
      scrollEnabled={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada laporan
            </Text>
          </View>
        }
      />
      <TouchableOpacity
      style={styles.seeAllButton}
      onPress={() => navigation.navigate('SemuaLaporan') }
    >
      <Text style={styles.seeAllText}>
        Lihat Semua Laporan →
      </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
  backgroundColor: '#f97316',
  marginHorizontal: 10,
  marginTop: 10,
  marginBottom: 10,
  padding: 30,
  borderRadius: 20,
},

  headerTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
},

  headerSubtitle: {
  marginTop: 6,
  fontSize: 14,
  color: 'rgba(255,255,255,0.9)',
},

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },

    headerTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

seeAllButton: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#f97316',
  paddingVertical: 15,
  borderRadius: 14,
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 25,
  marginHorizontal: 10,
},

seeAllText: {
  color: '#f97316',
  fontWeight: 'bold',
  fontSize: 16,
},

greeting: {
  fontSize: 26,
  color: 'rgba(255,255,255,0.95)',
  fontWeight: 'bold',
  marginBottom: 4,
},

  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,

    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(0,0,0,0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      },
    }),
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea580c',
  },

  statLabel: {
    marginTop: 8,
    color: '#64748b',
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  createButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  reportCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,

    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 5px rgba(0,0,0,0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      },
    }),
  },

  image: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },

  reportBody: {
    padding: 16,
  },

  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ea580c',
    marginBottom: 8,
  },

  category: {
    color: '#64748b',
    marginBottom: 10,
    fontSize: 13,
  },

  description: {
    color: '#334155',
    lineHeight: 20,
  },

  footer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  user: {
    color: '#64748b',
    fontSize: 12,
  },

  status: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
}
);