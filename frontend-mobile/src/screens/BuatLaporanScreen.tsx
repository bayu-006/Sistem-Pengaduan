import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import Storage from '../utils/storage';

import API from '../api/api';

import { Picker } from '@react-native-picker/picker';

export default function CreateLaporanScreen({ navigation }: any) {
  const [title, setTitle] = useState('');

  const [description, setDescription] =
    useState('');

  const [categoryId, setCategoryId] =
    useState('');

  const [location, setLocation] =
    useState('');

  const [categories, setCategories] =
    useState<any[]>([]);

  const [image, setImage] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    const response = await API.get('/kategori');

    setCategories(response.data);
  } catch (error) {
    console.log(error);
    setError('Gagal mengambil kategori');
  }
};

  const pickImage = async () => {
  const { status } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Izin ditolak',
      'Akses galeri diperlukan'
    );
    return;
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

  if (!result.canceled) {
    console.log(
      'IMAGE PICKED:',
      result.assets[0]
    );

    setImage(result.assets[0]);
  }
};

const handleSubmit = async () => {
  if (!title || !description || !categoryId || !location) {
    Alert.alert(
      'Error',
      'Semua field wajib diisi'
    );
    return;
  }

  try {
    setLoading(true);

    const token = await Storage.getItem('token');

    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('location', location);

    if (image) {
  console.log('📸 IMAGE PICKED:', image);

  const fileName =
    image.fileName || `photo-${Date.now()}.jpg`;

  const mimeType =
    image.mimeType || 'image/jpeg';

  if (Platform.OS === 'web') {
    const response = await fetch(image.uri);
    const blob = await response.blob();

    formData.append(
      'image',
      blob,
      fileName
    );

    console.log('WEB IMAGE APPENDED');
  } else {
    formData.append('image', {
      uri: image.uri,
      name: fileName,
      type: mimeType,
    } as any);

    console.log('MOBILE IMAGE APPENDED');
  }
}
    const response = await API.post(
      '/laporan',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      }
    );

    console.log(
      'UPLOAD SUCCESS:',
      response.data
    );

    Alert.alert(
      'Berhasil',
      'Laporan berhasil dikirim'
    );

    navigation.goBack();
  } catch (err: any) {
    console.log(
      'UPLOAD ERROR:',
      err?.response?.data || err
    );

    Alert.alert(
      'Error',
      'Gagal membuat laporan'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            📝 Buat Laporan
          </Text>

          <Text style={styles.subtitle}>
            Sampaikan laporan masyarakat
            dengan jelas dan lengkap
          </Text>
        </View>
      </View>

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          📢 Pastikan laporan sesuai fakta
          dan sertakan bukti pendukung.
        </Text>
      </View>

      {/* ERROR */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      {/* FORM */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Judul Laporan
        </Text>

        <TextInput
          placeholder="Contoh: Jalan Rusak..."
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Kategori
        </Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) =>
                setCategoryId(String(itemValue))
            }
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item
              label="-- Pilih Kategori --"
              value=""
            />

            {categories.map((cat) => (
              <Picker.Item
                key={cat.id}
                label={cat.name}
                value={cat.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Lokasi
        </Text>

        <TextInput
          placeholder="Contoh: Jl. Merdeka RT 03 RW 02"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Isi Laporan
        </Text>

        <TextInput
          placeholder="Tulis detail laporan..."
          multiline
          numberOfLines={6}
          value={description}
          onChangeText={setDescription}
          style={styles.textarea}
        />
      </View>

      {/* IMAGE */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Upload Foto
        </Text>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
        >
          <Text style={styles.uploadText}>
            📷 Pilih Gambar
          </Text>

          <Text style={styles.uploadSub}>
            JPG / PNG / JPEG
          </Text>
        </TouchableOpacity>
      </View>

      {/* PREVIEW */}
      {image && (
        <Image
          source={{
            uri: image.uri,
          }}
          style={styles.previewImage}
        />
      )}

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitText}>
            🚀 Kirim Laporan
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 18,
  },

  header: {
    marginBottom: 25,
    backgroundColor: '#2563eb',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    marginTop: 10,
    color: '#dbeafe',
    lineHeight: 22,
  },

  backButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },

  backText: {
    fontWeight: 'bold',
    color: '#334155',
  },

  infoBox: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  infoText: {
    color: '#1d4ed8',
    lineHeight: 20,
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },

  errorText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },

  formGroup: {
    marginBottom: 22,
  },

  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#334155',
    fontSize: 15,
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 15,
    color: '#0f172a',
  },

  textarea: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 15,
    textAlignVertical: 'top',
    height: 140,
  },

  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
    marginTop: 4,
    minHeight: 62,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  picker: {
    height: 56,
  },

  pickerItem: {
    fontSize: 18,
    height: 56,
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },

  uploadSub: {
    marginTop: 8,
    color: '#64748b',
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    marginBottom: 25,
  },

  submitButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },

  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});