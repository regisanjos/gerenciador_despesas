const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'secreta';

class AuthService {
  static async login(email, senha) {
    try {
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        throw new Error('Senha incorreta');
      }

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, {
        expiresIn: '7d',
      });

      return { usuario, token };
    } catch (error) {
      throw new Error('Erro ao autenticar usuário: ' + error.message);
    }
  }
}

module.exports = AuthService;
