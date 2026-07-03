import React, { useEffect } from 'react';
import Storage from '../utils/storage';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/appNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
};

const ORANGE = '#ff7a00';

export default function LandingScreen({ navigation }: Props) {

  useEffect(() => {
  checkLogin();
}, []);

const checkLogin = async () => {
  try {
    const token = await Storage.getItem('token');

    console.log('TOKEN:', token);

    if (token) {
      navigation.replace('Home');
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>S</Text>
            </View>

            <Text style={styles.brand}>SIPEMA</Text>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.welcome}>Welcome To SIPEMA</Text>

          <Text style={styles.title}>
            Online Public Complaint Services
          </Text>

          <Text style={styles.description}>
            SIPEMA membantu masyarakat menyampaikan laporan dengan cepat,
            aman, dan transparan menggunakan sistem digital modern.
          </Text>

          <View style={styles.heroIcon}>
            <Text style={{ fontSize: 90 }}>💻</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Masuk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {/* SERVICES */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Our Services</Text>

          <Text style={styles.sectionTitle}>
            We Provide The Best Services
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>Quick Report</Text>
            <Text style={styles.cardDesc}>
              Buat laporan dengan cepat dan mudah.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>📸</Text>
            <Text style={styles.cardTitle}>Upload Evidence</Text>
            <Text style={styles.cardDesc}>
              Tambahkan bukti foto dan dokumen.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>Real Monitoring</Text>
            <Text style={styles.cardDesc}>
              Pantau status laporan secara realtime.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>💬</Text>
            <Text style={styles.cardTitle}>Discussion</Text>
            <Text style={styles.cardDesc}>
              Diskusi dan dukungan masyarakat.
            </Text>
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionLabel}>About Us</Text>

          <Text style={styles.sectionTitle}>
            Simple Solutions!
          </Text>

          <Text style={styles.description}>
            SIPEMA hadir sebagai solusi modern untuk membantu masyarakat
            melaporkan masalah lingkungan, fasilitas umum, dan pelayanan
            dengan lebih efektif.
          </Text>

          <View style={styles.aboutItem}>
            <Text>📞 Contact Center</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text>💬 Chat Discussion</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text>📍 Tracking Laporan</Text>
          </View>

          <View style={styles.aboutItem}>
            <Text>🛡️ Respon Cepat</Text>
          </View>
        </View>
          <View style={{ marginTop: 20 }}>
      <TouchableOpacity
        style={styles.aboutButton}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.aboutButtonText}>
          About Us
        </Text>
      </TouchableOpacity>
    </View>

        {/* STATS */}
        <View style={styles.section}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statNumber}>40+</Text>
            <Text>Total Laporan</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNumber}>35+</Text>
            <Text>Laporan Selesai</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>50+</Text>
            <Text>Pengguna Aktif</Text>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>
            Ready To Get Started?
          </Text>

          <Text style={styles.ctaText}>
            Bergabung bersama SIPEMA dan bantu menciptakan lingkungan
            yang lebih baik melalui teknologi digital.
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <View style={styles.footerLogo}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                S
              </Text>
            </View>

            <Text style={styles.footerTitle}>SIPEMA</Text>
          </View>

          <Text style={styles.footerDescription}>
            Sistem Pengaduan Masyarakat modern untuk membantu warga
            menyampaikan aspirasi dengan cepat, transparan, dan akuntabel.
          </Text>

          <View style={styles.footerMenu}>
            <Text style={styles.footerHeading}>Menu</Text>
            <Text style={styles.footerItem}>Beranda</Text>
            <Text style={styles.footerItem}>Laporan</Text>
            <Text style={styles.footerItem}>Tentang</Text>
          </View>

          <View style={styles.footerMenu}>
            <Text style={styles.footerHeading}>Kontak</Text>
            <Text style={styles.footerItem}>
              📧 sipema24/7@gmail.com
            </Text>
            <Text style={styles.footerItem}>
              📞 (021) 1234 5678
            </Text>
            <Text style={styles.footerItem}>
              🏢 Jakarta Pusat, Indonesia
            </Text>
          </View>

          <Text style={styles.copyright}>
            © 2024-2026 SIPEMA - Sistem Pengaduan Masyarakat
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf7',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerButtons: {
    flexDirection: 'row',
  },

  logoBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },

  brand: {
    marginLeft: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },

  loginBtn: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  loginText: {
    color: ORANGE,
    fontWeight: 'bold',
  },

  registerBtn: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },

  registerText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  hero: {
    padding: 20,
  },

  welcome: {
    color: ORANGE,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10,
  },

  description: {
    color: '#666',
    lineHeight: 22,
    marginTop: 15,
  },

  aboutButton: {
    backgroundColor: '#ff7a00',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 20,
    marginBottom: 20,
  },

aboutButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

  heroIcon: {
    alignItems: 'center',
    marginVertical: 30,
  },

  primaryButton: {
    backgroundColor: ORANGE,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: ORANGE,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: ORANGE,
    fontWeight: 'bold',
  },

  section: {
    padding: 20,
  },

  sectionLabel: {
    color: ORANGE,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  sectionTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 3,
  },

  cardIcon: {
    fontSize: 32,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },

  cardDesc: {
    color: '#666',
    marginTop: 8,
  },

  aboutSection: {
    padding: 10,
    backgroundColor: '#fff4ec',
  },

  aboutItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },

  statCard: {
    backgroundColor: '#fff7f1',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },

  statIcon: {
    fontSize: 40,
  },

  statNumber: {
    fontSize: 36,
    color: ORANGE,
    fontWeight: 'bold',
  },

  cta: {
    backgroundColor: ORANGE,
    padding: 30,
    alignItems: 'center',
  },

  ctaTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  ctaText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
  },

  ctaButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 14,
  },

  ctaButtonText: {
    color: ORANGE,
    fontWeight: 'bold',
  },

  footer: {
    backgroundColor: '#fff',
    padding: 25,
  },

  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  footerLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerTitle: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },

  footerDescription: {
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },

  footerMenu: {
    marginBottom: 20,
  },

  footerHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  footerItem: {
    color: '#666',
    marginBottom: 8,
  },

  copyright: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
});
