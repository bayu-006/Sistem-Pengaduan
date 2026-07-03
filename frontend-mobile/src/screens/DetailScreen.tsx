import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Storage from '../utils/storage';
import api from '../api/api';

type Props = {
  route: any;
};

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;

  const [laporan, setLaporan] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const getDetail = async () => {
    try {
      const token = await Storage.getItem('token');

      const response = await api.get(`/laporan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLaporan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const token = await Storage.getItem('token');

      let response;

      try {
        response = await api.get(`/comments/laporan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        response = await api.get(`/komentar/laporan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setComments(response.data);
    } catch (error) {
      console.log(error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const sendComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSending(true);

      const token = await Storage.getItem('token');

      try {
        await api.post(
          '/comments',
          {
            laporan_id: id,
            comment: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch {
        await api.post(
          '/komentar',
          {
            laporan_id: id,
            komentar: newComment,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setNewComment('');
      getComments();

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal mengirim komentar');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    getDetail();
    getComments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#16a34a';

      case 'rejected':
        return '#dc2626';

      default:
        return '#ea580c';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Disetujui';

      case 'rejected':
        return 'Ditolak';

      default:
        return 'Menunggu';
    }
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

  if (!laporan) {
    return (
      <View style={styles.center}>
        <Text>Laporan tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {laporan.image && (
        <Image
          source={{
            uri: (() => {
              const base = String(api.defaults.baseURL || '').replace(/\/?api\/?$/i, '').replace(/\/$/, '');
              return `${base}/uploads/${laporan.image}?id=${laporan.id}`;
            })(),
          }}
          style={styles.image}
        />
      )}

      <View style={styles.card}>

        <Text style={styles.title}>
          {laporan.title}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                getStatusColor(laporan.status),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(laporan.status)}
          </Text>
        </View>

        <Text style={styles.info}>
          📂 {laporan.category_name}
        </Text>

        <Text style={styles.info}>
          � {laporan.location || 'Lokasi tidak tersedia'}
        </Text>

        <Text style={styles.info}>
          �👤 {laporan.user_name}
        </Text>

        <Text style={styles.info}>
          📅{' '}
          {new Date(
            laporan.created_at
          ).toLocaleDateString('id-ID')}
        </Text>

        <Text style={styles.sectionTitle}>
          Deskripsi Laporan
        </Text>

        <Text style={styles.description}>
          {laporan.description}
        </Text>
      </View>

      <View style={styles.commentCard}>
        <Text style={styles.commentTitle}>
          💬 Komentar ({comments.length})
        </Text>

        <TextInput
          placeholder="Tulis komentar..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={sendComment}
          disabled={sending}
        >
          <Text style={styles.buttonText}>
            {sending
              ? 'Mengirim...'
              : 'Kirim Komentar'}
          </Text>
        </TouchableOpacity>

        {comments.map((item, index) => {
          const text =
            item.comment ||
            item.komentar ||
            '';

          const user =
            item.user_name ||
            item.nama_user ||
            'User';

          const isSystem =
            user === 'System | Admin' ||
            text.includes(
              'ADMIN mengubah status'
            );

          return (
            <View
              key={index}
              style={[
                styles.commentBox,
                isSystem &&
                  styles.systemComment,
              ]}
            >
              <Text style={styles.commentUser}>
                {isSystem
                  ? '🔔 '
                  : '💬 '}
                {user}
              </Text>

              <Text
                style={styles.commentText}
              >
                {text}
              </Text>

              <Text style={styles.commentDate}>
                {new Date(
                  item.created_at
                ).toLocaleString('id-ID')}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff7ed',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: 250,
  },

  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },

  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },

  info: {
    color: '#64748b',
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  description: {
    lineHeight: 24,
    color: '#334155',
  },

  commentCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  commentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    minHeight: 100,
    padding: 12,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#f97316',
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  commentBox: {
    marginTop: 15,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
  },

  systemComment: {
    backgroundColor: '#fef3c7',
  },

  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  commentText: {
    color: '#334155',
  },

  commentDate: {
    marginTop: 8,
    fontSize: 12,
    color: '#94a3b8',
  },
});