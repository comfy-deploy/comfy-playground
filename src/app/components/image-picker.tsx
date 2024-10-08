"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Upload } from "lucide-react";
import { cd } from "../hooks/hooks";

interface ImagePickerProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
}

export function ImagePicker({ label, value, onChange }: ImagePickerProps) {
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const url = event.target.value;
		onChange(url);
		if (url && !isValidUrl(url)) {
			setError("Please enter a valid URL");
			setPreview(null);
		} else {
			setError(null);
			setPreview(url || null);
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploading(true);
			setError(null);
			try {
				const reader = new FileReader();
				reader.onloadend = () => {
					const base64String = reader.result as string;
					setPreview(base64String);
				};
				reader.readAsDataURL(file);

				const response = await cd.file.upload({
					file: file,
				});

				console.log(response);
				onChange(response.fileUrl);
			} catch (error) {
				console.error("Error uploading file:", error);
				setError("Failed to upload image. Please try again.");
			} finally {
				setIsUploading(false);
			}
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="text-sm font-medium">{label}</label>
			<div className="flex gap-2">
				<Input
					type="url"
					placeholder="Enter image URL"
					value={value}
					onChange={handleUrlChange}
					className="flex-grow"
					color={error ? "danger" : "default"}
					errorMessage={error}
					isDisabled={isUploading}
				/>
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
					id={`image-upload-${label}`}
					disabled={isUploading}
				/>
				<Button
					as="label"
					htmlFor={`image-upload-${label}`}
					variant="flat"
					startContent={<Upload size={14} />}
					isLoading={isUploading}
				/>
			</div>
			{preview && (
				<Card className="mt-2">
					<CardBody>
						<img
							src={preview}
							alt="Preview"
							width={200}
							height={200}
							className="mx-auto"
						/>
					</CardBody>
				</Card>
			)}
			{isUploading && (
				<p className="text-sm text-blue-500 mt-2">Uploading image...</p>
			)}
		</div>
	);
}
