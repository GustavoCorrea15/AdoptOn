const Animal = require('../models/Animal');

class AnimalController {
  static async index(req, res) {
    try {
      const filters = {
        especie: req.query.especie,
        porte: req.query.porte,
        idade_min: req.query.idade_min,
        idade_max: req.query.idade_max,
        sexo: req.query.sexo,
        cidade: req.query.cidade,
        limit: req.query.limit || 20
      };

      const animals = await Animal.findAvailable(filters);
      
      res.json({
        success: true,
        data: animals,
        total: animals.length
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
      const animal = await Animal.findById(req.params.id);
      
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
      if (req.user.tipo_usuario !== 'ong') {
        return res.status(403).json({
          success: false,
          error: 'Apenas ONGs podem cadastrar animais'
        });
      }

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
      console.error('Erro ao cadastrar animal:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AnimalController;