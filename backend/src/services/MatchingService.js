const Animal = require('../models/Animal');
const User = require('../models/User');

class MatchingService {
  static calculateCompatibilityScore(user, animal) {
    let score = 0;
    let maxScore = 0;

    // Tipo de moradia (peso: 25)
    maxScore += 25;
    if (user.tipo_moradia === 'casa' || animal.porte === 'pequeno') {
      score += 25;
    } else if (user.tipo_moradia === 'apartamento' && animal.porte === 'medio') {
      score += 15;
    } else if (user.tipo_moradia === 'apartamento' && animal.porte === 'grande') {
      score += 5;
    }

    // Quintal (peso: 20)
    maxScore += 20;
    if (user.tem_quintal) {
      score += 20;
    } else if (animal.nivel_energia === 'baixo') {
      score += 15;
    } else if (animal.nivel_energia === 'medio') {
      score += 10;
    }

    // Experiência com pets (peso: 20)
    maxScore += 20;
    if (user.experiencia_pets === 'alta') {
      score += 20;
    } else if (user.experiencia_pets === 'media') {
      if (animal.temperamento === 'docil' || animal.temperamento === 'calmo') {
        score += 18;
      } else {
        score += 12;
      }
    } else if (user.experiencia_pets === 'baixa') {
      if (animal.temperamento === 'docil' && !animal.cuidados_especiais) {
        score += 15;
      } else {
        score += 5;
      }
    }

    // Tempo disponível (peso: 15)
    maxScore += 15;
    if (user.tempo_disponivel === 'muito') {
      score += 15;
    } else if (user.tempo_disponivel === 'medio') {
      if (animal.nivel_energia !== 'muito_alto') {
        score += 12;
      } else {
        score += 8;
      }
    } else if (user.tempo_disponivel === 'pouco') {
      if (animal.nivel_energia === 'baixo') {
        score += 10;
      } else {
        score += 3;
      }
    }

    // Preferências específicas (peso: 10)
    maxScore += 10;
    const preferencias = user.preferencias_animal || {};
    
    if (preferencias.especie && preferencias.especie === animal.especie) {
      score += 5;
    }
    
    if (preferencias.porte && preferencias.porte === animal.porte) {
      score += 3;
    }
    
    if (preferencias.idade_max && animal.idade <= preferencias.idade_max) {
      score += 2;
    }

    // Localização (peso: 10)
    maxScore += 10;
    if (user.cidade === animal.ong_cidade) {
      score += 10;
    } else {
      score += 3; // Pontuação mínima para outras cidades
    }

    // Calcular porcentagem final
    const finalScore = Math.round((score / maxScore) * 100);
    return Math.min(finalScore, 100);
  }

  static async getMatchingAnimals(userId, limit = 10) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const animals = await Animal.findAvailable();
      
      // Calcular score de compatibilidade para cada animal
      const animalsWithScore = animals.map(animal => ({
        ...animal,
        compatibility_score: this.calculateCompatibilityScore(user, animal)
      }));

      // Ordenar por score de compatibilidade (maior para menor)
      animalsWithScore.sort((a, b) => b.compatibility_score - a.compatibility_score);

      // Retornar apenas os animais solicitados
      return animalsWithScore.slice(0, limit);
    } catch (error) {
      console.error('Erro no serviço de matching:', error);
      throw error;
    }
  }

  static async getCompatibilityDetails(userId, animalId) {
    try {
      const user = await User.findById(userId);
      const animal = await Animal.findById(animalId);

      if (!user || !animal) {
        throw new Error('Usuário ou animal não encontrado');
      }

      const score = this.calculateCompatibilityScore(user, animal);
      
      const details = {
        score,
        factors: {
          moradia: this._getMoradiaCompatibility(user, animal),
          experiencia: this._getExperienciaCompatibility(user, animal),
          tempo: this._getTempoCompatibility(user, animal),
          localizacao: this._getLocalizacaoCompatibility(user, animal)
        }
      };

      return details;
    } catch (error) {
      console.error('Erro ao obter detalhes de compatibilidade:', error);
      throw error;
    }
  }

  static _getMoradiaCompatibility(user, animal) {
    if (user.tipo_moradia === 'casa') {
      return { score: 100, message: 'Casa é ideal para qualquer porte de animal' };
    } else if (animal.porte === 'pequeno') {
      return { score: 90, message: 'Animal pequeno se adapta bem a apartamentos' };
    } else if (animal.porte === 'medio') {
      return { score: 70, message: 'Animal médio pode se adaptar a apartamentos com exercícios' };
    } else {
      return { score: 30, message: 'Animal grande precisa de mais espaço' };
    }
  }

  static _getExperienciaCompatibility(user, animal) {
    if (user.experiencia_pets === 'alta') {
      return { score: 100, message: 'Sua experiência permite cuidar de qualquer animal' };
    } else if (user.experiencia_pets === 'media') {
      if (animal.temperamento === 'docil') {
        return { score: 85, message: 'Animal dócil é adequado para sua experiência' };
      } else {
        return { score: 60, message: 'Animal pode precisar de mais atenção' };
      }
    } else {
      if (animal.temperamento === 'docil' && !animal.cuidados_especiais) {
        return { score: 75, message: 'Animal ideal para iniciantes' };
      } else {
        return { score: 25, message: 'Animal pode ser desafiador para iniciantes' };
      }
    }
  }

  static _getTempoCompatibility(user, animal) {
    if (user.tempo_disponivel === 'muito') {
      return { score: 100, message: 'Você tem tempo suficiente para qualquer animal' };
    } else if (user.tempo_disponivel === 'medio') {
      if (animal.nivel_energia === 'baixo') {
        return { score: 90, message: 'Animal de baixa energia combina com seu tempo' };
      } else {
        return { score: 60, message: 'Animal pode precisar de mais atenção' };
      }
    } else {
      if (animal.nivel_energia === 'baixo') {
        return { score: 70, message: 'Animal independente é adequado' };
      } else {
        return { score: 30, message: 'Animal precisa de mais tempo e atenção' };
      }
    }
  }

  static _getLocalizacaoCompatibility(user, animal) {
    if (user.cidade === animal.ong_cidade) {
      return { score: 100, message: 'Animal está na sua cidade' };
    } else {
      return { score: 50, message: 'Animal está em outra cidade' };
    }
  }
}

module.exports = MatchingService;