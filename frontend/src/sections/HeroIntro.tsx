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
  const markScale = useTransform(scrollYProgress, [0, 0.34], [0.3, 1])
  // 2. it steps up to open the ground underneath
  const markY = useTransform(scrollYProgress, [0.36, 0.56], ['0vh', '-14vh'])
  // 3. the mole digs its way up, slowly, over the rest of the track
  const moleY = useTransform(scrollYProgress, [0.34, 0.92], ['104%', '0%'])
  const moleScale = useTransform(scrollYProgress, [0.34, 0.92], [0.86, 1])
  // the bar underneath arrives just before the mole breaks ground
  const barY = useTransform(scrollYProgress, [0.3, 0.44], ['110%', '0%'])

  return (
    <section ref={ref} className="relative h-[240vh]">
      <div className="stripes sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* nav */}
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

          {/* the mole comes up out of the ground */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-end pr-[4vw] sm:pr-[7vw]">
            <motion.img
              src={mole}
              alt="The Molex402 mole surfacing from the ground"
              width={1000}
              height={577}
              style={{ y: moleY, scale: moleScale, willChange: 'transform' }}
              className="block w-[min(74vw,540px)] origin-bottom drop-shadow-[0_0_0_rgba(0,0,0,0)]"
            />
          </div>
        </div>

        {/* the ground line */}
        <motion.div
          style={{ y: barY, willChange: 'transform' }}
          className="relative z-30 border-t-[3px] border-black bg-white"
        >
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
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
            <span className="font-mono ml-auto hidden text-[12.5px] font-bold md:block">
              SCF #45 · RFP TRACK · TESTNET + PUBNET · APACHE 2.0
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
