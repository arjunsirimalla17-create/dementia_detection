import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  yOffset = 20,
}) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.34, 1.56, 0.64, 1], // Spring physics curve
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
