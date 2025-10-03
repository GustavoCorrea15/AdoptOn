require('dotenv').config();

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Conecta ao banco padrão primeiro
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function initDatabase() {
  try {
    // Criar banco de dados se não existir
    const dbName = process.env.DB_NAME || 'sistema_adocao';
    // Sanitizar nome do banco para evitar SQL injection
    const sanitizedDbName = dbName.replace(/[^a-zA-Z0-9_]/g, '');
    if (sanitizedDbName !== dbName) {
      throw new Error('Nome do banco contém caracteres inválidos');
    }
    await pool.query(`CREATE DATABASE "${sanitizedDbName}"`);
    console.log('Banco de dados criado com sucesso!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Banco de dados já existe.');
    } else {
      console.error('Erro ao criar banco:', error.message);
    }
  }

  // Conectar ao banco específico
  const dbName = process.env.DB_NAME || 'sistema_adocao';
  const dbPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: dbName,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  });

  try {
    // Executar schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await dbPool.query(schema);
    console.log('Schema criado com sucesso!');
    
    // Inserir dados de exemplo
    await dbPool.query(`
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, cidade, tipo_moradia, experiencia_pets) 
      VALUES 
      ('Admin Sistema', 'admin@sistema.com', '$2a$10$example', 'ong', '(11) 99999-9999', 'São Paulo', 'casa', 'muita'),
      ('João Silva', 'joao@email.com', '$2a$10$example', 'adotante', '(11) 88888-8888', 'São Paulo', 'apartamento', 'media')
      ON CONFLICT (email) DO NOTHING
    `);
    
    console.log('Dados de exemplo inseridos!');
    
  } catch (error) {
    console.error('Erro ao executar schema:', error.message);
  } finally {
    await dbPool.end();
    await pool.end();
  }
}

initDatabase();