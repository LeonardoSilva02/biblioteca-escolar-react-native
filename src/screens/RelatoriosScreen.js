import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert,
  Share,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import RelatoriosStyles from '../styles/RelatoriosStyles';
import { gerarRelatorios } from '../services/storage';

const RelatoriosScreen = () => {
  const [dados, setDados] = useState({
    totalLivros: 0,
    emprestimosAtivos: 0,
    totalAtrasados: 0,
    atrasados: [],
    maisEmprestados: []
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const carregarRelatorios = async () => {
    try {
      setLoading(true);
      const relatorios = await gerarRelatorios();
      setDados(relatorios);
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarRelatorios();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarRelatorios();
    setRefreshing(false);
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  const gerarTextoRelatorio = () => {
    let texto = `RELATÓRIO DA BIBLIOTECA ESCOLAR\n`;
    texto += `DATA: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    texto += `ESTATÍSTICAS GERAIS:\n`;
    texto += `• Total de exemplares disponíveis: ${dados.totalLivros}\n`;
    texto += `• Empréstimos ativos: ${dados.emprestimosAtivos}\n`;
    texto += `• Empréstimos atrasados: ${dados.totalAtrasados}\n\n`;
    
    if (dados.maisEmprestados.length > 0) {
      texto += `LIVROS MAIS EMPRESTADOS:\n`;
      dados.maisEmprestados.slice(0, 10).forEach(([titulo, quantidade], index) => {
        texto += `${index + 1}. ${titulo} - ${quantidade} empréstimos\n`;
      });
      texto += `\n`;
    }

    if (dados.atrasados.length > 0) {
      texto += `EMPRÉSTIMOS ATRASADOS:\n`;
      dados.atrasados.forEach(emprestimo => {
        texto += `• ${emprestimo.alunoNome} - "${emprestimo.livroTitulo}" - Vencimento: ${formatarData(emprestimo.dataVencimento)}\n`;
      });
    }

    return texto;
  };

  const exportarRelatorio = async () => {
    try {
      const textoRelatorio = gerarTextoRelatorio();
      
      await Share.share({
        message: textoRelatorio,
        title: 'Relatório da Biblioteca Escolar'
      });
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao exportar relatório');
    }
  };

  return (
    <ScrollView 
      style={RelatoriosStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={RelatoriosStyles.header}>
        <Text style={RelatoriosStyles.title}>RELATÓRIOS</Text>
        <Text style={RelatoriosStyles.subtitle}>
          ESTATÍSTICAS E ANÁLISES DA BIBLIOTECA
        </Text>
      </View>

      {/* Estatísticas Gerais */}
      <View style={RelatoriosStyles.reportCard}>
        <Text style={RelatoriosStyles.reportTitle}>ESTATÍSTICAS GERAIS</Text>
        
        <View style={RelatoriosStyles.statsGrid}>
          <View style={RelatoriosStyles.statItem}>
            <Text style={RelatoriosStyles.statNumber}>{dados.totalLivros}</Text>
            <Text style={RelatoriosStyles.statLabel}>EXEMPLARES DISPONÍVEIS</Text>
          </View>

          <View style={RelatoriosStyles.statItem}>
            <Text style={RelatoriosStyles.statNumber}>{dados.emprestimosAtivos}</Text>
            <Text style={RelatoriosStyles.statLabel}>EMPRÉSTIMOS ATIVOS</Text>
          </View>

          <View style={RelatoriosStyles.statItem}>
            <Text style={[RelatoriosStyles.statNumber, { color: '#dc3545' }]}>
              {dados.totalAtrasados}
            </Text>
            <Text style={RelatoriosStyles.statLabel}>ATRASADOS</Text>
          </View>

          <View style={RelatoriosStyles.statItem}>
            <Text style={[RelatoriosStyles.statNumber, { color: '#28a745' }]}>
              {dados.emprestimosAtivos - dados.totalAtrasados}
            </Text>
            <Text style={RelatoriosStyles.statLabel}>EM DIA</Text>
          </View>
        </View>
      </View>

      {/* Livros Mais Emprestados */}
      {dados.maisEmprestados.length > 0 && (
        <View style={RelatoriosStyles.chartContainer}>
          <Text style={RelatoriosStyles.chartTitle}>LIVROS MAIS EMPRESTADOS</Text>
          
          {dados.maisEmprestados.slice(0, 10).map(([titulo, quantidade], index) => (
            <View key={index} style={RelatoriosStyles.tableRow}>
              <Text style={[RelatoriosStyles.tableCell, { flex: 0.3, textAlign: 'left', fontWeight: 'bold' }]}>
                {index + 1}º
              </Text>
              <Text style={[RelatoriosStyles.tableCell, { flex: 2, textAlign: 'left' }]}>
                {titulo}
              </Text>
              <Text style={[RelatoriosStyles.tableCell, { flex: 0.5, color: '#007bff', fontWeight: 'bold' }]}>
                {quantidade}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Empréstimos Atrasados */}
      {dados.atrasados.length > 0 && (
        <View style={RelatoriosStyles.tableContainer}>
          <Text style={RelatoriosStyles.tableTitle}>EMPRÉSTIMOS ATRASADOS</Text>
          
          <View style={RelatoriosStyles.tableHeader}>
            <Text style={RelatoriosStyles.tableHeaderText}>ALUNO</Text>
            <Text style={RelatoriosStyles.tableHeaderText}>LIVRO</Text>
            <Text style={RelatoriosStyles.tableHeaderText}>VENCIMENTO</Text>
          </View>

          {dados.atrasados.map((emprestimo, index) => (
            <View key={index} style={RelatoriosStyles.tableRow}>
              <Text style={RelatoriosStyles.tableCell} numberOfLines={2}>
                {emprestimo.alunoNome}
              </Text>
              <Text style={RelatoriosStyles.tableCell} numberOfLines={2}>
                {emprestimo.livroTitulo}
              </Text>
              <Text style={[RelatoriosStyles.tableCell, { color: '#dc3545', fontWeight: 'bold' }]}>
                {formatarData(emprestimo.dataVencimento)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Resumo */}
      <View style={RelatoriosStyles.reportCard}>
        <Text style={RelatoriosStyles.reportTitle}>RESUMO</Text>
        
        <Text style={RelatoriosStyles.statLabel}>
          • {dados.totalLivros} exemplares disponíveis no acervo
        </Text>
        <Text style={RelatoriosStyles.statLabel}>
          • {dados.emprestimosAtivos} empréstimos ativos
        </Text>
        <Text style={RelatoriosStyles.statLabel}>
          • {dados.totalAtrasados} empréstimos em atraso
        </Text>
        {dados.emprestimosAtivos > 0 && (
          <Text style={RelatoriosStyles.statLabel}>
            • Taxa de pontualidade: {Math.round((1 - dados.totalAtrasados / dados.emprestimosAtivos) * 100)}%
          </Text>
        )}
      </View>

      {/* Botão de Exportar */}
      <Button
        title="EXPORTAR RELATÓRIO"
        variant="success"
        onPress={exportarRelatorio}
        style={RelatoriosStyles.exportButton}
        textStyle={RelatoriosStyles.exportButtonText}
      />

      <Button
        title="ATUALIZAR DADOS"
        variant="primary"
        onPress={carregarRelatorios}
        loading={loading}
        style={RelatoriosStyles.exportButton}
      />

      {/* Estado Vazio */}
      {dados.emprestimosAtivos === 0 && dados.totalLivros === 0 && !loading && (
        <View style={RelatoriosStyles.emptyState}>
          <Text style={RelatoriosStyles.emptyStateText}>
            NENHUM DADO DISPONÍVEL PARA GERAR RELATÓRIOS
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default RelatoriosScreen;