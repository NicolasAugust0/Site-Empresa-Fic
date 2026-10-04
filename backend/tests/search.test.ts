import { describe, expect, it } from 'vitest';
import { scoreProduct } from '../src/services/search/SearchService.js';
import { normalize } from '../src/utils/text.js';
import { product } from './helpers.js';

const terms = (q: string) => normalize(q).split(' ').filter(Boolean);

describe('busca', () => {
  it('normaliza acentos e caixa', () => {
    expect(normalize('  Hambúrguer  CLÁSSICO ')).toBe('hamburguer classico');
  });

  it('encontra por produto, restaurante e categoria', () => {
    expect(scoreProduct(product, terms('Pizza Calabresa'))).toBeGreaterThan(0);
    expect(scoreProduct(product, terms('pizzaria b'))).toBeGreaterThan(0);
    expect(scoreProduct(product, terms('pizza'))).toBeGreaterThan(0);
  });

  it('dá mais relevância ao nome exato do produto', () => {
    expect(scoreProduct(product, terms('pizza calabresa'))).toBeGreaterThan(scoreProduct(product, terms('pizza')));
  });

  it('não encontra produtos sem relação', () => {
    expect(scoreProduct(product, terms('sushi'))).toBe(0);
    expect(scoreProduct(product, terms('calabresa bacon'))).toBe(0);
  });
});
