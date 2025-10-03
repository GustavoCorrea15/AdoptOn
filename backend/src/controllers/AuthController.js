const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  static async register(req, res) {
    try {
      const { nome, email, senha, tipo_usuario, telefone, cidade } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado'
        });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);
      
      const userData = {
        nome,
        email,
        senha: hashedPassword,
        tipo_usuario,
        telefone,
        cidade
      };

      const user = await User.create(userData);
      
      const token = jwt.sign(
        { id: user.id, email: user.email, tipo_usuario: user.tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
      }

      const isValidPassword = await bcrypt.compare(senha, user.senha);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Credenciais inválidas'
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, tipo_usuario: user.tipo_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipo_usuario: user.tipo_usuario
          },
          token
        }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async me(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo_usuario: user.tipo_usuario,
          telefone: user.telefone,
          cidade: user.cidade
        }
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = AuthController;