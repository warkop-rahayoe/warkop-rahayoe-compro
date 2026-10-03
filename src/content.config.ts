import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const site = defineCollection({
  loader: glob({ pattern: 'site.md', base: './content' }),
  schema: z.object({
    nama: z.string(),
    tagline: z.string(),
    alamat: z.string(),
    jam_buka: z.string(),
    whatsapp: z.string(),
    instagram: z.string(),
    google_maps: z.string(),
  }),
});

const menu = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/menu' }),
  schema: z.object({
    nama: z.string(),
    kategori: z.string(),
    harga: z.number(),
    gambar: z.string(),
    urutan: z.number().default(999),
    aktif: z.boolean().default(true),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({
    judul: z.string(),
  }),
});

const galeri = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/galeri' }),
  schema: z.object({
    src: z.string(),
    alt: z.string(),
    ukuran: z.enum(['normal', 'tall', 'wide']).default('normal'),
    urutan: z.number().default(999),
  }),
});

export const collections = { site, menu, pages, galeri };
