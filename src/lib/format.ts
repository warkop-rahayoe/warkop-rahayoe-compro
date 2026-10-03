const rupiah = new Intl.NumberFormat('id-ID');

export function formatRupiah(value: number): string {
  return `Rp ${rupiah.format(value)}`;
}

export function waLink(nomor: string): string {
  return `https://wa.me/${nomor}`;
}
