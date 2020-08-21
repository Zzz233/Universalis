export function removeUnsafeCharacters(input: string): string {
	return input.replace(
		/[^a-zA-Z0-9'\- ·⺀-⺙⺛-⻳⼀-⿕々〇〡-〩〸-〺〻㐀-䶵一-鿃豈-鶴侮-頻並-龎]/gu,
		"",
	);
}
