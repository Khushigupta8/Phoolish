import { z } from "zod";

export const MAX_INSTAGRAM_POSTS = 12;

export const instagramInput = z.object({
  image: z.string().trim().min(1, "Upload a photo first."),
  caption: z.string().trim().max(160).optional().or(z.literal("")),
  link: z
    .string()
    .trim()
    .url("Paste the full post link, starting with https://")
    .optional()
    .or(z.literal("")),
});

export type InstagramInput = z.infer<typeof instagramInput>;

export const instagramPatch = z.object({
  caption: z.string().trim().max(160).optional().or(z.literal("")),
  link: z
    .string()
    .trim()
    .url("Paste the full post link, starting with https://")
    .optional()
    .or(z.literal("")),
  position: z.number().int().min(0).max(999).optional(),
});

export type InstagramPatch = z.infer<typeof instagramPatch>;

export type InstagramPost = {
  id: string;
  image: string;
  caption: string;
  link: string;
  position: number;
};
