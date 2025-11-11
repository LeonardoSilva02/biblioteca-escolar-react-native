import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

// Componente do drawer lateral customizado
const CustomDrawer = ({ visible, onClose }) => {
  const navigation = useNavigation();
  
  const menuItems = [
    { key: 'Dashboard', title: '🏠 Dashboard', route: 'Dashboard' },
    { key: 'Livros', title: '📚 Livros', route: 'Livros' },
    { key: 'Alunos', title: '👥 Alunos', route: 'Alunos' },
    { key: 'Emprestimos', title: '📋 Empréstimos', route: 'Emprestimos' },
    { key: 'Relatorios', title: '📊 Relatórios', route: 'Relatorios' },
    { key: 'Logout', title: '🚪 Logout', route: 'Login' },
  ];

  const handleNavigation = (route) => {
    onClose(); // Fecha o drawer primeiro
    
    if (route === 'Login') {
      // Logout - volta para a tela de login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      // Navega para a aba específica dentro do TabNavigator
      navigation.navigate('TabNavigator', { 
        screen: route 
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayBackground} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={styles.drawerContainer}>
          <LinearGradient
            colors={['#2E8B8B', '#4A6FA5', '#6A5ACD']}
            style={styles.drawerHeader}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>📚 Biblioteca</Text>
            <Text style={styles.headerSubtitle}>Sistema Escolar</Text>
          </LinearGradient>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  item.key === 'Logout' && styles.logoutItem
                ]}
                onPress={() => handleNavigation(item.route)}
              >
                <Text style={[
                  styles.menuText,
                  item.key === 'Logout' && styles.logoutText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Versão 1.0.0</Text>
            <Text style={styles.footerText}>© 2025</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DrawerNavigator = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <TabNavigator 
        onOpenDrawer={() => setDrawerVisible(true)}
      />
      
      <CustomDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#dc2626',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});

export default DrawerNavigator;