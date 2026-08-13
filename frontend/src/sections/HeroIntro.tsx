import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import mole from '../assets/molex402-mole.webp'

const REPO = 'https://github.com/emirykl/Molex402'

const NAV = [
  ['WHY', '#gap'],
  ['WHAT', '#build'],
  ['HOW', '#how'],
  ['PROOF', '#proof'],
]

export default function HeroIntro() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // 1. the wordmark grows until it fills the screen
  const markScale = useTransform(scrollYProgress, [0, 0.34], [0.78, 1])
  // 2. it steps up to open the ground underneath
  const markY = useTransform(scrollYProgress, [0.36, 0.56], ['0vh', '-14vh'])
  // 3. the mole digs its way up, slowly, over the rest of the track
  const moleY = useTransform(scrollYProgress, [0.34, 0.92], ['104%', '0%'])
  const moleScale = useTransform(scrollYProgress, [0.34, 0.92], [0.86, 1])
  // the bar underneath arrives just before the mole breaks ground
  const barY = useTransform(scrollYProgress, [0.3, 0.44], ['110%', '0%'])
  // The summary is driven by the mole's transforms, so the two rise, sit and
  // retreat as one. No fade of its own; the stage clips it below the ground.
  const summaryY = useTransform(scrollYProgress, [0.34, 0.92], ['82vh', '0vh'])
  const summaryScale = moleScale

  return (
    <section ref={ref} className="track-hero relative">
      <div className="stripes h-stage sticky top-0 flex flex-col overflow-hidden">
        {/* nav */}
        <div className="relative z-30 flex items-start justify-between gap-2 p-3 sm:gap-3 sm:p-6">
          <div className="flex flex-nowrap gap-1.5 sm:flex-wrap sm:gap-3">
            {NAV.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="box shove font-display bg-white px-2.5 py-2 text-[11px] hover:bg-acid sm:px-6 sm:py-3 sm:text-[17px]"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href={REPO}
            aria-label="Molex402 on GitHub"
            className="box shove grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white hover:bg-acid sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5 sm:h-7 sm:w-7" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </div>

        {/* stage */}
        <div className="relative flex-1 overflow-hidden">
          {/* wordmark */}
          <motion.div
            style={{ scale: markScale, y: markY, willChange: 'transform' }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <span className="giant block px-[2vw] text-center text-[16.5vw] text-black">
              MOLEX402
            </span>
          </motion.div>

          {/* summary, surfacing and retreating in step with the mole */}
          <motion.div
            style={{ y: summaryY, scale: summaryScale, willChange: 'transform' }}
            className="absolute bottom-[15vh] left-[9vw] z-20 hidden max-w-[430px] origin-bottom sm:block lg:max-w-[500px]"
          >
            <div className="box bg-white p-5 lg:p-7">
              <p className="text-[18px] leading-snug font-semibold lg:text-[21px]">
                An open source x402 facilitator and Bazaar for Stellar. Agents discover paid
                services, pay in USDC, and prove they got what they paid for.
              </p>
            </div>
          </motion.div>

          {/* the mole comes up out of the ground */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center sm:justify-end sm:pr-[7vw]">
            <motion.img
              src={mole}
              alt="The Molex402 mole surfacing from the ground"
              width={1000}
              height={577}
              style={{ y: moleY, scale: moleScale, willChange: 'transform' }}
              className="block w-[min(82vw,540px)] origin-bottom"
            />
          </div>
        </div>

        {/* the ground line */}
        <motion.div
          style={{ y: barY, willChange: 'transform' }}
          className="relative z-30 border-t-[3px] border-black bg-white"
        >
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-4">
            <a
              href={REPO}
              className="box shove font-display flex-1 bg-black px-4 py-2.5 text-center text-[12.5px] text-white sm:flex-none sm:px-6 sm:py-3 sm:text-[15px]"
            >
              READ THE CODE
            </a>
            <a
              href="#proof"
              className="box shove font-display flex-1 bg-acid px-4 py-2.5 text-center text-[12.5px] sm:flex-none sm:px-6 sm:py-3 sm:text-[15px]"
            >
              SEE THE PROOF
            </a>
            <span className="font-mono ml-auto hidden text-[12.5px] font-bold md:block">
              SCF #45 · RFP TRACK · TESTNET + PUBNET · APACHE 2.0
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
