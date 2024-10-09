"use client";

import { useState, useEffect, useCallback } from "react";
import { cd, useComfyQuery } from "./hooks/hooks";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Kbd } from "@nextui-org/kbd";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/navbar";
import { GithubIcon } from "lucide-react";
import { ThemeSwitcher } from "./components/theme-switcher";
import { ScrollableContent } from "./components/scrollable-content";
import { OutputDisplay } from "./components/output-display";
import { InputForm } from "./components/input-form";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { useInputStore, useOutputStore } from "./store/store";
import { Icon } from "./components/cd-icon";
import { DeploymentModel } from "comfydeploy/models/components";
import { create } from "zustand";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@nextui-org/skeleton";

export default function Home() {
	return (
		<>
			<Navbar isBordered maxWidth="full" height="40px">
				<NavbarBrand>
					<p className="font-bold text-inherit flex items-center gap-2">
						<Icon /> Comfy Playground
					</p>
				</NavbarBrand>
				<NavbarContent justify="end">
					<NavbarItem>
						<ThemeSwitcher />
					</NavbarItem>
					<NavbarItem>
						<Button
							as="a"
							color="default"
							size="sm"
							href="https://github.com/comfy-deploy/comfy-playground"
							target="_blank"
							variant="flat"
							isIconOnly
							className="rounded-full"
						>
							<GithubIcon size={16} />
						</Button>
					</NavbarItem>
				</NavbarContent>
			</Navbar>
			<div className="items-center justify-items-center min-h-screen pb-20 gap-16  font-[family-name:var(--font-geist-sans)]">
				<App />
			</div>
		</>
	);
}

function App() {
	const { selectedDeployment } = useDeploymentStore();

	// Use the Zustand stores
	const { outputs, addOutput, clearOutputs } = useOutputStore();
	// const { inputValues, setInputValue, setAllInputValues } = useInputStore();

	const [isRunning, setIsRunning] = useState(false);
	const [log, setLog] = useState<string[]>([]);
	const [output, setOutput] = useState<string[]>([]);
	const [inputValues, setInputValues] = useState<Record<string, any>>({});

	const handleRun = useCallback(async () => {
		if (selectedDeployment) {
			console.log(`Running deployment: ${selectedDeployment.id}`);
			setIsRunning(true);
			setLog([]);
			clearOutputs(); // Clear previous outputs
			try {
				console.log(inputValues);

				const stream = await cd.run.stream({
					deploymentId: selectedDeployment.id,
					inputs: inputValues,
				});

				for await (const chunk of stream) {
					if (chunk.event === "log_update") {
						setLog((prevLog) => [...prevLog, chunk.data.logs]);
					} else if (chunk.event === "event_update") {
						if (chunk.data.event === "executed") {
							addOutput(chunk.data.data); // Add new output to the store
						}
					}
				}
			} catch (error) {
				console.error("Error running deployment:", error);
				setLog((prevLog) => [...prevLog, "Error: Failed to run deployment"]);
			} finally {
				setIsRunning(false);
			}
		}
	}, [selectedDeployment, inputValues, clearOutputs, addOutput]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
				event.preventDefault();
				handleRun();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleRun]);

	const isMac =
		typeof window !== "undefined" &&
		navigator.platform.toUpperCase().indexOf("MAC") >= 0;

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="flex flex-col">
					<CardHeader className="flex flex-col gap-2">
						<DeploymentDropdown />
					</CardHeader>
					<Divider />
					{selectedDeployment && (
						<CardBody className="flex-grow flex flex-col">
							<InputForm
								inputTypes={selectedDeployment.inputTypes ?? []}
								inputValues={inputValues}
								setInputValues={setInputValues} // Use the store's setAllInputValues
							/>
							<div className="flex-grow" />
							<div className="mt-6">
								<Button
									color="primary"
									onClick={handleRun}
									className="w-full"
									size="md"
									isLoading={isRunning}
								>
									{isRunning ? "Running..." : "Run"}
									<Kbd
										keys={isMac ? ["command", "enter"] : ["ctrl", "enter"]}
									/>
								</Button>
							</div>
						</CardBody>
					)}
				</Card>

				<div className="space-y-6">
					<ScrollableContent title="Log" content={log} />
					<OutputDisplay outputs={outputs} /> {/* Use outputs from the store */}
				</div>
			</div>
		</div>
	);
}

interface DeploymentState {
	selectedDeployment: DeploymentModel | null;
	setSelectedDeployment: (deployment: DeploymentModel | null) => void;
}

const useDeploymentStore = create<DeploymentState>((set) => ({
	selectedDeployment: null,
	setSelectedDeployment: (deployment) =>
		set({ selectedDeployment: deployment }),
}));

function DeploymentDropdown() {
	const { data: deployments, isLoading } = useComfyQuery(
		"deployments",
		"list",
		[{ environment: "production" }],
	);

	const { selectedDeployment, setSelectedDeployment } = useDeploymentStore();

	// Auto-select the first deployment if available
	useEffect(() => {
		if (deployments && deployments.length > 0 && !selectedDeployment) {
			setSelectedDeployment(deployments[0]);
		}
	}, [deployments, selectedDeployment, setSelectedDeployment]);

	if (isLoading) {
		return (
			<Skeleton className="w-full rounded-lg">
				<div className="h-8 w-full rounded-lg bg-secondary" />
			</Skeleton>
		);
	}

	if (!deployments || deployments.length === 0) {
		return <p>No deployments available.</p>;
	}

	return (
		<Autocomplete
			// label="Select a deployment"
			placeholder="Search and choose a deployment"
			defaultSelectedKey={deployments[0].id}
			size="sm"
			onSelectionChange={(key) =>
				setSelectedDeployment(
					deployments.find((deployment) => deployment.id === key) ?? null,
				)
			}
			defaultItems={deployments.map((deployment) => ({
				key: deployment.id,
				label: deployment.workflow.name,
			}))}
		>
			{(item) => (
				<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
