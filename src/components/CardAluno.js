import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

const CardAluno = ({ 
  aluno, 
  onEdit, 
  onDelete, 
  showActions = true,
  emprestimosAtivos = 0
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nome}>{aluno.nome}</Text>
        <Text style={styles.detalhe}>
          <Text style={styles.label}>MATRÍCULA: </Text>
          {aluno.matricula}
        </Text>
        {emprestimosAtivos > 0 && (
          <Text style={styles.emprestimos}>
            <Text style={styles.label}>EMPRÉSTIMOS ATIVOS: </Text>
            <Text style={styles.numeroEmprestimos}>{emprestimosAtivos}</Text>
          </Text>
        )}
      </View>

      {showActions && (
        <View style={styles.acoes}>
          <Button
            title="EDITAR"
            variant="primary"
            size="small"
            onPress={() => onEdit && onEdit(aluno)}
            style={styles.botaoAcao}
          />
          <Button
            title="EXCLUIR"
            variant="danger"
            size="small"
            onPress={() => onDelete && onDelete(aluno)}
            style={styles.botaoAcao}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detalhe: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  emprestimos: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  numeroEmprestimos: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  acoes: {
    flexDirection: 'row',
  },
  botaoAcao: {
    marginLeft: 10,
    minWidth: 70,
  },
});

export default CardAluno;