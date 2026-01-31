import "clsx";
import { QueryClient } from "@tanstack/query-core";
import { a as ssr_context, s as setContext } from "../../chunks/context.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const _contextKey = /* @__PURE__ */ Symbol("QueryClient");
const setQueryClientContext = (client) => {
  setContext(_contextKey, client);
};
function QueryClientProvider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const { client = new QueryClient(), children } = $$props;
    setQueryClientContext(client);
    onDestroy(() => {
      client.unmount();
    });
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      // 5 minutes
      gcTime: 1e3 * 60 * 30
      // 30 minutes
    }
  }
});
function _layout($$renderer, $$props) {
  let { children } = $$props;
  QueryClientProvider($$renderer, {
    client: queryClient,
    children: ($$renderer2) => {
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    }
  });
}
export {
  _layout as default
};
