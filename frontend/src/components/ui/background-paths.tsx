"use client"

import { motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function FloatingPaths({ position }: { position: number }) {
  const reducedMotion = useReducedMotion()

  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-primary"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) =>
          reducedMotion ? (
            <path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={0.1 + path.id * 0.03}
            />
          ) : (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={0.1 + path.id * 0.03}
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={{
                pathLength: 1,
                opacity: [0.3, 0.6, 0.3],
                pathOffset: [0, 1, 0],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          )
        )}
      </svg>
    </div>
  )
}

interface BackgroundPathsProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  /** По умолчанию занимает весь экран (min-h-screen). Передайте, например,
   *  "min-h-[280px]" для использования как декоративный блок внутри страницы. */
  className?: string
}

export function BackgroundPaths({
  title = "Background Paths",
  subtitle,
  actionLabel,
  onAction,
  className,
}: BackgroundPathsProps) {
  const words = title.split(" ")
  const reducedMotion = useReducedMotion()

  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden rounded-3xl bg-background",
        className
      )}
    >
      <div className="absolute inset-0 opacity-20">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 md:px-6 text-center">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0 }}
          animate={reducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight text-foreground">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-3 last:mr-0">
                {word.split("").map((letter, letterIndex) =>
                  reducedMotion ? (
                    <span key={`${wordIndex}-${letterIndex}`} className="inline-block">
                      {letter}
                    </span>
                  ) : (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 60, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  )
                )}
              </span>
            ))}
          </h1>

          {subtitle && (
            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}

          {actionLabel && (
            <div className="inline-block group relative rounded-2xl p-px shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <Button
                variant="default"
                size="lg"
                className="rounded-[1.15rem] px-8 py-6 text-base font-semibold transition-all duration-300 group-hover:-translate-y-0.5"
                onClick={onAction}
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                  {actionLabel}
                </span>
                <span className="ml-3 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1.5">
                  →
                </span>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
