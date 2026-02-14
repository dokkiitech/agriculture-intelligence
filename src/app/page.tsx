import AppNav from "@/components/AppNav";

export default function HomePage() {
  return (
    <main className="app theme-garden">
      <header className="card">
        <h1>家庭菜園AIモック（MVP）</h1>
        <p>画面を機能ごとに分割したアプリ構成です。下のメニューから移動してください。</p>
      </header>

      <AppNav />

      <section className="card">
        <h2>SCR-001 ホーム / ダッシュボード</h2>
        <ul>
          <li>今日の作業: 葉裏チェックと水やり判断</li>
          <li>通知: 朝 07:00 / 夕方 18:00</li>
          <li>MVP対象作物: トマト・きゅうり・いちご</li>
        </ul>
      </section>
    </main>
  );
}
