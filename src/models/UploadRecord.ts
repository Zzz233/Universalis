export interface UploadRecord {
	timestamp: number;
	worldID: number;
	sourceName: string;
	uploaderID: string;

	itemID?: number;
	contentID?: number;
}
