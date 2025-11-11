import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, TouchableOpacity, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LivrosScreen from '../screens/LivrosScreen';
import AlunosScreen from '../screens/AlunosScreen';
import EmprestimosScreen from '../screens/EmprestimosScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ onOpenDrawer }) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'SAIR',
      'Deseja sair do sistema?',
      [
        { text: 'CANCELAR', style: 'cancel' },
        { 
          text: 'SAIR', 
          style: 'destructive', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = '🏠';
              break;
            case 'Livros':
              iconName = '📚';
              break;
            case 'Alunos':
              iconName = '👥';
              break;
            case 'Emprestimos':
              iconName = '📋';
              break;
            case 'Relatorios':
              iconName = '📊';
              break;
            default:
              iconName = '📱';
          }

          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 15, padding: 5 }}
            onPress={onOpenDrawer}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>☰</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15, padding: 5 }}
            onPress={handleLogout}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>SAIR</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'INÍCIO',
          headerTitle: 'BIBLIOTECA ESCOLAR'
        }}
      />
      <Tab.Screen 
        name="Livros" 
        component={LivrosScreen}
        options={{
          title: 'LIVROS',
          headerTitle: 'GERENCIAR LIVROS'
        }}
      />
      <Tab.Screen 
        name="Alunos" 
        component={AlunosScreen}
        options={{
          title: 'ALUNOS',
          headerTitle: 'GERENCIAR ALUNOS'
        }}
      />
      <Tab.Screen 
        name="Emprestimos" 
        component={EmprestimosScreen}
        options={{
          title: 'EMPRÉSTIMOS',
          headerTitle: 'EMPRÉSTIMOS'
        }}
      />
      <Tab.Screen 
        name="Relatorios" 
        component={RelatoriosScreen}
        options={{
          title: 'RELATÓRIOS',
          headerTitle: 'RELATÓRIOS'
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;