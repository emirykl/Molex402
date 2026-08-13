import SplitText from './bits/SplitText'
import CountUp from './bits/CountUp'
import ClickSpark from './bits/ClickSpark'
import AnimatedContent from './bits/AnimatedContent'

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

function Head({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <AnimatedContent distance={36} duration={0.6} threshold={0.15}>
      <div className="box inline-block bg-acid px-3 py-1.5">
        <span className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase">{kicker}</span>
      </div>
      <h2 className="tight mt-5 max-w-[16ch] text-[38px] sm:text-[58px]">{title}</h2>
      {lede && (
        <p className="mt-6 max-w-[56ch] text-[16.5px] leading-relaxed text-black/70">{lede}</p>
      )}
    </AnimatedContent>
  )
}

function Panel({
  n,
  title,
  body,
  fill,
  delay = 0,
}: {
  n: string
  title: string
  body: string
  fill?: boolean
  delay?: number
}) {
  return (
    <AnimatedContent distance={30} duration={0.55} delay={delay} threshold={0.1}>
      <div className={`box h-full p-6 ${fill ? 'bg-acid' : 'bg-white'}`}>
        <span
          className={`box-thin mb-5 inline-block px-2 py-0.5 font-mono text-[12px] font-bold ${
            fill ? 'bg-white' : 'bg-acid'
          }`}
        >
          {n}
        </span>
        <h3 className="tight text-[21px]">{title}</h3>
        <p className="mt-3 text-[14.5px] leading-relaxed text-black/72">{body}</p>
      </div>
    </AnimatedContent>
  )
}

/* ------------------------------------------------------------------ page */

