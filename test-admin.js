const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sistema_adocao',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function createTestData() {
  try {
    console.log('🔧 Criando dados de teste para admin...');

    // Criar usuário admin
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await pool.query(`
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, verificado)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        senha = EXCLUDED.senha,
        ativo = EXCLUDED.ativo,
        verificado = EXCLUDED.verificado
    `, [
      'Administrador Sistema',
      process.env.ADMIN_EMAIL || 'admin@sistema.com',
      adminPassword,
      'admin',
      true,
      true
    ]);

    // Criar alguns usuários de teste
    const testUsers = [
      { nome: 'João Silva', email: 'joao@teste.com', tipo: 'adotante' },
      { nome: 'Maria Santos', email: 'maria@teste.com', tipo: 'adotante' },
      { nome: 'ONG Teste', email: 'ong@teste.com', tipo: 'ong' }
    ];

    for (const user of testUsers) {
      const password = await bcrypt.hash(process.env.TEST_PASSWORD || '123456', 10);
      await pool.query(`
        INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, verificado)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [user.nome, user.email, password, user.tipo, true, false]);
    }

    // Criar ONG pendente de aprovação
    const ongUser = await pool.query('SELECT id FROM usuarios WHERE email = $1', ['ong@teste.com']);
    if (ongUser.rows.length > 0) {
      await pool.query(`
        INSERT INTO ongs (usuario_id, nome_fantasia, cnpj, descricao, verificada, ativa)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (cnpj) DO NOTHING
      `, [
        ongUser.rows[0].id,
        'ONG Teste Aprovação',
        '98.765.432/0001-10',
        'ONG para teste de aprovação pelo admin',
        false,
        true
      ]);
    }

    console.log('✅ Dados de teste criados com sucesso!');
    console.log('');
    console.log('📋 Credenciais de teste:');
    console.log('👤 Admin: admin@sistema.com / admin123');
    console.log('🏠 Adotante: joao@teste.com / 123456');
    console.log('🏢 ONG: ong@teste.com / 123456');
    console.log('');
    console.log('🌐 Acesse: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  } finally {
    await pool.end();
  }
}

createTestData();