import AsyncStorage from '@react-native-async-storage/async-storage';

// CHAVES DOS ARQUIVOS NO STORAGE
const ARQ_LIVROS = 'livros';
const ARQ_ALUNOS = 'alunos';
const ARQ_EMPRESTIMOS = 'emprestimos';
const DEFAULT_DIAS = 7; // PRAZO PADRÃO DE DEVOLUÇÃO

// UTILITÁRIOS DE STORAGE
export const carregar = async (chave) => {
  try {
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error(`Erro ao carregar ${chave}:`, error);
    return [];
  }
};

export const salvar = async (chave, dados) => {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${chave}:`, error);
    return false;
  }
};

// FUNÇÃO PARA CONVERTER PARA MAIÚSCULO
const toUpper = (str) => {
  return str ? str.toString().trim().toUpperCase() : '';
};

// FUNÇÃO PARA OBTER DATA ATUAL NO FORMATO ISO
const getDataAtual = () => {
  return new Date().toISOString().split('T')[0];
};

// FUNÇÃO PARA ADICIONAR DIAS A UMA DATA
const adicionarDias = (data, dias) => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData.toISOString().split('T')[0];
};

// ==================== FUNCIONALIDADES DE LIVROS ====================

export const adicionarLivro = async (titulo, autor, isbn, quantidade) => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    
    titulo = toUpper(titulo);
    autor = toUpper(autor);
    isbn = toUpper(isbn);
    quantidade = parseInt(quantidade) || 0;

    // Verifica se o livro já existe (por ISBN)
    const livroExistente = livros.find(l => l.isbn === isbn);
    
    if (livroExistente) {
      // Atualiza a quantidade
      livroExistente.quantidade += quantidade;
      await salvar(ARQ_LIVROS, livros);
      return { sucesso: true, mensagem: 'LIVRO ATUALIZADO' };
    }

    // Adiciona novo livro
    const novoLivro = {
      id: Date.now().toString(),
      titulo,
      autor,
      isbn,
      quantidade
    };

    livros.push(novoLivro);
    await salvar(ARQ_LIVROS, livros);
    return { sucesso: true, mensagem: 'LIVRO CADASTRADO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO CADASTRAR LIVRO' };
  }
};

export const editarLivro = async (id, titulo, autor, isbn, quantidade) => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    const indice = livros.findIndex(l => l.id === id);
    
    if (indice === -1) {
      return { sucesso: false, mensagem: 'LIVRO NÃO ENCONTRADO' };
    }

    livros[indice] = {
      ...livros[indice],
      titulo: toUpper(titulo),
      autor: toUpper(autor),
      isbn: toUpper(isbn),
      quantidade: parseInt(quantidade) || 0
    };

    await salvar(ARQ_LIVROS, livros);
    return { sucesso: true, mensagem: 'LIVRO EDITADO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO EDITAR LIVRO' };
  }
};

export const excluirLivro = async (id) => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    const livrosFiltrados = livros.filter(l => l.id !== id);
    
    await salvar(ARQ_LIVROS, livrosFiltrados);
    return { sucesso: true, mensagem: 'LIVRO EXCLUÍDO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO EXCLUIR LIVRO' };
  }
};

export const buscarLivros = async (termo) => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    const termoUpper = toUpper(termo);
    
    return livros.filter(l => 
      l.titulo.includes(termoUpper) || 
      l.autor.includes(termoUpper) || 
      l.isbn.includes(termoUpper)
    );
  } catch (error) {
    return [];
  }
};

export const obterLivros = async () => {
  return await carregar(ARQ_LIVROS);
};

// ==================== FUNCIONALIDADES DE ALUNOS ====================

export const adicionarAluno = async (nome, matricula) => {
  try {
    const alunos = await carregar(ARQ_ALUNOS);
    
    nome = toUpper(nome);
    matricula = toUpper(matricula);

    // Verifica se o aluno já existe
    const alunoExistente = alunos.find(a => a.matricula === matricula);
    
    if (alunoExistente) {
      return { sucesso: false, mensagem: 'ALUNO JÁ CADASTRADO' };
    }

    const novoAluno = {
      id: Date.now().toString(),
      nome,
      matricula
    };

    alunos.push(novoAluno);
    await salvar(ARQ_ALUNOS, alunos);
    return { sucesso: true, mensagem: 'ALUNO CADASTRADO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO CADASTRAR ALUNO' };
  }
};

export const editarAluno = async (id, nome, matricula) => {
  try {
    const alunos = await carregar(ARQ_ALUNOS);
    const indice = alunos.findIndex(a => a.id === id);
    
    if (indice === -1) {
      return { sucesso: false, mensagem: 'ALUNO NÃO ENCONTRADO' };
    }

    alunos[indice] = {
      ...alunos[indice],
      nome: toUpper(nome),
      matricula: toUpper(matricula)
    };

    await salvar(ARQ_ALUNOS, alunos);
    return { sucesso: true, mensagem: 'ALUNO EDITADO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO EDITAR ALUNO' };
  }
};

export const excluirAluno = async (id) => {
  try {
    const alunos = await carregar(ARQ_ALUNOS);
    const emprestimos = await carregar(ARQ_EMPRESTIMOS);
    
    // Remove o aluno
    const alunosFiltrados = alunos.filter(a => a.id !== id);
    
    // Remove empréstimos relacionados
    const emprestismosFiltrados = emprestimos.filter(e => e.alunoId !== id);
    
    await salvar(ARQ_ALUNOS, alunosFiltrados);
    await salvar(ARQ_EMPRESTIMOS, emprestismosFiltrados);
    
    return { sucesso: true, mensagem: 'ALUNO EXCLUÍDO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO EXCLUIR ALUNO' };
  }
};

export const buscarAlunos = async (termo) => {
  try {
    const alunos = await carregar(ARQ_ALUNOS);
    const termoUpper = toUpper(termo);
    
    return alunos.filter(a => 
      a.nome.includes(termoUpper) || 
      a.matricula.includes(termoUpper)
    );
  } catch (error) {
    return [];
  }
};

export const obterAlunos = async () => {
  return await carregar(ARQ_ALUNOS);
};

// ==================== FUNCIONALIDADES DE EMPRÉSTIMOS ====================

export const emprestar = async (alunoId, livroId, dias = DEFAULT_DIAS) => {
  try {
    const alunos = await carregar(ARQ_ALUNOS);
    const livros = await carregar(ARQ_LIVROS);
    const emprestimos = await carregar(ARQ_EMPRESTIMOS);

    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno) {
      return { sucesso: false, mensagem: 'ALUNO NÃO ENCONTRADO' };
    }

    const livro = livros.find(l => l.id === livroId);
    if (!livro) {
      return { sucesso: false, mensagem: 'LIVRO NÃO ENCONTRADO' };
    }

    if (livro.quantidade <= 0) {
      return { sucesso: false, mensagem: 'LIVRO INDISPONÍVEL' };
    }

    // Verifica se o aluno já tem este livro emprestado
    const emprestimoExistente = emprestimos.find(e => 
      e.alunoId === alunoId && e.livroId === livroId
    );

    if (emprestimoExistente) {
      return { sucesso: false, mensagem: 'ALUNO JÁ TEM ESTE LIVRO' };
    }

    // Diminui a quantidade do livro
    livro.quantidade -= 1;

    // Cria o empréstimo
    const hoje = getDataAtual();
    const vencimento = adicionarDias(hoje, parseInt(dias));

    const novoEmprestimo = {
      id: Date.now().toString(),
      alunoId,
      alunoNome: aluno.nome,
      alunoMatricula: aluno.matricula,
      livroId,
      livroTitulo: livro.titulo,
      livroIsbn: livro.isbn,
      dataEmprestimo: hoje,
      dataVencimento: vencimento
    };

    emprestimos.push(novoEmprestimo);

    await salvar(ARQ_LIVROS, livros);
    await salvar(ARQ_EMPRESTIMOS, emprestimos);

    return { sucesso: true, mensagem: 'EMPRÉSTIMO REGISTRADO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO REGISTRAR EMPRÉSTIMO' };
  }
};

export const devolver = async (emprestimoId) => {
  try {
    const emprestimos = await carregar(ARQ_EMPRESTIMOS);
    const livros = await carregar(ARQ_LIVROS);

    const emprestimo = emprestimos.find(e => e.id === emprestimoId);
    if (!emprestimo) {
      return { sucesso: false, mensagem: 'EMPRÉSTIMO NÃO ENCONTRADO' };
    }

    // Aumenta a quantidade do livro
    const livro = livros.find(l => l.id === emprestimo.livroId);
    if (livro) {
      livro.quantidade += 1;
    }

    // Remove o empréstimo
    const emprestismosFiltrados = emprestimos.filter(e => e.id !== emprestimoId);

    await salvar(ARQ_LIVROS, livros);
    await salvar(ARQ_EMPRESTIMOS, emprestismosFiltrados);

    return { sucesso: true, mensagem: 'DEVOLUÇÃO EFETUADA' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO EFETUAR DEVOLUÇÃO' };
  }
};

export const obterEmprestimos = async () => {
  return await carregar(ARQ_EMPRESTIMOS);
};

// ==================== FUNCIONALIDADES DE RELATÓRIOS ====================

export const gerarRelatorios = async () => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    const emprestimos = await carregar(ARQ_EMPRESTIMOS);

    const totalLivros = livros.reduce((total, livro) => total + (livro.quantidade || 0), 0);
    const emprestimosAtivos = emprestimos.length;
    
    // Empréstimos atrasados
    const hoje = new Date().toISOString().split('T')[0];
    const atrasados = emprestimos.filter(e => e.dataVencimento < hoje);

    // Livros mais emprestados
    const contadorLivros = {};
    emprestimos.forEach(e => {
      contadorLivros[e.livroTitulo] = (contadorLivros[e.livroTitulo] || 0) + 1;
    });

    const maisEmprestados = Object.entries(contadorLivros)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    return {
      totalLivros,
      emprestimosAtivos,
      atrasados,
      maisEmprestados,
      totalAtrasados: atrasados.length
    };
  } catch (error) {
    console.error('Erro ao gerar relatórios:', error);
    return {
      totalLivros: 0,
      emprestimosAtivos: 0,
      atrasados: [],
      maisEmprestados: [],
      totalAtrasados: 0
    };
  }
};

// ==================== UTILITÁRIOS ====================

export const limparTodosDados = async () => {
  try {
    await AsyncStorage.multiRemove([ARQ_LIVROS, ARQ_ALUNOS, ARQ_EMPRESTIMOS]);
    return { sucesso: true, mensagem: 'TODOS OS DADOS FORAM LIMPOS' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO LIMPAR DADOS' };
  }
};

export const exportarDados = async () => {
  try {
    const livros = await carregar(ARQ_LIVROS);
    const alunos = await carregar(ARQ_ALUNOS);
    const emprestimos = await carregar(ARQ_EMPRESTIMOS);
    
    return {
      livros,
      alunos,
      emprestimos,
      dataExportacao: new Date().toISOString()
    };
  } catch (error) {
    return null;
  }
};

export const importarDados = async (dados) => {
  try {
    if (dados.livros) await salvar(ARQ_LIVROS, dados.livros);
    if (dados.alunos) await salvar(ARQ_ALUNOS, dados.alunos);
    if (dados.emprestimos) await salvar(ARQ_EMPRESTIMOS, dados.emprestimos);
    
    return { sucesso: true, mensagem: 'DADOS IMPORTADOS COM SUCESSO' };
  } catch (error) {
    return { sucesso: false, mensagem: 'ERRO AO IMPORTAR DADOS' };
  }
};

export { DEFAULT_DIAS };