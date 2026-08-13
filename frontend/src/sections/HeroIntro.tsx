import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'

const REPO = 'https://github.com/emirykl/Molex402'

const NAV = [
  ['WHY', '#gap'],
  ['WHAT', '#build'],
  ['HOW', '#how'],
  ['PROOF', '#proof'],
]

type CardDef = {
  k: string
  t: string
  fill: string
  rotate: number
  range: [number, number]
}

const CARDS: CardDef[] = [
  {
    k: 'WHAT IT IS',
    t: 'An open source x402 facilitator and Bazaar for Stellar.',
    fill: 'bg-acid',
    rotate: -2.6,
    range: [0.38, 0.6],
  },
  {
    k: 'WHAT IT DOES',
    t: 'Agents find paid HTTP and MCP services, pay in USDC, and check the response against the payment.',
    fill: 'bg-white',
    rotate: 1.9,
    range: [0.43, 0.65],
  },
  {
    k: 'WHERE IT RUNS',
    t: 'Stellar testnet and pubnet. Apache 2.0, built for SCF #45.',
    fill: 'bg-white',
    rotate: -1.5,
    range: [0.48, 0.7],
  },
]

function IntroCard({
  progress,
  def,
}: {
  progress: MotionValue<number>
  def: CardDef
}) {
  const [a, b] = def.range
  // opacity finishes in the first half of the travel so the card is never
  // left sitting on screen half transparent
  const opacity = useTransform(progress, [a, a + (b - a) * 0.42], [0, 1])
  const y = useTransform(progress, [a, b], ['38vh', '0vh'])
  const scale = useTransform(progress, [a, b], [0.88, 1])

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        rotate: def.rotate,
        willChange: 'transform, opacity',
      }}
      className={`box p-6 sm:p-8 ${def.fill}`}
    >
      <span className="font-mono text-[12px] font-bold tracking-[0.16em]">{def.k}</span>
      <p className="mt-3 text-[17px] leading-tight font-semibold sm:text-[21px]">{def.t}</p>
    </motion.div>
  )
}

export default function HeroIntro() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // 1. the wordmark grows until it fills the screen
  const markScale = useTransform(scrollYProgress, [0, 0.34], [0.3, 1])
  // 2. it steps up to open room underneath
  const markY = useTransform(scrollYProgress, [0.36, 0.56], ['0vh', '-16vh'])
  // 3. cards fly in one after another, then everything holds until release
  const rowOpacity = useTransform(scrollYProgress, [0.56, 0.68], [0, 1])
  const rowY = useTransform(scrollYProgress, [0.56, 0.72], ['26vh', '0vh'])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="stripes sticky top-0 h-screen overflow-hidden">
        {/* nav stays put through the whole intro */}
        <div className="relative z-30 flex flex-wrap items-start justify-between gap-3 p-4 sm:p-6">
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
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-7 sm:px-8 sm:pb-9">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-7">
              {CARDS.map((c) => (
                <IntroCard key={c.k} progress={scrollYProgress} def={c} />
              ))}
            </div>

            <motion.div
              style={{ opacity: rowOpacity, y: rowY, willChange: 'transform, opacity' }}
              className="mt-6 flex flex-wrap items-stretch gap-3"
            >
              <a
                href={REPO}
                className="box shove font-display bg-black px-7 py-3.5 text-[15px] text-white sm:text-[16px]"
              >
                READ THE CODE
              </a>
              <a
                href="#proof"
                className="box shove font-display bg-acid px-7 py-3.5 text-[15px] sm:text-[16px]"
              >
                SEE THE PROOF
              </a>
              <div className="box flex items-center bg-white px-5 py-2">
                <span className="font-mono text-[12px] font-bold sm:text-[13px]">
                  SCF #45 · RFP TRACK · TESTNET + PUBNET
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* scroll hint, gone the moment you move */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center"
        >
          <div className="box bg-white px-4 py-2">
            <span className="font-mono text-[11.5px] font-bold">SCROLL ↓</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
