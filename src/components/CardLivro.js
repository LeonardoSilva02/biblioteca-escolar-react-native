import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Button from './Button';

const CardLivro = ({ 
  livro, 
  onEdit, 
  onDelete, 
  showActions = true 
}) => {
  const getStatusColor = () => {
    if (livro.quantidade > 0) {
      return '#28a745'; // Verde para disponível
    }
    return '#dc3545'; // Vermelho para indisponível
  };

  const getStatusText = () => {
    if (livro.quantidade > 0) {
      return `DISPONÍVEL (${livro.quantidade})`;
    }
    return 'INDISPONÍVEL';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{livro.titulo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <View style={styles.detalhes}>
        <Text style={styles.detalhe}>
          <Text style={styles.label}>AUTOR: </Text>
          {livro.autor}
        </Text>
        <Text style={styles.detalhe}>
          <Text style={styles.label}>ISBN: </Text>
          {livro.isbn}
        </Text>
        <Text style={styles.detalhe}>
          <Text style={styles.label}>QUANTIDADE: </Text>
          {livro.quantidade}
        </Text>
      </View>

      {showActions && (
        <View style={styles.acoes}>
          <Button
            title="EDITAR"
            variant="primary"
            size="small"
            onPress={() => onEdit && onEdit(livro)}
            style={styles.botaoAcao}
          />
          <Button
            title="EXCLUIR"
            variant="danger"
            size="small"
            onPress={() => onDelete && onDelete(livro)}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  detalhes: {
    marginBottom: 15,
  },
  detalhe: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botaoAcao: {
    marginLeft: 10,
    minWidth: 70,
  },
});

export default CardLivro;