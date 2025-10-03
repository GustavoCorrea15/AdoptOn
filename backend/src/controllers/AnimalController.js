const Animal = require('../models/Animal');

class AnimalController {
  static async index(req, res) {
    try {
      const filters = req.query;
      const animals = await Animal.findAvailable(filters);
      
      res.json({
        success: true,
        data: animals
      });
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      const animal = await Animal.findById(id);
      
      if (!animal) {
        return res.status(404).json({
          success: false,
          error: 'Animal não encontrado'
        });
      }

      res.json({
        success: true,
        data: animal
      });
    } catch (error) {
      console.error('Erro ao buscar animal:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async store(req, res) {
    try {
      const animalData = {
        ...req.body,
        ong_id: req.user.id
      };
      
      const animal = await Animal.create(animalData);
      
      res.status(201).json({
        success: true,
        data: animal
      });
    } catch (error) {
      console.error('Erro ao criar animal:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async getMatching(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;
      
      const animals = await Animal.getMatchingAnimals(userId, limit);
      
      res.json({
        success: true,
        data: animals
      });
    } catch (error) {
      console.error('Erro ao buscar animais compatíveis:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AnimalController;