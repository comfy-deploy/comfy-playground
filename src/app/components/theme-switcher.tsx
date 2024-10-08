// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/switch";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Switch
			defaultSelected={theme === "dark"}
			size="md"
			color="secondary"
			startContent={<Sun size={18} />}
			endContent={<Moon size={18} />}
			onValueChange={(isSelected) => {
				console.log("isSelected", isSelected);
				setTheme(isSelected ? "dark" : "light");
			}}
		/>
	);
}
