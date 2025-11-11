import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import DashboardStyles from '../styles/DashboardStyles';
import { gerarRelatorios } from '../services/storage';

const DashboardScreen = ({ navigation }) => {
  const [dados, setDados] = useState({
    totalLivros: 0,
    emprestimosAtivos: 0,
    totalAtrasados: 0,
    maisEmprestados: []
  });
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const relatorios = await gerarRelatorios();
      setDados(relatorios);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <ScrollView 
      style={DashboardStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={DashboardStyles.header}>
        <Text style={DashboardStyles.headerTitle}>BIBLIOTECA ESCOLAR</Text>
        <Text style={DashboardStyles.headerSubtitle}>
          SISTEMA DE GERENCIAMENTO
        </Text>
      </View>

      <View style={DashboardStyles.statsContainer}>
        <View style={DashboardStyles.statCard}>
          <Text style={DashboardStyles.statNumber}>{dados.totalLivros}</Text>
          <Text style={DashboardStyles.statLabel}>LIVROS DISPONÍVEIS</Text>
        </View>

        <View style={DashboardStyles.statCard}>
          <Text style={DashboardStyles.statNumber}>{dados.emprestimosAtivos}</Text>
          <Text style={DashboardStyles.statLabel}>EMPRÉSTIMOS ATIVOS</Text>
        </View>

        <View style={DashboardStyles.statCard}>
          <Text style={[DashboardStyles.statNumber, { color: '#dc3545' }]}>
            {dados.totalAtrasados}
          </Text>
          <Text style={DashboardStyles.statLabel}>ATRASADOS</Text>
        </View>
      </View>

      <View style={DashboardStyles.quickActions}>
        <Text style={DashboardStyles.quickActionsTitle}>AÇÕES RÁPIDAS</Text>
        
        <TouchableOpacity 
          style={DashboardStyles.actionButton}
          onPress={() => navigateToScreen('Livros')}
        >
          <Text style={DashboardStyles.actionButtonText}>📚 GERENCIAR LIVROS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={DashboardStyles.actionButton}
          onPress={() => navigateToScreen('Alunos')}
        >
          <Text style={DashboardStyles.actionButtonText}>👥 GERENCIAR ALUNOS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={DashboardStyles.actionButton}
          onPress={() => navigateToScreen('Emprestimos')}
        >
          <Text style={DashboardStyles.actionButtonText}>📋 EMPRÉSTIMOS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={DashboardStyles.actionButton}
          onPress={() => navigateToScreen('Relatorios')}
        >
          <Text style={DashboardStyles.actionButtonText}>📊 RELATÓRIOS</Text>
        </TouchableOpacity>
      </View>

      {dados.maisEmprestados.length > 0 && (
        <View style={DashboardStyles.quickActions}>
          <Text style={DashboardStyles.quickActionsTitle}>LIVROS MAIS EMPRESTADOS</Text>
          {dados.maisEmprestados.slice(0, 5).map(([titulo, quantidade], index) => (
            <View key={index} style={DashboardStyles.actionButton}>
              <Text style={DashboardStyles.actionButtonText}>
                {titulo} ({quantidade})
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default DashboardScreen;