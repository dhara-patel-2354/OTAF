import { Instagram } from 'lucide-react';
import sfuChangLogo from '../assets/sfu-chang-placeholder.svg';

export default function Footer() {
  return (
    <footer className="mt-5 bg-that-accentDark text-white">
      <div className="mx-auto max-w-[1512px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">
              We are proud client of
            </p>
            <img
              className="mt-4 h-auto w-full max-w-60 rounded-lg border border-white/20 bg-white p-1 shadow-lg"
              src={sfuChangLogo}
              alt="SFU Chang Institute"
            />
          </section>

          <section>
            <h2 className="text-lg font-extrabold">Contact Us</h2>
            <a
              className="mt-4 block text-sm font-semibold text-white/82 transition hover:text-white"
              href="mailto:info@techalonglabs.com"
            >
              info@techalonglabs.com
            </a>
            <a
              className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 text-white transition hover:bg-white/10"
              href="#"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" strokeWidth={2.2} />
            </a>
          </section>

          <section>
            <h2 className="text-lg font-extrabold">Navigation</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold text-white/82">
              <a className="block transition hover:text-white" href="#">
                About Us
              </a>
              <a className="block transition hover:text-white" href="#">
                Donate
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold">Projects</h2>
            <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-white/82">
              <a className="block transition hover:text-white" href="#">
                One Tap Away Chatbot
              </a>
              <a className="block transition hover:text-white" href="#">
                Transition House Availability Tracker
              </a>
            </div>
          </section>
        </div>

        <p className="mt-10 max-w-full overflow-hidden text-[clamp(3.4rem,12vw,11rem)] font-black leading-[0.82] tracking-normal text-white/18">
          TechAlong Labs
        </p>
      </div>
    </footer>
  );
}
