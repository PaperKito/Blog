import type { GalleryConfig } from "@/types/galleryConfig";

export const galleryConfig: GalleryConfig = {

	albums: [

		{
			id: "photos-2026",
			name: "我的相册",
			description: "一些随手记录的照片。",
			location: "崩坏：星穹铁道",
			date: "2026-01-01",
			tags: ["崩坏星穹铁道", "流萤"],
		},
		{
			id: "encrypted-test",
			name: "加密相册示例",
			description:
				"这是一个加密相册的示例，设置了访问密码，只有输入正确的密码才能查看相册内容。",
			location: "崩坏：星穹铁道",
			date: "2026-02-01",
			tags: ["加密相册", "示例"],
			password: "123456",
			passwordHint: "示例密码123456",
		},
	],

	columnWidth: 240,
};
