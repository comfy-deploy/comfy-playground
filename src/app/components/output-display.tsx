"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Code } from "@nextui-org/code";
import Image from "next/image";

interface OutputDisplayProps {
	outputs: any[];
}

export function OutputDisplay({ outputs }: OutputDisplayProps) {
	return (
		<Card>
			<CardHeader>
				<Chip variant="flat">Output</Chip>
			</CardHeader>
			<CardBody>
				<ScrollShadow className="h-64">
					{[...outputs].reverse().map((data, index) => {
						const output = data.output;
						return (
							<div key={`output-${index}`} className="mb-4">
								<p className="font-semibold mb-2">
									Execution {outputs.length - index}
								</p>
								{output.images && output.images.length > 0 ? (
									<div className="grid grid-cols-2 gap-4">
										{output.images.map((image: any, imgIndex: number) => (
											<div
												key={`image-${imgIndex}`}
												className="flex flex-col items-center"
											>
												<Image
													src={image.url}
													alt={image.filename}
													width={200}
													height={200}
													className="rounded-lg"
												/>
												<p className="mt-2 text-sm">{image.filename}</p>
											</div>
										))}
									</div>
								) : (
									<Code className="whitespace-pre-wrap">
										{JSON.stringify(output, null, 2)}
									</Code>
								)}
							</div>
						);
					})}
				</ScrollShadow>
			</CardBody>
		</Card>
	);
}
