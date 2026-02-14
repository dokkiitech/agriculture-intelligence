import Link from "next/link";

const items = [
  ["/", "ホーム"],
  ["/photos", "写真投稿"],
  ["/timeline", "タイムライン"],
  ["/health", "健全度"],
  ["/diagnosis", "病害虫診断"],
  ["/knowledge", "作物知識"],
  ["/kids", "キッズ達成"],
] as const;

export default function AppNav() {
  return (
    <nav className="card nav">
      {items.map(([href, label]) => (
        <Link key={href} href={href} className="nav-link">
          {label}
        </Link>
      ))}
    </nav>
  );
}
