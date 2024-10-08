"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Code } from "@nextui-org/code";

interface ScrollableContentProps {
	title: string;
	content: string[];
}

export function ScrollableContent({ title, content }: ScrollableContentProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTop = contentRef.current.scrollHeight;
		}
	}, [content]);

	return (
		<Card>
			<CardHeader>
				<Chip variant="flat">{title}</Chip>
			</CardHeader>
			<CardBody>
				<ScrollShadow className="h-64" ref={contentRef}>
					<Code className="whitespace-pre-wrap min-h-64 w-full">
						{content.length > 0 ? (
							<div>{content.join("\n")}</div>
						) : (
							<div>No data</div>
						)}
					</Code>
				</ScrollShadow>
			</CardBody>
		</Card>
	);
}
