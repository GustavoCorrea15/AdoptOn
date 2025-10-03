const MatchingService = require('../services/MatchingService');
const ResponseView = require('../views/ResponseView');

class MatchingController {
  static async getCompatibleAnimals(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const animals = await MatchingService.getMatchingAnimals(req.user.id, limit);
      
      const { response, statusCode } = ResponseView.success(animals);
      res.status(statusCode).json(response);
    } catch (error) {
      console.error('Erro ao buscar animais compatíveis:', error);
      const { response, statusCode } = ResponseView.error('Erro interno do servidor');
      res.status(statusCode).json(response);
    }
  }

  static async getCompatibilityDetails(req, res) {
    try {
      const { animalId } = req.params;
      const details = await MatchingService.getCompatibilityDetails(req.user.id, animalId);
      
      const { response, statusCode } = ResponseView.success(details);
      res.status(statusCode).json(response);
    } catch (error) {
      console.error('Erro ao obter detalhes de compatibilidade:', error);
      
      if (error.message === 'Usuário ou animal não encontrado') {
        const { response, statusCode } = ResponseView.notFound(error.message);
        return res.status(statusCode).json(response);
      }
      
      const { response, statusCode } = ResponseView.error('Erro interno do servidor');
      res.status(statusCode).json(response);
    }
  }
}

module.exports = MatchingController;