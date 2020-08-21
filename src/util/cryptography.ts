import sha from "sha.js";

export function parseSha256(input: any): string {
	return sha("sha256")
		.update(input + "")
		.digest("hex");
}
