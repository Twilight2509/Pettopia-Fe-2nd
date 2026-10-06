import type { Post } from "@/services/communication/communicationService";

const TAG_DISPLAY_MAP: Record<string, string> = {
  thongbao: "Thông báo",
  gopy: "Góp ý",
  tintuc: "Tin tức iNet",
  review: "Review sản phẩm",
  chiase: "Chia sẻ kiến thức",
  tuvan: "Tư vấn cấu hình",
};

export const getTagDisplayName = (tagId: string): string => {
  return TAG_DISPLAY_MAP[tagId.toLowerCase()] || tagId;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getLikedUsersText = (post: Post | null) => {
  if (!post) return "";
  const likesList = Array.isArray(post.likes)
    ? post.likes.map((l: any) => (typeof l === "object" && l?.author?.fullname ? l.author.fullname : "")).filter(Boolean)
    : [];

  if (likesList.length === 0) return `${post.likeCount} người`;
  if (likesList.length === 1) return likesList[0];
  if (likesList.length === 2) return `${likesList[0]} và ${likesList[1]}`;
  return `${likesList[0]}, ${likesList[1]} và ${post.likeCount - 2} người khác`;
};
