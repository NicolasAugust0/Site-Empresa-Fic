import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Dados inválidos.',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Registro duplicado (ex.: já existe oferta deste produto nesta plataforma).' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Registro não encontrado.' });
      return;
    }
    if (err.code === 'P2003') {
      res.status(400).json({ error: 'Referência inválida (restaurante, produto ou plataforma inexistente).' });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
};
