import { Link } from "react-router-dom";

const designers = [
  { name: "Masaki", role: "UI/UX Designer", philosophy: "業界をリサーチし、クライアントと並走する" },
  { name: "Kohno", role: "Web Designer", philosophy: "ブランドの本質を伝える機能的デザイン" },
  { name: "Tanaka", role: "AI Designer", philosophy: "テクノロジーと人間中心設計の融合" },
  { name: "Suzuki", role: "Creative Director", philosophy: "ビジネス課題をクリエイティブで解決する" },
  { name: "Yamada", role: "Brand Director", philosophy: "一貫したブランド体験の設計" },
  { name: "Sato", role: "Graphic Designer", philosophy: "ビジュアルで感情を動かすデザイン" },
];

const steps = [
  { num: "01", title: "ヒアリング", desc: "専任コーディネーターがニーズを詳しくお伺いします" },
  { num: "02", title: "ご提案", desc: "要件に最適なデザイナー候補をご紹介" },
  { num: "03", title: "選考・面談", desc: "候補者との面談で相性を確認" },
  { num: "04", title: "契約・稼働", desc: "プラットフォームが契約を仲介し、スムーズに稼働開始" },
];

const faqs = [
  { q: "どんなデザイナーがいますか？", a: "UX/UIデザイナー、AIデザイナー、CDO、クリエイティブディレクター、ブランドディレクター、グラフィックデザイナー、映像クリエイターなど、幅広い専門領域のデザイナーが在籍しています。" },
  { q: "スコープの整理もサポートしてもらえますか？", a: "はい。専任のコーディネーターが要件整理からサポートいたします。" },
  { q: "長期的な関与は可能ですか？", a: "はい。プロジェクト単位から長期的なパートナーシップまで柔軟に対応可能です。" },
  { q: "契約前にデザイナーと相談できますか？", a: "はい。契約前にデザイナーとの面談が可能です。" },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-primary">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-28 pb-16 sm:pb-24 text-center">
          <p className="type-label-lg text-white/80 mb-4">
            即戦力フリーランス・副業デザイナー マッチングサービス
          </p>
          <h1 className="type-display-sm sm:type-display-lg text-white max-w-4xl mx-auto">
            最先端のトップデザイナー
            <br />
            <span className="text-white">
              との出逢いを。
            </span>
          </h1>
          <p className="mt-6 type-body-lg text-white/70 max-w-2xl mx-auto">
            厳選された即戦力デザイナーが、あなたのビジネスにデザインの力を。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-14 items-center rounded-2xl px-10 type-title-md text-primary bg-white transition-all hover:opacity-90 elevation-3"
            >
              無料で始める
            </Link>
            <a
              href="#about"
              className="inline-flex h-14 items-center rounded-2xl px-10 type-title-md text-white border border-white/30 transition-all hover:bg-white/10"
            >
              詳しく見る
            </a>
          </div>

          {/* Metrics */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div>
              <p className="type-display-sm text-white">5%</p>
              <p className="type-label-sm text-white/70 mt-1">審査通過率</p>
            </div>
            <div>
              <p className="type-display-sm text-white">3,000+</p>
              <p className="type-label-sm text-white/70 mt-1">累計アサイン</p>
            </div>
            <div>
              <p className="type-display-sm text-white">当日</p>
              <p className="type-label-sm text-white/70 mt-1">最速稼働</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-surface-container-low py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div>
              <p className="type-headline-lg text-on-surface">500+</p>
              <p className="type-body-sm text-on-surface-variant">取引先企業</p>
            </div>
            <div>
              <p className="type-headline-lg text-on-surface">90%+</p>
              <p className="type-body-sm text-on-surface-variant">継続率</p>
            </div>
          </div>
          <blockquote className="mt-8 type-body-lg text-on-surface-variant italic max-w-2xl mx-auto">
            "体制は変えないまま、デザイン施策をスピーディーに回すことができた"
          </blockquote>
        </div>
      </section>

      {/* About - Services */}
      <section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="type-headline-lg text-on-surface">JOOiの活用</h2>
            <p className="mt-2 type-body-md text-on-surface-variant">
              3つのサービスで、あらゆるデザインニーズに対応
            </p>
          </div>
          <div id="services" className="grid gap-6 sm:grid-cols-3">
            {[
              { title: "デザイナー探し", desc: "厳選されたデザイナーの中から、最適な人材を検索・マッチング", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
              { title: "制作依頼", desc: "特定の成果物の制作を、実績あるデザイナーに直接依頼", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.764m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
              { title: "専門家相談", desc: "戦略的なデザインガイダンスを、経験豊富な専門家に相談", icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
            ].map((s) => (
              <div key={s.title} className="rounded-2xl bg-surface-container-low p-6 sm:p-8 elevation-1 hover:elevation-3 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-primary mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
                <h3 className="type-title-lg text-on-surface">{s.title}</h3>
                <p className="mt-2 type-body-md text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Profiles */}
      <section className="py-16 sm:py-24 bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="type-headline-lg text-on-surface">在籍デザイナー</h2>
            <p className="mt-2 type-body-md text-on-surface-variant">
              UX/UI、AI、CDO、クリエイティブディレクターなど多彩な専門領域
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designers.map((d) => (
              <div key={d.name} className="rounded-xl bg-surface p-5 sm:p-6 elevation-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-surface-container-high flex items-center justify-center type-title-sm text-on-surface">
                    {d.name[0]}
                  </div>
                  <div>
                    <p className="type-title-sm text-on-surface">{d.name}</p>
                    <p className="type-label-sm text-on-surface-variant">{d.role}</p>
                  </div>
                </div>
                <p className="type-body-sm text-on-surface-variant italic">"{d.philosophy}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="type-headline-lg text-on-surface">ご利用の流れ</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white type-title-lg mb-4">
                  {s.num}
                </div>
                <h3 className="type-title-md text-on-surface">{s.title}</h3>
                <p className="mt-2 type-body-sm text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-surface-container-low">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="type-headline-lg text-on-surface">よくある質問</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl bg-surface p-5 elevation-1">
                <summary className="type-title-sm text-on-surface cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-on-surface-variant transition-transform group-open:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <p className="mt-3 type-body-md text-on-surface-variant">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 gradient-primary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="type-headline-lg text-white">
            最高のデザイナーと、
            <br />
            <span className="text-white">今すぐ出逢う</span>
          </h2>
          <p className="mt-4 type-body-lg text-white/70">
            まずは無料登録から。あなたのニーズに最適なデザイナーをご紹介します。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-14 items-center rounded-2xl px-10 type-title-md text-primary bg-white transition-all hover:opacity-90 elevation-3"
            >
              無料で登録する
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-14 items-center rounded-2xl px-10 type-title-md text-white border border-white/30 transition-all hover:bg-white/10"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img
              src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
              alt="JOOi"
              className="h-5 w-auto"
            />
            <div className="flex items-center gap-6 type-label-sm text-on-surface-variant">
              <a href="#" className="hover:text-on-surface transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-on-surface transition-colors">利用規約</a>
              <span>info@libase.jp</span>
            </div>
          </div>
          <p className="mt-4 text-center type-label-sm text-on-surface-variant">
            &copy; Libase Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
