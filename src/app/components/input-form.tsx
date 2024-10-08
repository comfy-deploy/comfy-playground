"use client";

import type React from "react";
import { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Slider } from "@nextui-org/slider";
import { Tooltip } from "@nextui-org/tooltip";
import type { InputModel } from "comfydeploy/models/components";
import { ImagePicker } from "./image-picker";

interface InputFormProps {
	inputTypes: InputModel[];
	inputValues: Record<string, any>;
	setInputValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function InputForm({
	inputTypes,
	inputValues,
	setInputValues,
}: InputFormProps) {
	useEffect(() => {
		const initialValues =
			inputTypes?.reduce(
				(acc, input) => {
					acc[input.inputId] = input.defaultValue;
					return acc;
				},
				{} as Record<string, any>,
			) ?? {};
		setInputValues(initialValues);
	}, [inputTypes, setInputValues]);

	const handleInputChange = (inputId: string, value: any) => {
		console.log("value", value);
		setInputValues((prev) => ({ ...prev, [inputId]: value }));
	};

	const renderInput = (input: InputModel) => {
		switch (input.classType) {
			case "ComfyUIDeployExternalText":
				return (
					<Input
						label={input.displayName || input.inputId}
						placeholder={String(input.defaultValue)}
						value={inputValues[input.inputId] || ""}
						onValueChange={(e) => handleInputChange(input.inputId, e)}
						type="text"
						className="w-full"
						labelPlacement="outside"
					/>
				);
			case "ComfyUIDeployExternalNumberInt":
				return (
					<Input
						label={input.displayName || input.inputId}
						placeholder={String(input.defaultValue)}
						value={inputValues[input.inputId] || ""}
						onChange={(e) =>
							handleInputChange(input.inputId, Number.parseInt(e.target.value))
						}
						type="number"
						className="w-full"
						labelPlacement="outside"
					/>
				);
			case "ComfyUIDeployExternalNumber":
				return (
					<Input
						label={input.displayName || input.inputId}
						placeholder={String(input.defaultValue)}
						value={inputValues[input.inputId] || ""}
						onChange={(e) =>
							handleInputChange(
								input.inputId,
								Number.parseFloat(e.target.value),
							)
						}
						type="number"
						step="0.01"
						className="w-full"
						labelPlacement="outside"
					/>
				);
			case "ComfyUIDeployExternalBoolean":
				return (
					<Checkbox
						isSelected={inputValues[input.inputId]}
						onValueChange={(checked) =>
							handleInputChange(input.inputId, checked)
						}
					>
						{input.displayName || input.inputId}
					</Checkbox>
				);
			case "ComfyUIDeployExternalNumberSlider":
				return (
					<Slider
						size="sm"
						label={input.displayName || input.inputId}
						step={input.step ?? 0.01}
						maxValue={input.maxValue ?? 100}
						minValue={input.minValue ?? 0}
						value={inputValues[input.inputId] as unknown as number}
						onChange={(value) => handleInputChange(input.inputId, value)}
					/>
				);
			case "ComfyUIDeployExternalImage":
				return (
					<ImagePicker
						label={input.displayName || input.inputId}
						value={inputValues[input.inputId]}
						onChange={(value) => handleInputChange(input.inputId, value)}
					/>
				);
			default:
				return (
					<Input
						label={input.displayName || input.inputId}
						placeholder={String(input.defaultValue)}
						value={inputValues[input.inputId] || ""}
						onChange={(e) => handleInputChange(input.inputId, e.target.value)}
						type="text"
						className="w-full"
						labelPlacement="outside"
					/>
				);
		}
	};

	return (
		<div className="mt-1">
			<h3 className="text-lg font-semibold mb-4">Input Parameters</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{inputTypes?.map((input) => (
					<Tooltip
						key={input.inputId}
						content={`${input.description || "No description available"}\n ${input.type}`}
						placement="top"
					>
						<div>{renderInput(input)}</div>
					</Tooltip>
				))}
			</div>
		</div>
	);
}
