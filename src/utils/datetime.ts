/**
 * 时间处理
 */
import { siteConfig } from "~/site.config";
import moment from "moment";

export function FormatDateTime(
	date: string | number | Date,
	formatOpt: string
) {
	return moment(date).format(formatOpt);
}
