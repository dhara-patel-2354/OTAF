import { Instagram } from 'lucide-react';
import sfuChangLogo from '../assets/chang-logo.png';

export default function Footer() {
  return (
    <footer className="bg-that-accentDark text-white">
      <div className="mx-auto max-w-[1512px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-white/70">
              We are proud client of
            </p>
            <img
              className="mt-2 h-auto w-full max-w-48 rounded-lg"
              style={{ mixBlendMode: 'screen' }}
              src={sfuChangLogo}
              alt="SFU Chang Institute"
            />
          </section>

          <section>
            <h2 className="text-base font-extrabold">Contact Us</h2>
            <a
              className="mt-2 block text-sm font-semibold text-white/82 transition hover:text-white"
              href="mailto:info@techalonglabs.com"
            >
              info@techalonglabs.com
            </a>
            <a
              className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/25 text-white transition hover:bg-white/10"
              href="#"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </section>

          <section>
            <h2 className="text-base font-extrabold">Navigation</h2>
            <div className="mt-2 space-y-1.5 text-sm font-semibold text-white/82">
              <a className="block transition hover:text-white" href="#">
                About Us
              </a>
              <a className="block transition hover:text-white" href="#">
                Donate
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-base font-extrabold">Projects</h2>
            <div className="mt-2 space-y-1.5 text-sm font-semibold text-white/82">
              <a className="block transition hover:text-white" href="#">
                One Tap Away Chatbot
              </a>
              <a className="block transition hover:text-white" href="#">
                Transition House Availability Tracker
              </a>
            </div>
          </section>
        </div>

        <p
          className="mt-4 w-full text-center text-[clamp(1.8rem,5vw,4.4rem)] leading-none text-white"
          style={{ fontWeight: 500, letterSpacing: '0.35em' }}
        >
          TechAlong Labs
        </p>
      </div>
    </footer>
  );
}
