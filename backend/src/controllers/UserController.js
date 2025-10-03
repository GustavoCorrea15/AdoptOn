const User = require('../models/User');
const ResponseView = require('../views/ResponseView');

class UserController {
  static async show(req, res) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        const { response, statusCode } = ResponseView.notFound('Usuário não encontrado');
        return res.status(statusCode).json(response);
      }

      // Remover dados sensíveis
      const { senha, ...userData } = user;
      
      const { response, statusCode } = ResponseView.success(userData);
      res.status(statusCode).json(response);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      const { response, statusCode } = ResponseView.error('Erro interno do servidor');
      res.status(statusCode).json(response);
    }
  }

  static async update(req, res) {
    try {
      if (req.user.id !== parseInt(req.params.id)) {
        const { response, statusCode } = ResponseView.forbidden('Você só pode atualizar seu próprio perfil');
        return res.status(statusCode).json(response);
      }

      const user = await User.update(req.params.id, req.body);
      
      if (!user) {
        const { response, statusCode } = ResponseView.notFound('Usuário não encontrado');
        return res.status(statusCode).json(response);
      }

      // Remover dados sensíveis
      const { senha, ...userData } = user;
      
      const { response, statusCode } = ResponseView.success(userData, 'Perfil atualizado com sucesso');
      res.status(statusCode).json(response);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      const { response, statusCode } = ResponseView.error('Erro interno do servidor');
      res.status(statusCode).json(response);
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        const { response, statusCode } = ResponseView.notFound('Usuário não encontrado');
        return res.status(statusCode).json(response);
      }

      // Remover dados sensíveis
      const { senha, ...userData } = user;
      
      const { response, statusCode } = ResponseView.success(userData);
      res.status(statusCode).json(response);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      const { response, statusCode } = ResponseView.error('Erro interno do servidor');
      res.status(statusCode).json(response);
    }
  }
}

module.exports = UserController;