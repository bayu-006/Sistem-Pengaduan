import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import api from '../api/api';
import Storage from '../utils/storage';

export default function SemuaLaporanScreen({ navigation }: any) {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const getData = async () => {
    try {
      const token = await Storage.getItem('token');

      const res = await api.get('/laporan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLaporan(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filtered = useMemo(() => {
    return laporan
      .filter((item: any) => {
        if (filter === 'all') return true;
        return item.status === filter;
      })
      .filter((item: any) =>
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [laporan, search, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#22c55e';

      case 'rejected':
        return '#ef4444';

      default:
        return '#f59e0b';
    }
  };

  const renderItem = ({ item }: any) => {
    const imageUrl =
      `${String(api.defaults.baseURL).replace('/api', '')}/uploads/${item.image}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Detail', {
            id: item.id,
          })
        }
      >
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.image}
        />

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.title}>
              {item.title}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    getStatusColor(item.status),
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.status}
              </Text>
            </View>
          </View>

          <Text
            numberOfLines={2}
            style={styles.desc}
          >
            {item.description}
          </Text>

          <Text style={styles.meta}>
            📍 {item.location}
          </Text>

          <Text style={styles.meta}>
            👤 {item.user_name}
          </Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              navigation.navigate('Detail', {
                id: item.id,
              })
            }
          >
            <Text style={styles.detailText}>
              Lihat Detail
            </Text>
          </TouchableOpacity>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Cari laporan..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <View style={styles.filterRow}>
        {['all', 'pending', 'approved', 'rejected'].map(
          (item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterButton,
                filter === item &&
                  styles.activeFilter,
              ]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={{
                  color:
                    filter === item
                      ? '#fff'
                      : '#334155',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item: any) =>
          item.id.toString()
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              getData();
            }}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },

  filterRow: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeFilter: {
    backgroundColor: '#f97316',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 15,
  },

  image: {
    width: '100%',
    height: 180,
  },

  body: {
    padding: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
  },

  desc: {
    marginTop: 10,
    color: '#64748b',
  },

  meta: {
    marginTop: 8,
    color: '#475569',
  },

  detailButton: {
    marginTop: 15,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  detailText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});