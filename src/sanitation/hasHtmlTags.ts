export function hasHtmlTags(input: string): boolean {
	if (input.match(/<[\s\S]*?>/)) return true;
	return false;
}
