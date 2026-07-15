const AboutPage = () => {
  return (
    <div className="page-shell">
      <section className="hero-card items-start">
        <div className="max-w-3xl">
          <p className="eyebrow">About Eden&apos;s Bloom</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            We turn floral moments into lasting memories.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Eden&apos;s Bloom is a boutique floral studio focused on thoughtful,
            hand-designed bouquets that feel personal, rich, and beautifully
            arranged.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="section-title">Our philosophy</h2>
          <p className="mt-4 text-slate-600 leading-7">
            Every bouquet is made with a balance of artistry and intention. We
            curate flowers that speak to the personality of the recipient and
            the mood of the occasion.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="section-title">What we offer</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>• Signature arrangements for celebrations and gifting.</li>
            <li>• Custom bundle options for a premium finishing touch.</li>
            <li>• Friendly support for special requests and seasonal edits.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
