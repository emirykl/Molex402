import { motion } from 'motion/react'
import SplitText from './bits/SplitText'
import CountUp from './bits/CountUp'
import ClickSpark from './bits/ClickSpark'
import AnimatedContent from './bits/AnimatedContent'
import StickyParts from './sections/StickyParts'
import HeroIntro from './sections/HeroIntro'

const REPO = 'https://github.com/emirykl/Molex402'
const BEAVER = 'https://github.com/emirykl/Beaver402'
const RFP = 'https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track'
const CONTRACT =
  'https://stellar.expert/explorer/testnet/contract/CBPE37HQ6CHIKB7F3OFU2BIDAQOLB3QZD2DAO5Y6F6DKUSHLW2JZTX2S'
const TX1 =
  'https://stellar.expert/explorer/testnet/tx/19d9c4e4f519e4ab9971c394a6338d9a82b83287f3e90d648ef3e15c49a1219a'
const TX2 =
  'https://stellar.expert/explorer/testnet/tx/61e6485c8ef7df96b92ada8c79687acc69d8ea1b5d307d952d9b9efcab259b48'

/* ---------------------------------------------------------------- pieces */

/** Plays once, the first time the block is scrolled into view. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Head({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <AnimatedContent distance={36} duration={0.6} threshold={0.15}>
      <div>
        <span className="box inline-block bg-acid px-3 py-1.5 font-mono text-[12px] font-bold tracking-[0.14em] uppercase">
          {kicker}
        </span>
      </div>
      {/* SplitText renders inline-block and centres by default, so it needs its
          own block wrapper and an explicit left alignment */}
      <div className="mt-6">
        <SplitText
          tag="h2"
          text={title}
          textAlign="left"
          className="max-w-[22ch] pb-1 text-[36px] leading-[1.02] tracking-[-0.02em] sm:text-[54px]"
          splitType="words"
          delay={32}
          duration={0.55}
          ease="power4.out"
          from={{ opacity: 0, y: 28 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.15}
        />
      </div>
      {lede && (
        <p className="mt-6 max-w-[56ch] text-[16.5px] leading-relaxed text-black/70">{lede}</p>
      )}
    </AnimatedContent>
  )
}

/* ------------------------------------------------------------------ page */

