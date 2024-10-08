import { create } from "zustand";

interface OutputState {
	outputs: any[];
	addOutput: (output: any) => void;
	clearOutputs: () => void;
}

interface InputState {
	inputValues: Record<string, any>;
	setInputValue: (key: string, value: any) => void;
	setAllInputValues: (values: Record<string, any>) => void;
}

export const useOutputStore = create<OutputState>((set) => ({
	outputs: [],
	addOutput: (output) =>
		set((state) => ({ outputs: [...state.outputs, output] })),
	clearOutputs: () => set({ outputs: [] }),
}));

export const useInputStore = create<InputState>((set) => ({
	inputValues: {},
	setInputValue: (key, value) =>
		set((state) => ({
			inputValues: { ...state.inputValues, [key]: value },
		})),
	setAllInputValues: (values) => set({ inputValues: values }),
}));
