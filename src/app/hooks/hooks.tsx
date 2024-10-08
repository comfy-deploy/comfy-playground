"use client";

import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";

import { ComfyDeploy } from "comfydeploy";

const url = window.location.origin;

export const cd = new ComfyDeploy({
	serverURL: `${url}/api/cd`,
});

// Add this type helper at the top of your file or in a separate types file
type ExcludeUnderscoreKeys<T> = {
	[K in keyof T as K extends `_${string}` ? never : K]: T[K];
};

export function useComfyQuery<
	K extends keyof ExcludeUnderscoreKeys<ComfyDeploy>,
	M extends keyof ExcludeUnderscoreKeys<ComfyDeploy[K]>,
	P extends Parameters<ComfyDeploy[K][M]>,
	R = Awaited<ReturnType<ComfyDeploy[K][M]>>,
>(cdKey: K, method: M, params: P, options = {}) {
	return useQuery({
		queryKey: [cdKey, method],
		queryFn: async () => {
			const data = await cd[cdKey][method](...params);
			console.log(data);
			return data as R;
		},
		...options,
	});
}

export function useComfyMutation<
	K extends keyof ExcludeUnderscoreKeys<ComfyDeploy>,
	M extends keyof ExcludeUnderscoreKeys<ComfyDeploy[K]>,
	P extends Parameters<ComfyDeploy[K][M]>[0],
	R = Awaited<ReturnType<ComfyDeploy[K][M]>>,
>(cdKey: K, method: M, options = {}) {
	return useMutation({
		mutationFn: async (params: P) => {
			const data = await cd[cdKey][method](params);
			console.log(data);
			return data as R;
		},
		...options,
	});
}

const queryClient = new QueryClient();

export function ComfyDeployProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}