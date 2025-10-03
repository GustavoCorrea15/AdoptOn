const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sistema_adocao',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function populateDatabase() {
  try {
    console.log('Conectando ao banco...');
    
    // Inserir usuário admin
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    
    await pool.query(`
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, verificado)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, [
      'Administrador',
      process.env.ADMIN_EMAIL || 'admin@sistema.com',
      adminPassword,
      'admin',
      true,
      true
    ]);
    
    console.log('Usuário admin criado: admin@sistema.com / admin123');
    
    // Inserir ONG de exemplo
    const ongResult = await pool.query(`
      INSERT INTO ongs (nome_fantasia, razao_social, cnpj, descricao, telefone_principal, email_contato, cidade, estado, verificada, ativa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (cnpj) DO NOTHING
      RETURNING id
    `, [
      'ONG Amigos dos Animais',
      'Associação Amigos dos Animais LTDA',
      '12.345.678/0001-90',
      'ONG dedicada ao resgate e adoção responsável de animais abandonados',
      '(11) 99999-9999',
      'contato@amigosanimais.org',
      'São Paulo',
      'SP',
      true,
      true
    ]);

    let ongId = ongResult.rows[0]?.id;
    
    if (!ongId) {
      const existingOng = await pool.query('SELECT id FROM ongs LIMIT 1');
      ongId = existingOng.rows[0]?.id;
    }

    if (!ongId) {
      console.error('Erro: Não foi possível criar/encontrar ONG');
      return;
    }

    console.log('ONG criada/encontrada com ID:', ongId);

    // Inserir animais de exemplo
    const animais = [
      {
        nome: 'Mel',
        especie: 'cao',
        raca: 'Golden Retriever',
        idade: 24,
        sexo: 'femea',
        porte: 'grande',
        peso: 25.5,
        cor: 'Dourado',
        descricao: 'Mel é uma cadela muito carinhosa e brincalhona. Adora crianças e se dá bem com outros animais.',
        nivel_energia: 'medio',
        sociabilidade: 'alta',
        castrado: true,
        vacinado: true,
        vermifugado: true,
        microchip: true,
        fotos: JSON.stringify(['https://images.unsplash.com/photo-1552053831-71594a27632d?w=500'])
      },
      {
        nome: 'Thor',
        especie: 'cao',
        raca: 'Pastor Alemão',
        idade: 36,
        sexo: 'macho',
        porte: 'grande',
        peso: 32.0,
        cor: 'Preto e marrom',
        descricao: 'Thor é um cão protetor e leal. Ideal para famílias que buscam um companheiro fiel.',
        nivel_energia: 'alto',
        sociabilidade: 'media',
        castrado: true,
        vacinado: true,
        vermifugado: true,
        microchip: false,
        fotos: JSON.stringify(['https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500'])
      },
      {
        nome: 'Luna',
        especie: 'gato',
        raca: 'Siamês',
        idade: 18,
        sexo: 'femea',
        porte: 'pequeno',
        peso: 4.2,
        cor: 'Branco e preto',
        descricao: 'Luna é uma gatinha independente mas carinhosa. Perfeita para apartamentos.',
        nivel_energia: 'medio',
        sociabilidade: 'media',
        castrado: true,
        vacinado: true,
        vermifugado: true,
        microchip: true,
        fotos: JSON.stringify(['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500'])
      }
    ];

    for (const animal of animais) {
      await pool.query(`
        INSERT INTO animais (
          nome, especie, raca, idade, sexo, porte, peso, cor, descricao,
          nivel_energia, sociabilidade, castrado, vacinado, vermifugado,
          microchip, fotos, ong_id, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT DO NOTHING
      `, [
        animal.nome, animal.especie, animal.raca, animal.idade, animal.sexo,
        animal.porte, animal.peso, animal.cor, animal.descricao,
        animal.nivel_energia, animal.sociabilidade, animal.castrado,
        animal.vacinado, animal.vermifugado, animal.microchip,
        animal.fotos, ongId, 'disponivel'
      ]);
    }

    console.log('Dados de exemplo inseridos com sucesso!');
    console.log('- Usuário admin criado');
    console.log('- 1 ONG criada');
    console.log('- 3 animais adicionados');
    
  } catch (error) {
    console.error('Erro ao popular banco:', error);
  } finally {
    await pool.end();
  }
}

populateDatabase();