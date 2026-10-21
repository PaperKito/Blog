import type { FriendLink, FriendsPageConfig } from "../types/friendsConfig";

export const friendsPageConfig: FriendsPageConfig = {

	title: "",

	description: "",

	showCustomContent: true,

	showComment: true,

	randomizeSort: false,
};

export const friendsConfig: FriendLink[] = [

	{
		title: "Firefly",
		imgurl: "https://docs-firefly.cuteleaf.cn/logo.png",
		desc: "本站使用的 Astro 博客主题",
		siteurl: "https://github.com/CuteLeaf/Firefly",
		tags: ["Theme"],
		weight: 10,
		enabled: false,
	},
];

export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
