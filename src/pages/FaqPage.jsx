import { HelpCircle } from 'lucide-react';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import { faqItems } from '../data/publicInfo.js';

export default function FaqPage() {
  return (
    <div className="flex h-[111.12vh] flex-col overflow-hidden bg-that-page text-that-text">
      <Navbar title="FAQ" />

      <main className="mx-auto flex min-h-0 w-full max-w-[1512px] flex-1 px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <section className="w-full flex-1 rounded-lg border border-that-border bg-white p-4 shadow-card sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-that-soft text-that-accent">
              <HelpCircle className="h-6 w-6" strokeWidth={2.3} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-that-text">FAQ</h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-that-muted">
                Practical answers for using the transition house availability dashboard safely.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {faqItems.map((item) => (
              <article
                className="rounded-lg border border-that-border bg-that-card p-4 shadow-card"
                key={item.question}
              >
                <h2 className="text-base font-extrabold leading-6 text-that-text">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm font-medium leading-6 text-that-muted">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
