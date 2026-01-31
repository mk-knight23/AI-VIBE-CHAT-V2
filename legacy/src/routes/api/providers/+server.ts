import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PROVIDERS } from '$lib/providers/registry';

export const GET: RequestHandler = () => {
  return json(PROVIDERS);
};
