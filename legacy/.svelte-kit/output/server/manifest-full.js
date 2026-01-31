export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BcRQTzSN.js",app:"_app/immutable/entry/app.Cc3818G_.js",imports:["_app/immutable/entry/start.BcRQTzSN.js","_app/immutable/chunks/ulQ3ZTF9.js","_app/immutable/chunks/CgYeT4aQ.js","_app/immutable/chunks/CsRfKtTd.js","_app/immutable/entry/app.Cc3818G_.js","_app/immutable/chunks/CgYeT4aQ.js","_app/immutable/chunks/C_A4GDKu.js","_app/immutable/chunks/C9nTLvdD.js","_app/immutable/chunks/CsRfKtTd.js","_app/immutable/chunks/D-v88AAU.js","_app/immutable/chunks/D1-AXyWS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/chat",
				pattern: /^\/api\/chat\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/chat/_server.ts.js'))
			},
			{
				id: "/api/providers",
				pattern: /^\/api\/providers\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/providers/_server.ts.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
