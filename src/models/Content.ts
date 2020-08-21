import { OriginRecord } from "./OriginRecord";

export interface Content extends OriginRecord {
	_key: string;
	contentID: string;
	contentType: string;
	content: any;
}
