const pool = require('./src/config/database');

async function populateChat() {
  try {
    console.log('🔄 Populando sistema de chat com dados de exemplo...');

    // Buscar usuários e animais existentes
    const usersResult = await pool.query(`
      SELECT id, nome, tipo_usuario FROM usuarios 
      WHERE tipo_usuario IN ('adotante', 'ong') 
      LIMIT 10
    `);
    
    const animalsResult = await pool.query(`
      SELECT id, nome, ong_id FROM animais 
      LIMIT 5
    `);

    if (usersResult.rows.length < 2 || animalsResult.rows.length < 1) {
      console.log('❌ Não há usuários ou animais suficientes para criar conversas de exemplo');
      return;
    }

    const users = usersResult.rows;
    const animals = animalsResult.rows;
    
    // Encontrar adotantes e ONGs
    const adotantes = users.filter(u => u.tipo_usuario === 'adotante');
    const ongs = users.filter(u => u.tipo_usuario === 'ong');

    if (adotantes.length === 0 || ongs.length === 0) {
      console.log('❌ Não há adotantes e ONGs suficientes para criar conversas');
      return;
    }

    // Criar algumas conversas de exemplo
    const conversas = [
      {
        adotante: adotantes[0],
        ong: ongs[0],
        animal: animals[0],
        mensagens: [
          {
            remetente: adotantes[0],
            conteudo: `Olá! Tenho muito interesse em adotar ${animals[0].nome}. Podemos conversar sobre o processo?`
          },
          {
            remetente: ongs[0],
            conteudo: `Olá! Que bom saber do seu interesse em ${animals[0].nome}! Ele é um animal muito carinhoso. Você tem experiência com pets?`
          },
          {
            remetente: adotantes[0],
            conteudo: 'Sim, já tive outros animais antes. Moro em casa com quintal e tenho bastante tempo para cuidar bem dele.'
          },
          {
            remetente: ongs[0],
            conteudo: 'Perfeito! Isso é exatamente o que ele precisa. Gostaria de agendar uma visita para conhecê-lo pessoalmente?'
          }
        ]
      }
    ];

    // Se houver mais animais e usuários, criar mais conversas
    if (animals.length > 1 && adotantes.length > 1) {
      conversas.push({
        adotante: adotantes[Math.min(1, adotantes.length - 1)],
        ong: ongs[0],
        animal: animals[1],
        mensagens: [
          {
            remetente: adotantes[Math.min(1, adotantes.length - 1)],
            conteudo: `Oi! Vi ${animals[1].nome} no site e me apaixonei! Ele ainda está disponível para adoção?`
          },
          {
            remetente: ongs[0],
            conteudo: `Sim, ${animals[1].nome} ainda está disponível! É um amor de animal. Que tipo de ambiente você pode oferecer para ele?`
          }
        ]
      });
    }

    // Inserir mensagens no banco
    for (const conversa of conversas) {
      console.log(`💬 Criando conversa sobre ${conversa.animal.nome}...`);
      
      for (let i = 0; i < conversa.mensagens.length; i++) {
        const msg = conversa.mensagens[i];
        const destinatario = msg.remetente.id === conversa.adotante.id ? conversa.ong : conversa.adotante;
        
        await pool.query(`
          INSERT INTO mensagens (remetente_id, destinatario_id, animal_id, conteudo, tipo_mensagem, lida, created_at)
          VALUES ($1, $2, $3, $4, 'texto', $5, NOW() - INTERVAL $6)
        `, [
          msg.remetente.id,
          destinatario.id,
          conversa.animal.id,
          msg.conteudo,
          i < conversa.mensagens.length - 1, // Marcar como lida exceto a última
          `${conversas.length - i} hours`
        ]);
      }
    }

    console.log('✅ Sistema de chat populado com sucesso!');
    console.log(`📊 Criadas ${conversas.length} conversas com ${conversas.reduce((acc, c) => acc + c.mensagens.length, 0)} mensagens`);
    
  } catch (error) {
    console.error('❌ Erro ao popular chat:', error);
  } finally {
    await pool.end();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  populateChat();
}

module.exports = populateChat;