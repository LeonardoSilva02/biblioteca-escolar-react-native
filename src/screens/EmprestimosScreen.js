import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Alert, 
  Modal, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Input from '../components/Input';
import Button from '../components/Button';
import EmprestimosStyles from '../styles/EmprestimosStyles';
import { 
  obterEmprestimos,
  obterAlunos,
  obterLivros,
  emprestar,
  devolver,
  DEFAULT_DIAS
} from '../services/storage';

const EmprestimosScreen = () => {
  const [emprestimos, setEmprestimos] = useState([]);
  const [emprestimosFiltrados, setEmprestimosFiltrados] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Campos do formulário
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [livroSelecionado, setLivroSelecionado] = useState('');
  const [diasEmprestimo, setDiasEmprestimo] = useState(DEFAULT_DIAS.toString());

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [emprestimosCarregados, alunosCarregados, livrosCarregados] = await Promise.all([
        obterEmprestimos(),
        obterAlunos(),
        obterLivros()
      ]);
      
      setEmprestimos(emprestimosCarregados);
      setAlunos(alunosCarregados);
      setLivros(livrosCarregados);
      aplicarFiltros(emprestimosCarregados, termoBusca, filtroStatus);
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (emprestimosLista, termo, status) => {
    let emprestimosFiltrados = [...emprestimosLista];

    // Filtro por termo de busca
    if (termo.trim()) {
      const termoUpper = termo.toUpperCase();
      emprestimosFiltrados = emprestimosLista.filter(e => 
        e.alunoNome.includes(termoUpper) || 
        e.alunoMatricula.includes(termoUpper) ||
        e.livroTitulo.includes(termoUpper) ||
        e.livroIsbn.includes(termoUpper)
      );
    }

    // Filtro por status
    const hoje = new Date().toISOString().split('T')[0];
    if (status === 'ATIVO') {
      emprestimosFiltrados = emprestimosFiltrados.filter(e => e.dataVencimento >= hoje);
    } else if (status === 'ATRASADO') {
      emprestimosFiltrados = emprestimosFiltrados.filter(e => e.dataVencimento < hoje);
    }

    setEmprestimosFiltrados(emprestimosFiltrados);
  };

  const getStatusEmprestimo = (dataVencimento) => {
    const hoje = new Date().toISOString().split('T')[0];
    return dataVencimento < hoje ? 'ATRASADO' : 'ATIVO';
  };

  const getStatusStyle = (status) => {
    return status === 'ATRASADO' ? EmprestimosStyles.statusOverdue : EmprestimosStyles.statusActive;
  };

  const getStatusTextStyle = (status) => {
    return status === 'ATRASADO' ? EmprestimosStyles.statusTextOverdue : EmprestimosStyles.statusTextActive;
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  React.useEffect(() => {
    aplicarFiltros(emprestimos, termoBusca, filtroStatus);
  }, [termoBusca, filtroStatus, emprestimos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const limparFormulario = () => {
    setAlunoSelecionado('');
    setLivroSelecionado('');
    setDiasEmprestimo(DEFAULT_DIAS.toString());
  };

  const abrirModal = () => {
    limparFormulario();
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    limparFormulario();
  };

  const realizarEmprestimo = async () => {
    if (!alunoSelecionado || !livroSelecionado) {
      Alert.alert('ERRO', 'SELECIONE UM ALUNO E UM LIVRO');
      return;
    }

    const dias = parseInt(diasEmprestimo) || DEFAULT_DIAS;

    try {
      setLoading(true);
      const resultado = await emprestar(alunoSelecionado, livroSelecionado, dias);
      
      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        fecharModal();
        await carregarDados();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao realizar empréstimo');
    } finally {
      setLoading(false);
    }
  };

  const confirmarDevolucao = (emprestimo) => {
    Alert.alert(
      'CONFIRMAR DEVOLUÇÃO',
      `Confirmar devolução do livro "${emprestimo.livroTitulo}" pelo aluno "${emprestimo.alunoNome}"?`,
      [
        { text: 'CANCELAR', style: 'cancel' },
        { text: 'DEVOLVER', onPress: () => realizarDevolucao(emprestimo) }
      ]
    );
  };

  const realizarDevolucao = async (emprestimo) => {
    try {
      setLoading(true);
      const resultado = await devolver(emprestimo.id);
      
      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        await carregarDados();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao realizar devolução');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
  };

  const renderEmprestimo = ({ item }) => {
    const status = getStatusEmprestimo(item.dataVencimento);
    
    return (
      <View style={EmprestimosStyles.loanCard}>
        <View style={EmprestimosStyles.loanHeader}>
          <Text style={EmprestimosStyles.loanId}>ID: {item.id}</Text>
          <View style={[EmprestimosStyles.statusBadge, getStatusStyle(status)]}>
            <Text style={[EmprestimosStyles.statusText, getStatusTextStyle(status)]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={EmprestimosStyles.loanInfo}>
          <Text style={EmprestimosStyles.studentName}>{item.alunoNome}</Text>
          <Text style={EmprestimosStyles.bookTitle}>📚 {item.livroTitulo}</Text>
          
          <View style={EmprestimosStyles.loanDates}>
            <Text style={EmprestimosStyles.dateText}>
              Empréstimo: {formatarData(item.dataEmprestimo)}
            </Text>
            <Text style={[
              EmprestimosStyles.dateText,
              status === 'ATRASADO' && EmprestimosStyles.overdueText
            ]}>
              Vencimento: {formatarData(item.dataVencimento)}
            </Text>
          </View>
        </View>

        <View style={EmprestimosStyles.loanActions}>
          <Button
            title="DEVOLVER"
            variant="success"
            size="small"
            onPress={() => confirmarDevolucao(item)}
            style={EmprestimosStyles.actionButton}
          />
        </View>
      </View>
    );
  };

  const livrosDisponiveis = livros.filter(l => l.quantidade > 0);

  return (
    <View style={EmprestimosStyles.container}>
      {/* Header */}
      <View style={EmprestimosStyles.header}>
        <Text style={EmprestimosStyles.title}>EMPRÉSTIMOS</Text>
        <Button
          title="EMPRESTAR"
          variant="success"
          size="small"
          onPress={abrirModal}
          style={EmprestimosStyles.addButton}
        />
      </View>

      {/* Busca */}
      <View style={EmprestimosStyles.searchContainer}>
        <Input
          value={termoBusca}
          onChangeText={setTermoBusca}
          placeholder="BUSCAR POR ALUNO, LIVRO OU ISBN..."
          style={EmprestimosStyles.searchInput}
        />
      </View>

      {/* Filtros */}
      <View style={EmprestimosStyles.filterContainer}>
        <Button
          title="TODOS"
          variant={filtroStatus === 'TODOS' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setFiltroStatus('TODOS')}
          style={EmprestimosStyles.filterButton}
        />
        <Button
          title="ATIVOS"
          variant={filtroStatus === 'ATIVO' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setFiltroStatus('ATIVO')}
          style={EmprestimosStyles.filterButton}
        />
        <Button
          title="ATRASADOS"
          variant={filtroStatus === 'ATRASADO' ? 'primary' : 'outline'}
          size="small"
          onPress={() => setFiltroStatus('ATRASADO')}
          style={EmprestimosStyles.filterButton}
        />
      </View>

      {/* Lista de Empréstimos */}
      <FlatList
        data={emprestimosFiltrados}
        renderItem={renderEmprestimo}
        keyExtractor={(item) => item.id}
        style={EmprestimosStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={EmprestimosStyles.emptyState}>
            <Text style={EmprestimosStyles.emptyStateText}>
              {termoBusca ? 'NENHUM EMPRÉSTIMO ENCONTRADO' : 'NENHUM EMPRÉSTIMO ATIVO'}
            </Text>
          </View>
        }
      />

      {/* Modal de Empréstimo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={EmprestimosStyles.modalContainer}>
          <View style={EmprestimosStyles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={EmprestimosStyles.modalTitle}>NOVO EMPRÉSTIMO</Text>

              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' }}>
                SELECIONE O ALUNO
              </Text>
              <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 }}>
                <Picker
                  selectedValue={alunoSelecionado}
                  onValueChange={setAlunoSelecionado}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="SELECIONE UM ALUNO" value="" />
                  {alunos.map(aluno => (
                    <Picker.Item 
                      key={aluno.id} 
                      label={`${aluno.nome} (${aluno.matricula})`} 
                      value={aluno.id} 
                    />
                  ))}
                </Picker>
              </View>

              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' }}>
                SELECIONE O LIVRO
              </Text>
              <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15 }}>
                <Picker
                  selectedValue={livroSelecionado}
                  onValueChange={setLivroSelecionado}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="SELECIONE UM LIVRO" value="" />
                  {livrosDisponiveis.map(livro => (
                    <Picker.Item 
                      key={livro.id} 
                      label={`${livro.titulo} (Disp: ${livro.quantidade})`} 
                      value={livro.id} 
                    />
                  ))}
                </Picker>
              </View>

              <Input
                label="DIAS DE EMPRÉSTIMO"
                value={diasEmprestimo}
                onChangeText={setDiasEmprestimo}
                placeholder={`Padrão: ${DEFAULT_DIAS} dias`}
                keyboardType="numeric"
              />

              <View style={EmprestimosStyles.modalButtons}>
                <Button
                  title="CANCELAR"
                  variant="secondary"
                  onPress={fecharModal}
                  style={EmprestimosStyles.modalButton}
                />
                <Button
                  title="EMPRESTAR"
                  variant="success"
                  onPress={realizarEmprestimo}
                  loading={loading}
                  style={EmprestimosStyles.modalButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmprestimosScreen;