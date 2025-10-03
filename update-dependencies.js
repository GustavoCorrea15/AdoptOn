const { execSync } = require('child_process');
const path = require('path');

const projects = [
  { name: 'Backend', path: './backend' },
  { name: 'Frontend', path: './frontend-web' },
  { name: 'Mobile', path: './mobile-app' }
];

async function updateDependencies() {
  console.log('🔄 Atualizando dependências vulneráveis...\n');

  for (const project of projects) {
    console.log(`📦 Atualizando ${project.name}...`);
    
    try {
      process.chdir(path.resolve(project.path));
      
      // Audit e fix automático
      console.log('  - Executando npm audit fix...');
      execSync('npm audit fix --force', { stdio: 'inherit' });
      
      // Atualizar pacotes específicos vulneráveis
      console.log('  - Atualizando pacotes críticos...');
      execSync('npm update', { stdio: 'inherit' });
      
      console.log(`✅ ${project.name} atualizado com sucesso!\n`);
      
    } catch (error) {
      console.error(`❌ Erro ao atualizar ${project.name}:`, error.message);
    }
    
    // Voltar ao diretório raiz
    process.chdir(path.resolve('..'));
  }
  
  console.log('🎉 Processo de atualização concluído!');
  console.log('⚠️  Recomendações adicionais:');
  console.log('   - Execute os testes após as atualizações');
  console.log('   - Verifique se todas as funcionalidades estão funcionando');
  console.log('   - Execute npm audit novamente para verificar vulnerabilidades restantes');
}

updateDependencies();