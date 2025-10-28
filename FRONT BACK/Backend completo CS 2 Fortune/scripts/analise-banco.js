require('dotenv').config();
const { analyzeTable } = require('../src/utils/migration-utils');
const sqlite3 = require('sqlite3');
const { Client } = require('pg');
const path = require('path');

async function analisarBancoDeDados() {
  try {
    // Análise do SQLite
    console.log('Analisando banco SQLite...');
    const sqliteAnalise = await analisarSqlite();
    console.log('\nEstrutura do SQLite:', JSON.stringify(sqliteAnalise, null, 2));
    
    // Análise do PostgreSQL
    console.log('\nAnalisando banco PostgreSQL...');
    const pgAnalise = await analisarPostgres();
    console.log('\nEstrutura do PostgreSQL:', JSON.stringify(pgAnalise, null, 2));
    
    // Compara as estruturas
    compararEstruturas(sqliteAnalise, pgAnalise);
    
  } catch (erro) {
    console.error('Erro durante análise:', erro);
    process.exit(1);
  }
}

async function analisarSqlite() {
  return new Promise((resolve, reject) => {
    const dbPath = path.resolve(__dirname, '../prisma/dev.db');
    console.log('Caminho do SQLite:', dbPath);
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      
      db.all(
        `SELECT name FROM sqlite_master 
         WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
        async (err, tables) => {
          if (err) return reject(err);
          
          const analise = {};
          
          for (const { name } of tables) {
            try {
              analise[name] = await analyzeTable(db, name);
              console.log(`✓ Tabela ${name} analisada`);
            } catch (err) {
              console.error(`✗ Erro ao analisar tabela ${name}:`, err);
            }
          }
          
          db.close();
          resolve(analise);
        }
      );
    });
  });
}

async function analisarPostgres() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  const analise = {};
  
  try {
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    for (const { tablename } of tables.rows) {
      try {
        const result = await client.query(`SELECT * FROM "${tablename}"`);
        
        analise[tablename] = {
          count: result.rowCount,
          columns: {}
        };
        
        if (result.rows.length > 0) {
          const amostra = result.rows[0];
          
          for (const [coluna, valor] of Object.entries(amostra)) {
            analise[tablename].columns[coluna] = {
              type: typeof valor,
              nullable: false,
              min: valor,
              max: valor,
              uniqueValues: new Set([valor])
            };
          }
          
          for (const linha of result.rows.slice(1)) {
            for (const [coluna, valor] of Object.entries(linha)) {
              const stats = analise[tablename].columns[coluna];
              
              if (valor === null) {
                stats.nullable = true;
                continue;
              }
              
              if (typeof valor === 'number') {
                stats.min = Math.min(stats.min, valor);
                stats.max = Math.max(stats.max, valor);
              }
              
              if (stats.uniqueValues.size < 100) {
                stats.uniqueValues.add(valor);
              }
            }
          }
          
          for (const col of Object.values(analise[tablename].columns)) {
            col.uniqueValues = Array.from(col.uniqueValues);
          }
        }
        
        console.log(`✓ Tabela ${tablename} analisada`);
      } catch (err) {
        console.error(`✗ Erro ao analisar tabela ${tablename}:`, err);
      }
    }
  } finally {
    await client.end();
  }
  
  return analise;
}

function compararEstruturas(sqlite, postgres) {
  console.log('\n=== Comparação de Estruturas ===');
  
  const todasTabelas = new Set([
    ...Object.keys(sqlite),
    ...Object.keys(postgres)
  ]);
  
  for (const tabela of todasTabelas) {
    console.log(`\nTabela: ${tabela}`);
    
    const sqliteInfo = sqlite[tabela];
    const pgInfo = postgres[tabela];
    
    if (!sqliteInfo) {
      console.log('❌ Tabela não existe no SQLite');
      continue;
    }
    
    if (!pgInfo) {
      console.log('❌ Tabela não existe no PostgreSQL');
      continue;
    }
    
    console.log(`Registros: SQLite=${sqliteInfo.count}, PG=${pgInfo.count}`);
    
    const todasColunas = new Set([
      ...Object.keys(sqliteInfo.columns),
      ...Object.keys(pgInfo.columns)
    ]);
    
    for (const coluna of todasColunas) {
      const sqliteCol = sqliteInfo.columns[coluna];
      const pgCol = pgInfo.columns[coluna];
      
      if (!sqliteCol) {
        console.log(`  ❌ Coluna ${coluna} não existe no SQLite`);
        continue;
      }
      
      if (!pgCol) {
        console.log(`  ❌ Coluna ${coluna} não existe no PostgreSQL`);
        continue;
      }
      
      const tipoCompativel = sqliteCol.type === pgCol.type;
      console.log(`  ${tipoCompativel ? '✓' : '❌'} ${coluna}: ${sqliteCol.type} -> ${pgCol.type}`);
      
      if (sqliteCol.nullable !== pgCol.nullable) {
        console.log(`    ⚠️ Diferença em nullable: SQLite=${sqliteCol.nullable}, PG=${pgCol.nullable}`);
      }
    }
  }
}

analisarBancoDeDados();