"use client"

import { motion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } },
}

/** Wrap a list/grid of children to fade+rise them in with a stagger. */
export function StaggerGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <motion.div variants={staggerItem} className={cn(className)} {...props}>
      {children}
    </motion.div>
  )
}
