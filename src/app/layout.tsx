import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "家庭菜園AIモック",
  description: "仕様書ベースの家庭菜園支援MVPモック",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
