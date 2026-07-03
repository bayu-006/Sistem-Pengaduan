import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.badge}>
          PORTAL PENGADUAN DIGITAL
        </Text>

        <Text style={styles.heroTitle}>
          📢 SIPEMA
        </Text>

        <Text style={styles.heroSubtitle}>
          Sistem Informasi Pengaduan Masyarakat modern
          untuk membantu masyarakat menyampaikan
          laporan, aspirasi, dan informasi secara cepat,
          transparan, aman, dan mudah dipantau.
        </Text>
      </View>

      {/* ABOUT */}
      <View style={styles.section}>
        <Text style={styles.label}>
          ABOUT WEBSITE
        </Text>

        <Text style={styles.sectionTitle}>
          Website Pengaduan Masyarakat Modern
        </Text>

        <Text style={styles.sectionText}>
          SIPEMA adalah platform digital yang dibuat
          untuk membantu masyarakat dalam menyampaikan
          laporan dan pengaduan secara online.
        </Text>

        <Text style={styles.sectionText}>
          Sistem ini membantu admin dan petugas dalam
          mengelola laporan dengan cepat dan transparan
          sehingga pelayanan publik menjadi lebih baik.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statText}>Akses Sistem</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>Fast</Text>
            <Text style={styles.statText}>Respon Sistem</Text>
          </View>
        </View>
      </View>

      {/* FITUR */}
      <View style={styles.featureSection}>
        <Text style={styles.labelBlue}>
          FITUR WEBSITE
        </Text>

        <Text style={styles.sectionTitleCenter}>
          Kenapa Menggunakan SIPEMA?
        </Text>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📤</Text>
          <Text style={styles.featureTitle}>
            Kirim Laporan
          </Text>
          <Text style={styles.featureText}>
            Membuat laporan masyarakat secara online
            dengan mudah dan cepat.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📸</Text>
          <Text style={styles.featureTitle}>
            Upload Bukti
          </Text>
          <Text style={styles.featureText}>
            Upload gambar atau bukti pendukung laporan.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureTitle}>
            Statistik
          </Text>
          <Text style={styles.featureText}>
            Menampilkan statistik laporan masyarakat.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>👨‍💼</Text>
          <Text style={styles.featureTitle}>
            Dashboard Admin
          </Text>
          <Text style={styles.featureText}>
            Admin dapat mengelola laporan dan user.
          </Text>
        </View>
      </View>

      {/* ATURAN */}
      <View style={styles.section}>
        <Text style={styles.label}>
          PERATURAN
        </Text>

        <Text style={styles.sectionTitle}>
          Aturan Penggunaan Aplikasi
        </Text>

        <Text style={styles.rule}>
          • Gunakan bahasa yang sopan dan jelas.
        </Text>

        <Text style={styles.rule}>
          • Dilarang membuat laporan palsu atau hoaks.
        </Text>

        <Text style={styles.rule}>
          • Upload gambar harus sesuai laporan.
        </Text>

        <Text style={styles.rule}>
          • Admin berhak menolak laporan yang melanggar aturan.
        </Text>

        <Text style={styles.rule}>
          • Semua aktivitas akan tercatat dalam sistem.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>
          📢 SIPEMA
        </Text>

        <Text style={styles.footerText}>
          Sistem Informasi Pengaduan Masyarakat digital
          untuk pelayanan publik yang lebih cepat,
          modern, aman, dan transparan.
        </Text>

        <View style={styles.footerRow}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#fff"
          />
          <Text style={styles.footerItem}>
            Jakarta Pusat, Indonesia
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#fff"
          />
          <Text style={styles.footerItem}>
            sipema24/7@gmail.com
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Ionicons
            name="call-outline"
            size={20}
            color="#fff"
          />
          <Text style={styles.footerItem}>
            (+62) 81287956785
          </Text>
        </View>

        <View style={styles.footerRow}>
          <Ionicons
            name="globe-outline"
            size={20}
            color="#fff"
          />
          <Text style={styles.footerItem}>
            www.sipema.com
          </Text>
        </View>

        <Text style={styles.footerBottom}>
          © 2026 SIPEMA — Sistem Pengaduan Masyarakat
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  hero: {
    backgroundColor: '#2563eb',
    padding: 30,
  },

  badge: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 15,
  },

  heroTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },

  heroSubtitle: {
    marginTop: 15,
    color: '#dbeafe',
    lineHeight: 24,
  },

  section: {
    padding: 20,
  },

  label: {
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  labelBlue: {
    color: '#2563eb',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  sectionTitleCenter: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
  },

  sectionText: {
    marginTop: 12,
    lineHeight: 24,
    color: '#475569',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
  },

  statText: {
    marginTop: 8,
    color: '#64748b',
  },

  featureSection: {
    backgroundColor: '#eef2ff',
    padding: 20,
  },

  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
  },

  featureIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },

  featureText: {
    marginTop: 8,
    color: '#64748b',
    lineHeight: 22,
  },

  rule: {
    marginTop: 10,
    color: '#dc2626',
    lineHeight: 24,
  },

  footer: {
    backgroundColor: '#f97316',
    padding: 25,
    marginTop: 20,
  },

  footerLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  footerText: {
    color: '#fff7ed',
    marginTop: 15,
    lineHeight: 24,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  footerItem: {
    color: '#fff',
    marginLeft: 10,
  },

  footerBottom: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    color: '#fff7ed',
    textAlign: 'center',
  },
});