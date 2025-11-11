import React, { useState, useEffect } from 'react';
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
import CardLivro from '../components/CardLivro';
import LivrosStyles from '../styles/LivrosStyles';
import { 
  obterLivros, 
  adicionarLivro, 
  editarLivro, 
  excluirLivro, 
  buscarLivros 
} from '../services/storage';

const LivrosScreen = () => {
  const [livros, setLivros] = useState([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [livroEditando, setLivroEditando] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Campos do formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const carregarLivros = async () => {
    try {
      setLoading(true);
      const livrosCarregados = await obterLivros();
      setLivros(livrosCarregados);
      aplicarFiltros(livrosCarregados, termoBusca, filtroStatus);
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (livrosLista, termo, status) => {
    let livrosFiltrados = [...livrosLista];

    // Filtro por termo de busca
    if (termo.trim()) {
      const resultados = livrosLista.filter(l => 
        l.titulo.includes(termo.toUpperCase()) || 
        l.autor.includes(termo.toUpperCase()) || 
        l.isbn.includes(termo.toUpperCase())
      );
      livrosFiltrados = resultados;
    }

    // Filtro por status
    if (status === 'DISPONIVEL') {
      livrosFiltrados = livrosFiltrados.filter(l => l.quantidade > 0);
    } else if (status === 'INDISPONIVEL') {
      livrosFiltrados = livrosFiltrados.filter(l => l.quantidade === 0);
    }

    setLivrosFiltrados(livrosFiltrados);
  };

  const buscarLivrosHandler = async () => {
    if (!termoBusca.trim()) {
      aplicarFiltros(livros, '', filtroStatus);
      return;
    }

    try {
      aplicarFiltros(livros, termoBusca, filtroStatus);
    } catch (error) {
      Alert.alert('ERRO', 'Erro na busca');
    }
  };

  const alterarFiltroStatus = (novoStatus) => {
    setFiltroStatus(novoStatus);
    aplicarFiltros(livros, termoBusca, novoStatus);
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarLivros();
    }, [])
  );

  useEffect(() => {
    buscarLivrosHandler();
  }, [termoBusca]);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarLivros();
    setRefreshing(false);
  };

  const limparFormulario = () => {
    setTitulo('');
    setAutor('');
    setIsbn('');
    setQuantidade('');
    setLivroEditando(null);
  };

  const abrirModal = (livro = null) => {
    if (livro) {
      setLivroEditando(livro);
      setTitulo(livro.titulo);
      setAutor(livro.autor);
      setIsbn(livro.isbn);
      setQuantidade(livro.quantidade.toString());
    } else {
      limparFormulario();
    }
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    limparFormulario();
  };

  const salvarLivro = async () => {
    if (!titulo.trim() || !autor.trim() || !isbn.trim() || !quantidade.trim()) {
      Alert.alert('ERRO', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    try {
      setLoading(true);
      let resultado;

      if (livroEditando) {
        resultado = await editarLivro(livroEditando.id, titulo, autor, isbn, quantidade);
      } else {
        resultado = await adicionarLivro(titulo, autor, isbn, quantidade);
      }

      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        fecharModal();
        await carregarLivros();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao salvar livro');
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (livro) => {
    Alert.alert(
      'CONFIRMAR EXCLUSÃO',
      `Deseja excluir o livro "${livro.titulo}"?`,
      [
        { text: 'CANCELAR', style: 'cancel' },
        { text: 'EXCLUIR', style: 'destructive', onPress: () => excluirLivroHandler(livro) }
      ]
    );
  };

  const excluirLivroHandler = async (livro) => {
    try {
      setLoading(true);
      const resultado = await excluirLivro(livro.id);
      
      if (resultado.sucesso) {
        Alert.alert('SUCESSO', resultado.mensagem);
        await carregarLivros();
      } else {
        Alert.alert('ERRO', resultado.mensagem);
      }
    } catch (error) {
      Alert.alert('ERRO', 'Erro ao excluir livro');
    } finally {
      setLoading(false);
    }
  };

  const renderLivro = ({ item }) => (
    <CardLivro
      livro={item}
      onEdit={abrirModal}
      onDelete={confirmarExclusao}
    />
  );

  return (
    <View style={LivrosStyles.container}>
      {/* Header */}
      <View style={LivrosStyles.header}>
        <Text style={LivrosStyles.title}>LIVROS</Text>
        <Button
          title="ADICIONAR"
          variant="success"
          size="small"
          onPress={() => abrirModal()}
          style={LivrosStyles.addButton}
          textStyle={LivrosStyles.addButtonText}
        />
      </View>

      {/* Busca */}
      <View style={LivrosStyles.searchContainer}>
        <Input
          value={termoBusca}
          onChangeText={setTermoBusca}
          placeholder="BUSCAR POR TÍTULO, AUTOR OU ISBN..."
          style={LivrosStyles.searchInput}
        />
      </View>

      {/* Filtros */}
      <View style={LivrosStyles.filterContainer}>
        <Button
          title="TODOS"
          variant={filtroStatus === 'TODOS' ? 'primary' : 'outline'}
          size="small"
          onPress={() => alterarFiltroStatus('TODOS')}
          style={LivrosStyles.filterButton}
        />
        <Button
          title="DISPONÍVEL"
          variant={filtroStatus === 'DISPONIVEL' ? 'primary' : 'outline'}
          size="small"
          onPress={() => alterarFiltroStatus('DISPONIVEL')}
          style={LivrosStyles.filterButton}
        />
        <Button
          title="INDISPONÍVEL"
          variant={filtroStatus === 'INDISPONIVEL' ? 'primary' : 'outline'}
          size="small"
          onPress={() => alterarFiltroStatus('INDISPONIVEL')}
          style={LivrosStyles.filterButton}
        />
      </View>

      {/* Lista de Livros */}
      <FlatList
        data={livrosFiltrados}
        renderItem={renderLivro}
        keyExtractor={(item) => item.id}
        style={LivrosStyles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={LivrosStyles.emptyState}>
            <Text style={LivrosStyles.emptyStateText}>
              {termoBusca ? 'NENHUM LIVRO ENCONTRADO' : 'NENHUM LIVRO CADASTRADO'}
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
        <View style={LivrosStyles.modalContainer}>
          <View style={LivrosStyles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={LivrosStyles.modalTitle}>
                {livroEditando ? 'EDITAR LIVRO' : 'ADICIONAR LIVRO'}
              </Text>

              <Input
                label="TÍTULO"
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Digite o título do livro"
                autoCapitalize="characters"
              />

              <Input
                label="AUTOR"
                value={autor}
                onChangeText={setAutor}
                placeholder="Digite o nome do autor"
                autoCapitalize="characters"
              />

              <Input
                label="ISBN"
                value={isbn}
                onChangeText={setIsbn}
                placeholder="Digite o ISBN"
                autoCapitalize="characters"
              />

              <Input
                label="QUANTIDADE"
                value={quantidade}
                onChangeText={setQuantidade}
                placeholder="Digite a quantidade"
                keyboardType="numeric"
              />

              <View style={LivrosStyles.modalButtons}>
                <Button
                  title="CANCELAR"
                  variant="secondary"
                  onPress={fecharModal}
                  style={LivrosStyles.modalButton}
                />
                <Button
                  title="SALVAR"
                  variant="success"
                  onPress={salvarLivro}
                  loading={loading}
                  style={LivrosStyles.modalButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LivrosScreen;