export default function App() {
  return (
    <ClickSpark sparkColor="#000000" sparkSize={13} sparkRadius={22} sparkCount={8} duration={380}>
      <div className="min-h-screen">
        {/* ============================================== hero */}
        <header className="relative min-h-[92vh] overflow-hidden">
          <div className="stripes absolute inset-0" />

          {/* oversized cropped wordmark */}
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <span className="giant -ml-[6vw] text-[30vw] text-black opacity-95">MOLEX</span>
          </div>

          {/* top bar */}
          <div className="relative flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
            <div className="flex flex-wrap gap-3">
              {[
                ['WHY', '#gap'],
                ['WHAT', '#build'],
                ['HOW', '#how'],
                ['PROOF', '#proof'],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="box shove bg-white px-5 py-3 font-display text-[15px] hover:bg-acid sm:px-7 sm:text-[18px]"
                >
                  {label}
                </a>
              ))}
            </div>
            <a
              href={REPO}
              className="box shove grid h-14 w-14 place-items-center rounded-full bg-white font-display text-[13px] hover:bg-acid"
            >
              GH
            </a>
          </div>

          {/* stacked content boxes */}
          <div className="relative mx-auto mt-[6vh] max-w-6xl px-4 pb-24 sm:px-6">
            <div className="box max-w-[760px] bg-acid p-6 sm:p-9">
              <SplitText
                tag="h1"
                text="Agents find it. Pay for it. Prove they got it."
                className="tight block text-[34px] sm:text-[58px]"
                splitType="words"
                delay={40}
                duration={0.6}
                ease="power4.out"
                from={{ opacity: 0, y: 34 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.05}
              />
            </div>

            <div className="box -mt-[3px] max-w-[600px] bg-white p-6 sm:ml-16 sm:p-8">
              <p className="text-[16px] leading-relaxed sm:text-[17.5px]">
                Molex402 is an open source x402 facilitator and Bazaar for Stellar. Services list
                themselves when they get paid. Agents search in plain language, pay in USDC, and
                check what came back against what they paid for.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={REPO}
                  className="box shove bg-black px-6 py-3 font-display text-[15px] text-white"
                >
                  READ THE CODE
                </a>
                <a
                  href="#proof"
                  className="box shove bg-acid px-6 py-3 font-display text-[15px]"
                >
                  SEE THE PROOF
                </a>
              </div>
            </div>

            <div className="box -mt-[3px] inline-block bg-black px-6 py-4 sm:ml-40">
              <p className="font-display text-[15px] leading-tight text-white sm:text-[19px]">
                SCF #45 · RFP TRACK
                <br />
                <span className="text-acid">TESTNET + PUBNET · APACHE 2.0</span>
              </p>
            </div>
          </div>
        </header>

        {/* ============================================== the gap */}
        <section id="gap" className="border-y-[3px] border-black bg-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Head
              kicker="The problem"
              title="Stellar can settle a payment. It cannot find one."
              lede="Paying an API on Stellar already works today. What is missing sits on either side of that payment: finding the service before, and trusting the delivery after."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <Panel
                n="01"
                fill
                title="Nothing to search"
                body="There is no catalog. An agent cannot reach a paid service unless a person wired that exact endpoint in beforehand, which defeats the point of an agent."
              />
              <Panel
                n="02"
                delay={0.08}
                title="Listings are just claims"
                body="Catalogs rank on what sellers write about themselves. A price tells an agent nothing about how that endpoint behaves under a retry storm or a replayed payment."
              />
              <Panel
                n="03"
                delay={0.16}
                title="Paid is not delivered"
                body="A settled payment proves money moved. It does not prove the work ran, ran once, or ran for your request. Races and retries can pay twice or deliver twice."
              />
            </div>
          </div>
        </section>

        {/* ============================================== what we build */}
        <section id="build" className="stripes-tight border-b-[3px] border-black px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="box bg-white p-6 sm:p-10">
              <Head
                kicker="The build"
                title="Six parts. One job."
                lede="Built on the @x402/stellar package rather than rewriting verify and settle, which is what the RFP asks for."
              />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Panel
                n="01"
                fill
                title="Bazaar"
                body="Services get listed the moment a payment settles, with no extra registration step. Search in plain language across HTTP endpoints and MCP tools. Filter on price, network and security profile."
              />
              <Panel
                n="02"
                delay={0.06}
                title="Facilitator"
                body="Verify and settle on testnet and pubnet, for both exact and upto. Fees are sponsored, so an agent never has to hold XLM. Run it hosted, self hosted, or as a library in your own server."
              />
              <Panel
                n="03"
                delay={0.12}
                title="MolexGuard"
                body="Middleware for the seller. It keeps the paid handler locked until settlement is final, then lets it run exactly once. A thousand parallel retries of one payment still buy one delivery."
              />
              <Panel
                n="04"
                delay={0.18}
                title="MolexScope"
                body="An attack suite that tests a service from the outside. Replay, cache tricks, verify and settle races, fee abuse, poisoned listings. Results get signed and attached to the listing."
              />
              <Panel
                n="05"
                delay={0.24}
                fill
                title="MCP server"
                body="Search, inspect, pay, verify. Four steps an agent runtime can call directly. No tool ever asks for a private key, so signing stays in the buyer wallet."
              />
              <Panel
                n="06"
                delay={0.3}
                title="Upto on Stellar"
                body="A small Soroban contract for capped payments, with no admin, no upgrade path and no custody. The spec and the code go upstream to x402 rather than staying ours."
              />
            </div>
          </div>
        </section>

        {/* ============================================== how */}
        <section id="how" className="border-b-[3px] border-black bg-white px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <Head
              kicker="The flow"
              title="Seven steps from search to receipt."
              lede="The agent never has to trust the listing. It reads the security profile before it pays, and checks the response against the payment after."
            />
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {[
                ['DISCOVER', 'Search the Bazaar'],
                ['BIND', 'Signed offer'],
                ['RESERVE', 'Lock the payment'],
                ['VERIFY', 'Check the auth'],
                ['SETTLE', 'Stellar finality'],
                ['EXECUTE', 'Run it once'],
                ['PROVE', 'Signed evidence'],
              ].map(([t, d], i) => (
                <AnimatedContent key={t} distance={26} duration={0.45} delay={i * 0.05}>
                  <div className={`box h-full p-4 ${i % 2 ? 'bg-white' : 'bg-acid'}`}>
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
        <section id="proof" className="relative overflow-hidden border-b-[3px] border-black bg-acid px-4 py-20 sm:px-6 sm:py-28">
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
                  <div className="box h-full bg-white p-5 sm:p-6">
                    <div className="font-display flex items-baseline text-[40px] leading-none sm:text-[52px]">
                      <span>{pre as string}</span>
                      <CountUp to={val as number} duration={1.5} separator="," />
                    </div>
                    <p className="mt-3 text-[13px] leading-snug font-semibold">{label as string}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>

            <AnimatedContent distance={36} duration={0.65}>
              <div className="box mt-8 bg-white p-6 sm:p-10">
                <h3 className="tight text-[26px]">Beaver402</h3>
                <p className="mt-4 max-w-[64ch] text-[15.5px] leading-relaxed text-black/72">
                  An agent can make a payment that is perfectly valid and still not the one the
                  account owner approved. Beaver402 closes that with two signatures. The merchant
                  signs a description of the paid request, the buyer rebuilds the same description
                  from what was actually sent, and a Soroban smart account settles only when every
                  field agrees.
                </p>

                <div className="mt-8 overflow-x-auto">
                  <table className="w-full min-w-[500px] text-left text-[14.5px]">
                    <tbody>
                      {[
                        ['Source, threat model, test vectors', 'github.com/emirykl/Beaver402', BEAVER],
                        ['Deployed Soroban contract', 'CBPE37HQ…JZTX2S', CONTRACT],
                        ['A payment both sides agreed on', '19d9c4e4…', TX1],
                        ['An owner action signed by passkey', '61e6485c…', TX2],
                      ].map(([what, label, href]) => (
                        <tr key={label} className="border-b-2 border-black/15 last:border-0">
                          <td className="py-3.5 pr-6 font-semibold">{what}</td>
                          <td className="py-3.5">
                            <a
                              href={href}
                              className="box-thin bg-acid px-2 py-1 font-mono text-[12.5px] font-bold hover:bg-black hover:text-acid"
                            >
                              {label}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>

        {/* ============================================== footer */}
        <footer className="relative overflow-hidden bg-black px-4 py-20 sm:px-6">
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <span className="giant -ml-[3vw] text-[24vw] text-white/8">402</span>
          </div>
          <div className="relative mx-auto max-w-6xl">
            <h2 className="tight max-w-[18ch] text-[34px] text-white sm:text-[56px]">
              Built in the open, from the first commit.
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={REPO} className="box shove bg-acid px-6 py-3 font-display text-[15px]">
                MOLEX402
              </a>
              <a href={BEAVER} className="box shove bg-white px-6 py-3 font-display text-[15px]">
                BEAVER402
              </a>
              <a href={RFP} className="box shove bg-white px-6 py-3 font-display text-[15px]">
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
