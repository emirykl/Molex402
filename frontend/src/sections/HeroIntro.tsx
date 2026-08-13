import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const REPO = 'https://github.com/emirykl/Molex402'

const NAV = [
  ['WHY', '#gap'],
  ['WHAT', '#build'],
  ['HOW', '#how'],
  ['PROOF', '#proof'],
]

const CARDS = [
  {
    k: 'WHAT IT IS',
    t: 'An open source x402 facilitator and Bazaar for Stellar.',
    fill: 'bg-acid',
  },
  {
    k: 'WHAT IT DOES',
    t: 'Agents find paid HTTP and MCP services, pay in USDC, and check the response against the payment.',
    fill: 'bg-white',
  },
  {
    k: 'WHERE IT RUNS',
    t: 'Stellar testnet and pubnet. Apache 2.0, built for SCF #45.',
    fill: 'bg-white',
  },
]

export default function HeroIntro() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // 1. the wordmark grows into place
  const markScale = useTransform(scrollYProgress, [0, 0.42], [0.3, 1])
  // 2. once it lands, it steps up to clear room underneath
  const markY = useTransform(scrollYProgress, [0.42, 0.66], ['0vh', '-13vh'])
  // 3. the cards rise into the space it left
  const cardsY = useTransform(scrollYProgress, [0.5, 0.82], ['46vh', '0vh'])
  const cardsOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1])
  // the hint fades out as soon as you start
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <section ref={ref} className="relative h-[280vh]">
      <div className="stripes sticky top-0 h-screen overflow-hidden">
        {/* nav stays put through the whole intro */}
        <div className="relative z-20 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {NAV.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="box shove font-display bg-white px-4 py-2.5 text-[13px] hover:bg-acid sm:px-6 sm:py-3 sm:text-[17px]"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href={REPO}
            className="box shove font-display grid h-12 w-12 place-items-center rounded-full bg-white text-[12px] hover:bg-acid sm:h-14 sm:w-14 sm:text-[13px]"
          >
            GH
          </a>
        </div>

        {/* the wordmark */}
        <motion.div
          style={{ scale: markScale, y: markY, willChange: 'transform' }}
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="giant block px-[2vw] text-center text-[16.5vw] text-black">
            MOLEX402
          </span>
        </motion.div>

        {/* the cards */}
        <motion.div
          style={{ y: cardsY, opacity: cardsOpacity, willChange: 'transform, opacity' }}
          className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 sm:px-6 sm:pb-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {CARDS.map((c) => (
                <div key={c.k} className={`box p-4 sm:p-5 ${c.fill}`}>
                  <span className="font-mono text-[11px] font-bold tracking-[0.14em]">{c.k}</span>
                  <p className="mt-2.5 text-[14px] leading-snug font-medium sm:text-[15px]">{c.t}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-stretch gap-3">
              <a
                href={REPO}
                className="box shove font-display bg-black px-6 py-3 text-[14px] text-white sm:text-[15px]"
              >
                READ THE CODE
              </a>
              <a
                href="#proof"
                className="box shove font-display bg-acid px-6 py-3 text-[14px] sm:text-[15px]"
              >
                SEE THE PROOF
              </a>
              <div className="box flex items-center bg-white px-4 py-2">
                <span className="font-mono text-[11.5px] font-bold sm:text-[12.5px]">
                  SCF #45 · RFP TRACK · TESTNET + PUBNET
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute inset-x-0 bottom-7 z-20 flex justify-center"
        >
          <div className="box bg-white px-4 py-2">
            <span className="font-mono text-[11.5px] font-bold">SCROLL ↓</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
