export function encodeMailto(url: string): string {
	return Buffer.from(url.replace("mailto:", "")).toString("base64");
}

export const MAILTO_ONCLICK_SCRIPT =
	"(function(){var e=this.getAttribute('data-encoded-email');this.href='mailto:'+atob(e);this.removeAttribute('data-encoded-email');this.removeAttribute('onclick');this.click();return false;}).call(this);";
