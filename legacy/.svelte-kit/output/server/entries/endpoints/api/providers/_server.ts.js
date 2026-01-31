import { json } from "@sveltejs/kit";
import { P as PROVIDERS } from "../../../../chunks/registry.js";
const GET = () => {
  return json(PROVIDERS);
};
export {
  GET
};
