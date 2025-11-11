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
import Input from '../components/Input';
import Button from '../components/Button';
import CardAluno from '../components/CardAluno';
import AlunosStyles from '../styles/AlunosStyles';
import { 
  obterAlunos, 
  adicionarAluno, 
  editarAluno, 
  excluirAluno,
  obterEmprestimos
} from '../services/storage';

const AlunosScreen = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [alunosCarregados, emprestimosCarregados] = await Promise.all([
        obterAlunos(),
        obterEmprestimos()
      ]);
      
      setAlunos(alunosCarregados);
      setEmprestimos(emprestimosCarregados);
      aplicarFiltros(alunosCarregados, termoBusca);
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (alunosLista, termo) => {
    let alunosFiltrados = [...alunosLista];

    if (termo.trim()) {
      alunosFiltrados = alunosLista.filter(a => 
        a.nome.includes(termo.toUpperCase()) || 
        a.matricula.includes(termo.toUpperCase())
      );
    }

    setAlunosFiltrados(alunosFiltrados);
  };

  const contarEmprestimosAtivos = (alunoId) => {
    return emprestimos.filter(e => e.alunoId === alunoId).length;
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  React.useEffect(() => {
    aplicarFiltros(alunos, termoBusca);
  }, [termoBusca, alunos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const limparFormulario = () => {
    setNome('');
    setMatricula('');
    setAlunoEditando(null);
  };

  const abrirModal = (aluno = null) => {
    if (aluno) {
      setAlunoEditando(aluno);
      setNome(aluno.nome);
      setMatricula(aluno.matricula);
    } else {
      limparFormulario();
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    limparFormulario();
  };

  const salvarAluno = async () => {
    if (!nome.trim() || !matricula.trim()) {
      Alert.alert('ERRO', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    try {
      setLoading(true);
      let resultado;

      if (alunoEditando) {
        resultado = await editarAluno(alunoEditando.id, nome, matricula);
      } else {
        resultado = await adicionarAluno(nome, matricula);
      }

      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        fecharModal();
        await carregarDados();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao salvar aluno');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (aluno) => {
    const emprestimosAtivos = contarEmprestimosAtivos(aluno.id);
    
    let mensagem = `Deseja excluir o aluno "${aluno.nome}"?`;
    if (emprestimosAtivos > 0) {
      mensagem += `\n\nATENÇÃO: Este aluno possui ${emprestimosAtivos} empréstimo(s) ativo(s) que também serão excluídos!`;
    }

    Alert.alert(
      'CONFIRMAR EXCLUSÃO',
      mensagem,
      [
        { text: 'CANCELAR', style: 'cancel' },
        { text: 'EXCLUIR', style: 'destructive', onPress: () => excluirAlunoHandler(aluno) }
      ]
    );
  };

  const excluirAlunoHandler = async (aluno) => {
    try {
      setLoading(true);
      const resultado = await excluirAluno(aluno.id);
      
      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        await carregarDados();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao excluir aluno');
    } finally {
      setLoading(false);
    }
  };

  const renderAluno = ({ item }) => (
    <CardAluno
      aluno={item}
      emprestimosAtivos={contarEmprestimosAtivos(item.id)}
      onEdit={abrirModal}
      onDelete={confirmarExclusao}
    />
  );

  return (
    <View style={AlunosStyles.container}>
      {/* Header */}
      <View style={AlunosStyles.header}>
        <Text style={AlunosStyles.title}>ALUNOS</Text>
        <Button
          title="ADICIONAR"
          variant="success"
          size="small"
          onPress={() => abrirModal()}
          style={AlunosStyles.addButton}
          textStyle={AlunosStyles.addButtonText}
        />
      </View>

      {/* Busca */}
      <View style={AlunosStyles.searchContainer}>
        <Input
          value={termoBusca}
          onChangeText={setTermoBusca}
          placeholder="BUSCAR POR NOME OU MATRÍCULA..."
          style={AlunosStyles.searchInput}
        />
      </View>

      {/* Lista de Alunos */}
      <FlatList
        data={alunosFiltrados}
        renderItem={renderAluno}
        keyExtractor={(item) => item.id}
        style={AlunosStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={AlunosStyles.emptyState}>
            <Text style={AlunosStyles.emptyStateText}>
              {termoBusca ? 'NENHUM ALUNO ENCONTRADO' : 'NENHUM ALUNO CADASTRADO'}
            </Text>
          </View>
        }
      />

      {/* Modal de Cadastro/Edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={AlunosStyles.modalContainer}>
          <View style={AlunosStyles.modalContent}>
            <Text style={AlunosStyles.modalTitle}>
              {alunoEditando ? 'EDITAR ALUNO' : 'ADICIONAR ALUNO'}
            </Text>

            <Input
              label="NOME COMPLETO"
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome completo do aluno"
              autoCapitalize="characters"
            />

            <Input
              label="MATRÍCULA"
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Digite a matrícula do aluno"
              autoCapitalize="characters"
            />

            <View style={AlunosStyles.modalButtons}>
              <Button
                title="CANCELAR"
                variant="secondary"
                onPress={fecharModal}
                style={AlunosStyles.modalButton}
              />
              <Button
                title="SALVAR"
                variant="success"
                onPress={salvarAluno}
                loading={loading}
                style={AlunosStyles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlunosScreen;