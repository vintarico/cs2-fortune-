require('dotenv').config();
const sqlite3 = require('sqlite3');
const { Client } = require('pg');
const { from: copyFrom } = require('pg-copy-streams');
const path = require('path');
const fs = require('fs').promises;
const {
  toMonetaryAmount,
  normalizeJson,
  detectForeignKeys,
  buildTableGraph,
  topologicalSort
} = require('../src/utils/migration-utils');

async function migrarBancoDeDados() {
  const sqliteDb = new sqlite3.Database(
    path.join(__dirname, '../prisma/dev.db')
  );
  
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    console.log('Conectando ao PostgreSQL...');
    await pgClient.connect();
    
    // Lista todas as tabelas do SQLite
    const tabelas = await listarTabelas(sqliteDb);
    console.log(`Encontradas ${tabelas.length} tabelas`);
    
    // Detecta relacionamentos e ordena tabelas
    const schema = {};
    for (const tabela of tabelas) {
      const colunas = await listarColunas(sqliteDb, tabela);
      schema[tabela] = colunas;
    }
    
    const fks = detectForeignKeys(schema);
    const grafo = buildTableGraph(fks);
    const ordemMigracao = topologicalSort(grafo);
    
    console.log('Ordem de migração:', ordemMigracao);
    
    // Inicia transação no PostgreSQL
    await pgClient.query('BEGIN');
    
    const estatisticas = {
      total: 0,
      sucesso: 0,
      erro: 0,
      erros: {}
    };
    
    // Migra cada tabela na ordem correta
    for (const tabela of ordemMigracao) {
      try {
        console.log(`\nMigrando tabela ${tabela}...`);
        const resultado = await migrarTabela(sqliteDb, pgClient, tabela);
        estatisticas.total += resultado.total;
        estatisticas.sucesso += resultado.sucesso;
        estatisticas.erro += resultado.erro;
        if (resultado.erro > 0) {
          estatisticas.erros[tabela] = resultado.erros;
        }
      } catch (erro) {
        console.error(`Erro ao migrar tabela ${tabela}:`, erro);
        await pgClient.query('ROLLBACK');
        throw erro;
      }
    }
    
    // Commit da transação
    await pgClient.query('COMMIT');
    
    // Imprime estatísticas
    console.log('\n=== Estatísticas da Migração ===');
    console.log(`Total de registros: ${estatisticas.total}`);
    console.log(`Sucessos: ${estatisticas.sucesso}`);
    console.log(`Erros: ${estatisticas.erro}`);
    if (estatisticas.erro > 0) {
      console.log('\nErros por tabela:');
      for (const [tabela, erros] of Object.entries(estatisticas.erros)) {
        console.log(`\n${tabela}:`);
        for (const erro of erros) {
          console.log(`  - Linha ${erro.id}: ${erro.mensagem}`);
        }
      }
    }
    
  } catch (erro) {
    console.error('Erro durante migração:', erro);
    process.exit(1);
  } finally {
    sqliteDb.close();
    await pgClient.end();
  }
}

function listarTabelas(db) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT name FROM sqlite_master 
       WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(r => r.name));
      }
    );
  });
}

function listarColunas(db, tabela) {
  return new Promise((resolve, reject) => {
    db.all(
      `PRAGMA table_info(${tabela})`,
      (err, colunas) => {
        if (err) return reject(err);
        resolve(colunas.map(c => c.name));
      }
    );
  });
}

async function migrarTabela(sqliteDb, pgClient, tabela) {
  const estatisticas = {
    total: 0,
    sucesso: 0,
    erro: 0,
    erros: []
  };
  
  return new Promise((resolve, reject) => {
    // Busca estrutura da tabela
    sqliteDb.all(
      `PRAGMA table_info(${tabela})`,
      async (err, colunas) => {
        if (err) return reject(err);
        
        const nomesColunas = colunas.map(c => c.name);
        
        // Limpa tabela no PostgreSQL
        await pgClient.query(`TRUNCATE "${tabela}" CASCADE`);
        
        // Busca dados do SQLite
        sqliteDb.all(
          `SELECT * FROM "${tabela}"`,
          async (err, linhas) => {
            if (err) return reject(err);
            
            estatisticas.total = linhas.length;
            
            // Processa cada linha
            for (const linha of linhas) {
              try {
                const valores = nomesColunas.map(coluna => {
                  const valor = linha[coluna];
                  
                  // Converte valores especiais
                  if (valor === null) return null;
                  
                  // Campos monetários
                  if (coluna.toLowerCase().includes('valor') ||
                      coluna.toLowerCase().includes('preco')) {
                    return toMonetaryAmount(valor);
                  }
                  
                  // Campos JSON
                  if (typeof valor === 'string' && 
                      (valor.startsWith('{') || valor.startsWith('['))) {
                    return normalizeJson(valor);
                  }
                  
                  return valor;
                });
                
                // Insere no PostgreSQL
                await pgClient.query(
                  `INSERT INTO "${tabela}" (${nomesColunas.map(c => `"${c}"`).join(', ')})
                   VALUES (${nomesColunas.map((_, i) => `$${i + 1}`).join(', ')})`,
                  valores
                );
                
                estatisticas.sucesso++;
                
              } catch (erro) {
                estatisticas.erro++;
                estatisticas.erros.push({
                  id: linha.id,
                  mensagem: erro.message
                });
              }
            }
            
            resolve(estatisticas);
          }
        );
      }
    );
  });
}

migrarBancoDeDados();