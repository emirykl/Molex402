import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react'

type Part = {
  n: string
  name: string
  body: string
  bullets: string[]
}

const PARTS: Part[] = [
  {
    n: '01',
    name: 'Bazaar',
    body: 'Services get listed the moment a payment settles, with no extra registration step. An agent searches in plain language across HTTP endpoints and MCP tools, then filters on price, network and security profile.',
    bullets: ['Plain language search', 'HTTP and MCP as equals', 'Auto listed on settle'],
  },
  {
    n: '02',
    name: 'Facilitator',
    body: 'Verify and settle on testnet and pubnet, for both exact and upto. Fees are sponsored, so an agent never has to hold XLM. Run it hosted, self hosted, or as a library inside your own server.',
    bullets: ['/supported /verify /settle', 'Fees sponsored', 'Three ways to deploy'],
  },
  {
    n: '03',
    name: 'MolexGuard',
    body: 'Middleware for the seller. It keeps the paid handler locked until settlement is final, then lets it run once. Under the strict transactional profile, a thousand parallel retries of the same payment still buy one delivery.',
    bullets: ['Durable state machine', 'One payment, one delivery', 'Survives a crash'],
  },
  {
    n: '04',
    name: 'MolexScope',
    body: 'An attack suite that tests a service from the outside. Replay, cache tricks, verify and settle races, fee abuse, poisoned listings. The result gets signed and attached to the Bazaar listing.',
    bullets: ['Replay and races', 'Cache and header tricks', 'Signed evidence'],
  },
  {
    n: '05',
    name: 'MCP server',
    body: 'Search, inspect, pay, verify. Four steps an agent runtime can call directly, each one deterministic enough to audit. No tool ever asks for a private key, so signing stays in the buyer wallet.',
    bullets: ['Deterministic tools', 'No key leaves the wallet', 'Works with stock clients'],
  },
  {
    n: '06',
    name: 'Upto on Stellar',
    body: 'A small Soroban contract for capped payments. No admin, no upgrade path, no custody, so there is nothing to seize and nothing to rug. The spec and the code go upstream to x402 rather than staying ours.',
    bullets: ['Immutable', 'Recipient bound', 'Contributed upstream'],
  },
]

export default function StickyParts() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Hold at both ends of the track. The lead in lets the stage finish pinning
  // to the full viewport before part 01 gives way, and the lead out lets part
  // 06 sit still before the section scrolls off, so no step ever lands while
  // the panel is only half on screen.
  const LEAD_IN = 0.12
  const LEAD_OUT = 0.94
  const stepped = useTransform(scrollYProgress, [LEAD_IN, LEAD_OUT], [0, 1], { clamp: true })

  useMotionValueEvent(stepped, 'change', (v) => {
    const i = Math.min(PARTS.length - 1, Math.max(0, Math.floor(v * PARTS.length)))
    setActive(i)
  })

  const barWidth = useTransform(stepped, [0, 1], ['0%', '100%'])

  const part = PARTS[active]

  return (
    <section
      id="build"
      ref={ref}
      className="track-parts relative border-b-[3px] border-black"
    >
      <div className="stripes-tight h-stage sticky top-0 flex flex-col overflow-hidden">
        {/* progress rail */}
        <div className="relative z-10 border-b-[3px] border-black bg-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
            <span className="font-display hidden text-[13px] whitespace-nowrap sm:block sm:text-[15px]">
              SIX PARTS. ONE JOB.
            </span>
            <span className="font-display text-[13px] whitespace-nowrap sm:hidden">SIX PARTS.</span>
            <div className="box-thin relative h-3 flex-1 bg-white">
              <motion.div className="h-full bg-acid" style={{ width: barWidth }} />
            </div>
            <span className="font-mono text-[13px] font-bold whitespace-nowrap">
              {part.n} / 06
            </span>
          </div>
        </div>

        {/* stage */}
        <div className="relative flex flex-1 items-center overflow-hidden py-5 sm:py-8">
          {/* the number, oversized behind everything */}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`ghost-${active}`}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="giant pointer-events-none absolute right-[-4vw] bottom-[-8vh] text-[38vw] text-black/10 sm:text-[42vw]"
            >
              {part.n}
            </motion.span>
          </AnimatePresence>

          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="grid min-h-[min(540px,58vh)] items-stretch gap-6 md:grid-cols-[minmax(0,270px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,310px)_minmax(0,1fr)]">
              {/* index list */}
              <div className="box hidden bg-white md:flex md:flex-col">
                {PARTS.map((p, i) => (
                  <button
                    key={p.n}
                    onClick={() => {
                      const el = ref.current
                      if (!el) return
                      // invert the lead in / lead out mapping to land mid step
                      const target = LEAD_IN + (LEAD_OUT - LEAD_IN) * ((i + 0.5) / PARTS.length)
                      const travel = el.offsetHeight - window.innerHeight
                      window.scrollTo({
                        top: el.offsetTop + target * travel,
                        behavior: 'smooth',
                      })
                    }}
                    className={`flex w-full flex-1 items-center gap-3 border-b-2 border-black px-4 py-3 text-left transition-colors last:border-b-0 ${
                      i === active ? 'bg-black text-acid' : 'bg-white hover:bg-acid'
                    }`}
                  >
                    <span className="font-mono text-[12px] font-bold">{p.n}</span>
                    <span className="font-display text-[15px] uppercase">{p.name}</span>
                    {i === active && (
                      <motion.span
                        layoutId="cursor"
                        className="ml-auto block h-2.5 w-2.5 bg-acid"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* active panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={part.n}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="box flex flex-col justify-center bg-white p-5 sm:p-9"
                >
                  <div className="box-thin mb-4 self-start bg-acid px-2.5 py-1 sm:mb-5">
                    <span className="font-mono text-[12px] font-bold">PART {part.n}</span>
                  </div>

                  <h2 className="tight text-[30px] sm:text-[48px] lg:text-[58px]">{part.name}</h2>

                  <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-black/72 sm:mt-5 sm:text-[17.5px]">
                    {part.body}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
                    {part.bullets.map((b, i) => (
                      <motion.span
                        key={b}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 + i * 0.07, duration: 0.35 }}
                        className="box-thin bg-acid px-2.5 py-1 font-mono text-[11.5px] font-bold sm:px-3 sm:py-1.5 sm:text-[12.5px]"
                      >
                        {b}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* mobile dots */}
            <div className="mt-5 flex gap-2 md:hidden">
              {PARTS.map((p, i) => (
                <span
                  key={p.n}
                  className={`box-thin h-2.5 flex-1 ${i <= active ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
