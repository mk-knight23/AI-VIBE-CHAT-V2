import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CfLWTIVq.js","_app/immutable/chunks/C9nTLvdD.js","_app/immutable/chunks/CgYeT4aQ.js","_app/immutable/chunks/D1-AXyWS.js","_app/immutable/chunks/CsRfKtTd.js"];
export const stylesheets = ["_app/immutable/assets/0.DegfNPIC.css"];
export const fonts = [];
