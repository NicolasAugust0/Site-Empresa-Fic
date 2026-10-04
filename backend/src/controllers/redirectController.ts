import type { Request, Response } from 'express';
import { resolveRedirect } from '../services/redirect/RedirectService.js';
import { HttpError, parseId } from '../utils/http.js';

export const redirectController = {
  /** Registra o clique e redireciona (302) para o link da plataforma vencedora. */
  async redirect(req: Request, res: Response) {
    const target = await resolveRedirect(parseId(req.params.offerId));
    if (!target) throw new HttpError(404, 'Oferta não encontrada.');
    res.redirect(302, target);
  },
};
