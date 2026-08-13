import SplitText from './bits/SplitText'
import CountUp from './bits/CountUp'
import ClickSpark from './bits/ClickSpark'
import AnimatedContent from './bits/AnimatedContent'
import DotGrid from './bits/DotGrid'

const REPO = 'https://github.com/emirykl/Molex402'
const BEAVER = 'https://github.com/emirykl/Beaver402'
const RFP = 'https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track'

/* ------------------------------------------------------------------ bits */

function Sticker({
  children,
  color,
  rotate = 0,
}: {
  children: React.ReactNode
  color: string
  rotate?: number
}) {
  return (
    <span
      className="frame-sm inline-block rounded-full px-3.5 py-1 font-mono text-[12px] font-semibold"
      style={{ background: color, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  )
}

function Card({
  n,
  title,
  body,
  color,
  rotate = 0,
}: {
  n: string
  title: string
  body: string
  color: string
  rotate?: number
}) {
  return (
    <div
      className="frame press flex flex-col rounded-2xl bg-paper p-6"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        className="frame-sm mb-4 grid h-9 w-9 place-items-center rounded-lg font-mono text-[13px] font-bold"
        style={{ background: color }}
      >
        {n}
      </span>
      <h3 className="font-display mb-2 text-[20px] leading-tight font-extrabold">{title}</h3>
      <p className="text-[14.5px] leading-relaxed text-ink/72">{body}</p>
    </div>
  )
}

function Section({
  id,
  kicker,
  title,
  lede,
  children,
}: {
  id?: string
  kicker: string
  title: string
  lede?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="border-t-[3px] border-ink px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedContent distance={40} duration={0.7} threshold={0.15}>
          <p className="font-mono text-[12px] font-semibold tracking-[0.18em] text-violet uppercase">
            {kicker}
          </p>
          <h2 className="font-display mt-3 max-w-[18ch] text-[34px] leading-[1.05] font-extrabold sm:text-[46px]">
            {title}
          </h2>
          {lede && (
            <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink/72">{lede}</p>
          )}
        </AnimatedContent>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ page */

export default function App() {
  return (
    <ClickSpark sparkColor="#7c5cff" sparkSize={11} sparkRadius={19} sparkCount={9} duration={420}>
      <div className="min-h-screen">
        {/* nav */}
        <nav className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/92 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
            <a href="#top" className="font-display text-[19px] font-extrabold tracking-tight">
              Molex<span className="text-violet">402</span>
            </a>
            <div className="hidden items-center gap-7 text-[14.5px] font-medium sm:flex">
              <a href="#gap" className="hover:text-violet">Why</a>
              <a href="#build" className="hover:text-violet">What</a>
              <a href="#how" className="hover:text-violet">How</a>
              <a href="#proof" className="hover:text-violet">Proof</a>
            </div>
            <a
              href={REPO}
              className="frame-sm press rounded-lg bg-ink px-4 py-2 text-[13.5px] font-semibold text-paper"
            >
              GitHub
            </a>
          </div>
        </nav>

        {/* hero */}
        <header id="top" className="relative overflow-hidden px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="pointer-events-none absolute inset-0 opacity-[0.5]">
            <DotGrid
              dotSize={2.5}
              gap={26}
              baseColor="#d9d3c4"
              activeColor="#7c5cff"
              proximity={110}
              shockRadius={190}
              shockStrength={4}
            />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap gap-2.5">
              <Sticker color="#c6f24e" rotate={-2}>SCF #45 · RFP Track</Sticker>
              <Sticker color="#ffd84d" rotate={1.5}>Apache 2.0</Sticker>
              <Sticker color="#5ac8ff" rotate={-1}>testnet + pubnet</Sticker>
            </div>

            <SplitText
              tag="h1"
              text="Agents find it. Pay for it. Prove they got it."
              className="font-display block max-w-[15ch] text-[42px] leading-[0.98] font-extrabold tracking-[-0.02em] sm:text-[76px]"
              splitType="words"
              delay={45}
              duration={0.7}
              ease="power4.out"
              from={{ opacity: 0, y: 60, rotate: -4 }}
              to={{ opacity: 1, y: 0, rotate: 0 }}
              threshold={0.05}
            />

            <p className="mt-8 max-w-[54ch] text-[18px] leading-relaxed text-ink/75 sm:text-[20px]">
              Molex402 is an open source x402 facilitator and Bazaar for Stellar. Services list
              themselves when they get paid. Agents search in plain language, pay in USDC, and check
              what came back against what they paid for.
            </p>

            <div className="mt-10 flex flex-wrap gap-3.5">
              <a
                href={REPO}
                className="frame press rounded-xl bg-violet px-7 py-3.5 text-[15.5px] font-bold text-paper"
              >
                Read the code
              </a>
              <a
                href="#proof"
                className="frame press rounded-xl bg-paper px-7 py-3.5 text-[15.5px] font-bold"
              >
                See the proof
              </a>
            </div>
          </div>
        </header>

        {/* the gap */}
        <Section
          id="gap"
          kicker="The problem"
          title="Stellar can settle a payment. It cannot find one."
          lede="The pieces for paying an API on Stellar already work. What is missing sits on either side of the payment: finding the service before, and trusting the delivery after."
        >
          <div className="grid gap-6 md:grid-cols-3">
            <Card
              n="01"
              color="#ff6b5a"
              rotate={-0.7}
              title="Nothing to search"
              body="There is no catalog. An agent cannot reach a paid service unless a human wired that exact endpoint in beforehand, which is the opposite of how an agent is supposed to work."
            />
            <Card
              n="02"
              color="#ffd84d"
              rotate={0.5}
              title="Listings are just claims"
              body="Catalogs rank on what sellers write about themselves. A price tells an agent nothing about how that endpoint behaves under a retry storm or a replayed payment."
            />
            <Card
              n="03"
              color="#5ac8ff"
              rotate={-0.4}
              title="Paid is not delivered"
              body="A settled payment proves money moved. It does not prove the work ran, ran once, or ran for your request. Races and retries can pay twice or deliver twice."
            />
          </div>
        </Section>

        {/* what we build */}
        <Section
          id="build"
          kicker="The build"
          title="Six parts. One job."
          lede="Built on the @x402/stellar package rather than rewriting verify and settle, which is what the RFP asks for."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card
              n="01"
              color="#c6f24e"
              rotate={0.5}
              title="Bazaar"
              body="Services get listed the moment a payment settles, with no extra registration step. Search in plain language across HTTP endpoints and MCP tools. Filter on price, network, and security profile."
            />
            <Card
              n="02"
              color="#7c5cff"
              rotate={-0.5}
              title="Facilitator"
              body="Verify and settle on testnet and pubnet, for both exact and upto. Fees are sponsored, so an agent never has to hold XLM. Run it hosted, self hosted, or as a library inside your own server."
            />
            <Card
              n="03"
              color="#ff6b5a"
              rotate={0.4}
              title="MolexGuard"
              body="Middleware for the seller. It keeps the paid handler locked until settlement is final, then lets it run exactly once. A thousand parallel retries of the same payment still buy one delivery."
            />
            <Card
              n="04"
              color="#ffd84d"
              rotate={-0.4}
              title="MolexScope"
              body="An attack suite that tests a service from the outside. Replay, cache tricks, verify and settle races, fee abuse, poisoned listings. Results get signed and attached to the Bazaar listing."
            />
            <Card
              n="05"
              color="#5ac8ff"
              rotate={0.6}
              title="MCP server"
              body="Search, inspect, pay, verify. Four steps an agent runtime can call directly. No tool ever asks for a private key, so signing stays in the buyer wallet."
            />
            <Card
              n="06"
              color="#c6f24e"
              rotate={-0.6}
              title="upto on Stellar"
              body="A small Soroban contract for capped payments, with no admin, no upgrade path, and no custody. The spec and the code go upstream to x402 rather than staying ours."
            />
          </div>
        </Section>

        {/* how */}
        <Section
          id="how"
          kicker="The flow"
          title="Seven steps from search to receipt."
          lede="The agent never has to trust the listing. It checks the security profile before it pays, and checks the response against the payment after."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {[
              ['Discover', 'Search the Bazaar', '#c6f24e'],
              ['Bind', 'Signed offer', '#ffd84d'],
              ['Reserve', 'Lock the payment', '#ff6b5a'],
              ['Verify', 'Check the auth', '#5ac8ff'],
              ['Settle', 'Stellar finality', '#7c5cff'],
              ['Execute', 'Run it once', '#c6f24e'],
              ['Prove', 'Signed evidence', '#ffd84d'],
            ].map(([t, d, c], i) => (
              <AnimatedContent key={t} distance={30} duration={0.5} delay={i * 0.06} threshold={0.1}>
                <div className="frame-sm h-full rounded-xl bg-paper p-4">
                  <span
                    className="mb-2.5 block h-2.5 w-2.5 rounded-full border-2 border-ink"
                    style={{ background: c }}
                  />
                  <span className="font-display block text-[16px] leading-tight font-extrabold">
                    {t}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-snug text-ink/60">{d}</span>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </Section>

        {/* proof */}
        <Section
          id="proof"
          kicker="Track record"
          title="We shipped this once already."
          lede="Beaver402 is our previous project on Stellar x402. It won a 5,000 dollar Stellar Instawards grant. It covers the same ground this RFP asks about: payment infrastructure, an MCP server, and a Soroban contract that is deployed and running."
        >
          <div className="mb-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              ['$', 5000, '', 'Stellar Instawards grant', '#c6f24e'],
              ['', 142, '', 'Commits on a live codebase', '#ffd84d'],
              ['', 151, '', 'Contract and backend tests', '#5ac8ff'],
              ['', 3, '', 'Transactions you can open', '#ff6b5a'],
            ].map(([pre, val, suf, label, color], i) => (
              <AnimatedContent key={label as string} distance={34} duration={0.6} delay={i * 0.08}>
                <div
                  className="frame h-full rounded-2xl p-6"
                  style={{ background: color as string }}
                >
                  <div className="font-display flex items-baseline text-[38px] leading-none font-extrabold sm:text-[46px]">
                    <span>{pre as string}</span>
                    <CountUp to={val as number} duration={1.6} separator="," />
                    <span>{suf as string}</span>
                  </div>
                  <p className="mt-3 text-[13.5px] leading-snug font-medium">{label as string}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>

          <AnimatedContent distance={40} duration={0.7}>
            <div className="frame-lg rounded-2xl bg-paper p-7 sm:p-9">
              <h3 className="font-display text-[24px] font-extrabold">Beaver402</h3>
              <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-ink/72">
                An agent can make a payment that is perfectly valid and still not the one the account
                owner approved. Beaver402 closes that with two signatures. The merchant signs a
                description of the paid request, the buyer rebuilds the same description from what was
                actually sent, and a Soroban smart account settles only when every field agrees.
              </p>

              <div className="mt-7 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[14.5px]">
                  <tbody>
                    {[
                      [
                        'Source, threat model, test vectors',
                        'github.com/emirykl/Beaver402',
                        BEAVER,
                      ],
                      [
                        'Deployed Soroban contract',
                        'CBPE37HQ…JZTX2S',
                        'https://stellar.expert/explorer/testnet/contract/CBPE37HQ6CHIKB7F3OFU2BIDAQOLB3QZD2DAO5Y6F6DKUSHLW2JZTX2S',
                      ],
                      [
                        'A payment both sides agreed on',
                        '19d9c4e4…',
                        'https://stellar.expert/explorer/testnet/tx/19d9c4e4f519e4ab9971c394a6338d9a82b83287f3e90d648ef3e15c49a1219a',
                      ],
                      [
                        'An owner action signed by passkey',
                        '61e6485c…',
                        'https://stellar.expert/explorer/testnet/tx/61e6485c8ef7df96b92ada8c79687acc69d8ea1b5d307d952d9b9efcab259b48',
                      ],
                    ].map(([what, label, href]) => (
                      <tr key={label} className="border-b-2 border-ink/12 last:border-0">
                        <td className="py-3.5 pr-6 font-medium">{what}</td>
                        <td className="py-3.5">
                          <a
                            href={href}
                            className="font-mono text-[13px] font-semibold text-violet underline decoration-2 underline-offset-4 hover:bg-lime hover:text-ink"
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
        </Section>

        {/* footer */}
        <footer className="tape border-t-[3px] border-ink px-5 py-16">
          <div className="mx-auto max-w-6xl">
            <p className="font-display max-w-[20ch] text-[30px] leading-tight font-extrabold sm:text-[40px]">
              Built in the open, from the first commit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href={REPO} className="frame-sm press rounded-lg bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper">
                Molex402
              </a>
              <a href={BEAVER} className="frame-sm press rounded-lg bg-paper px-5 py-2.5 text-[14px] font-semibold">
                Beaver402
              </a>
              <a href={RFP} className="frame-sm press rounded-lg bg-paper px-5 py-2.5 text-[14px] font-semibold">
                The RFP
              </a>
            </div>
            <p className="mt-10 font-mono text-[12.5px] text-ink/55">
              Stellar Community Fund #45, RFP Track. Licensed Apache 2.0.
            </p>
          </div>
        </footer>
      </div>
    </ClickSpark>
  )
}