export default function App() {
  return (
    <ClickSpark sparkColor="#000000" sparkSize={13} sparkRadius={22} sparkCount={8} duration={380}>
      <div className="min-h-screen">
        <HeroIntro />

        {/* ============================================== intro band */}
        <section className="border-b-[3px] border-black bg-black px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-[1240px] gap-6 sm:grid-cols-3 sm:gap-8">
            {[
              {
                k: 'WHAT IT IS',
                t: 'An open source x402 facilitator and Bazaar for Stellar.',
                fill: 'bg-acid',
                rot: -2.4,
              },
              {
                k: 'WHAT IT DOES',
                t: 'Agents find paid HTTP and MCP services, pay in USDC, and check the response against the payment.',
                fill: 'bg-white',
                rot: 1.8,
              },
              {
                k: 'WHERE IT RUNS',
                t: 'Stellar testnet and pubnet. Apache 2.0, built for SCF #45.',
                fill: 'bg-white',
                rot: -1.4,
              },
            ].map((c, i) => (
              <AnimatedContent key={c.k} distance={40} duration={0.6} delay={i * 0.09}>
                <div
                  className={`box h-full p-6 sm:p-8 ${c.fill}`}
                  style={{ transform: `rotate(${c.rot}deg)` }}
                >
                  <span className="font-mono text-[12px] font-bold tracking-[0.16em]">{c.k}</span>
                  <p className="mt-3 text-[17px] leading-tight font-semibold sm:text-[21px]">
                    {c.t}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </section>

        {/* ============================================== the gap */}
        <section id="gap" className="border-y-[3px] border-black bg-white px-4 py-16 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <span className="box inline-block bg-acid px-3 py-1.5 font-mono text-[12px] font-bold tracking-[0.14em] uppercase">
                The problem
              </span>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="mt-6 max-w-[20ch] text-[36px] leading-[1.02] tracking-[-0.02em] sm:text-[56px]">
                Stellar can settle a payment. It cannot find one.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                [
                  'Nothing to search',
                  'There is no catalog, so an agent can only reach endpoints a human wired in first.',
                  true,
                ],
                [
                  'Listings are just claims',
                  'Catalogs rank on what sellers say about themselves, not on how the endpoint behaves.',
                  false,
                ],
                [
                  'Paid is not delivered',
                  'A settled payment proves money moved, not that the work ran, or ran only once.',
                  false,
                ],
              ].map(([title, body, fill], i) => (
                <Reveal key={title as string} delay={0.24 + i * 0.14}>
                  <div className={`box h-full p-6 sm:p-7 ${fill ? 'bg-acid' : 'bg-white'}`}>
                    <h3 className="tight text-[21px]">{title as string}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-black/72">{body as string}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <StickyParts />

        {/* ============================================== how */}
        <section id="how" className="border-b-[3px] border-black bg-white px-4 py-14 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Head
              kicker="The flow"
              title="Seven steps from search to receipt."
              lede="The agent never has to trust the listing. It reads the security profile before it pays, and checks the response against the payment after."
            />
            <div className="mt-12 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7">
              {[
                ['DISCOVER', 'Search the Bazaar'],
                ['BIND', 'Signed offer'],
                ['RESERVE', 'Lock the payment'],
                ['VERIFY', 'Check the auth'],
                ['SETTLE', 'Stellar finality'],
                ['EXECUTE', 'Run it once'],
                ['PROVE', 'Signed evidence'],
              ].map(([t, d], i) => (
                <AnimatedContent
                  key={t}
                  distance={26}
                  duration={0.45}
                  delay={i * 0.05}
                  className={i === 6 ? 'col-span-2 sm:col-span-1' : undefined}
                >
                  <div className={`box h-full p-3.5 sm:p-4 ${i % 2 ? 'bg-white' : 'bg-acid'}`}>
                    <span className="font-mono text-[11px] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="tight mt-2 text-[15px]">{t}</h3>
                    <p className="mt-1.5 text-[12px] leading-snug text-black/65">{d}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================== proof */}
        <section id="proof" className="relative overflow-hidden border-b-[3px] border-black bg-acid px-4 py-14 sm:px-6 sm:py-28">
          <div className="pointer-events-none absolute inset-0 flex items-end justify-end">
            <span className="giant -mr-[4vw] -mb-[3vw] text-[26vw] text-black/10">PROOF</span>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <Head
              kicker="Track record"
              title="We shipped this once already."
              lede="Beaver402 is our previous project on Stellar x402. It won a 5,000 dollar Stellar Instawards grant. It covers the same ground this RFP asks about: payment infrastructure, an MCP server, and a Soroban contract that is deployed and running."
            />

            <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {[
                ['$', 5000, 'Stellar Instawards grant'],
                ['', 142, 'Commits on a live codebase'],
                ['', 151, 'Contract and backend tests'],
                ['', 3, 'Transactions you can open'],
              ].map(([pre, val, label], i) => (
                <AnimatedContent key={label as string} distance={30} duration={0.55} delay={i * 0.07}>
                  <div className="box h-full bg-white p-4 sm:p-6">
                    <div className="font-display flex items-baseline text-[32px] leading-none sm:text-[46px] lg:text-[52px]">
                      <span>{pre as string}</span>
                      <CountUp to={val as number} duration={1.5} separator="," />
                    </div>
                    <p className="mt-3 text-[13px] leading-snug font-semibold">{label as string}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>

            <AnimatedContent distance={36} duration={0.65}>
              <div className="box mt-8 bg-white p-5 sm:p-10">
                <h3 className="tight text-[24px] sm:text-[28px]">Beaver402</h3>
                <p className="mt-4 max-w-[64ch] text-[14.5px] leading-relaxed text-black/72 sm:text-[15.5px]">
                  An agent can make a payment that is perfectly valid and still not the one the
                  account owner approved. Beaver402 closes that with two signatures. The merchant
                  signs a description of the paid request, the buyer rebuilds the same description
                  from what was actually sent, and a Soroban smart account settles only when every
                  field agrees.
                </p>

                {/* stacks on phones so the hashes never need a sideways scroll */}
                <dl className="mt-7 sm:mt-8">
                  {[
                    ['Source, threat model, test vectors', 'github.com/emirykl/Beaver402', BEAVER],
                    ['Deployed Soroban contract', 'CBPE37HQ…JZTX2S', CONTRACT],
                    ['A payment both sides agreed on', '19d9c4e4…', TX1],
                    ['An owner action signed by passkey', '61e6485c…', TX2],
                  ].map(([what, label, href]) => (
                    <div
                      key={label}
                      className="flex flex-col gap-2 border-b-2 border-black/15 py-3.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <dt className="text-[14px] font-semibold sm:text-[14.5px]">{what}</dt>
                      <dd className="min-w-0">
                        <a
                          href={href}
                          className="box-thin inline-block max-w-full truncate bg-acid px-2 py-1 font-mono text-[12px] font-bold hover:bg-black hover:text-acid sm:text-[12.5px]"
                        >
                          {label}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* ============================================== footer */}
        <footer className="relative overflow-hidden bg-black px-4 py-16 sm:px-6 sm:py-20">
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <span className="giant -ml-[3vw] text-[24vw] text-white/8">402</span>
          </div>
          <div className="relative mx-auto max-w-6xl">
            <h2 className="tight max-w-[18ch] text-[30px] text-white sm:text-[48px] lg:text-[56px]">
              Built in the open, from the first commit.
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={REPO} className="box shove bg-acid px-5 py-2.5 font-display text-[13px] sm:px-6 sm:py-3 sm:text-[15px]">
                MOLEX402
              </a>
              <a href={BEAVER} className="box shove bg-white px-5 py-2.5 font-display text-[13px] sm:px-6 sm:py-3 sm:text-[15px]">
                BEAVER402
              </a>
              <a href={RFP} className="box shove bg-white px-5 py-2.5 font-display text-[13px] sm:px-6 sm:py-3 sm:text-[15px]">
                THE RFP
              </a>
            </div>
            <p className="mt-12 font-mono text-[12.5px] text-white/55">
              Stellar Community Fund #45, RFP Track. Licensed Apache 2.0.
            </p>
          </div>
        </footer>
      </div>
    </ClickSpark>
  )
}
