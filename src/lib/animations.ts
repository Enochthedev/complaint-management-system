// Animation utilities and configurations
export const animations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeInOut" },
  },

  // Stagger animations for lists
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },

  // Hover animations
  hover: {
    scale: { scale: 1.02 },
    lift: { y: -4, transition: { duration: 0.2 } },
    glow: { boxShadow: "0 10px 40px rgba(0,0,0,0.1)" },
  },

  // Loading animations
  loading: {
    pulse: {
      animate: {
        scale: [1, 1.05, 1],
        opacity: [0.7, 1, 0.7],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    spin: {
      animate: { rotate: 360 },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },

  // Slide animations
  slide: {
    left: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -100, opacity: 0 },
    },
    right: {
      initial: { x: 100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 },
    },
    up: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -100, opacity: 0 },
    },
  },
};

// CSS animation classes
export const animationClasses = {
  // Entrance animations
  fadeIn: "animate-in fade-in duration-500",
  slideInUp: "animate-in slide-in-from-bottom-4 duration-500",
  slideInDown: "animate-in slide-in-from-top-4 duration-500",
  slideInLeft: "animate-in slide-in-from-left-4 duration-500",
  slideInRight: "animate-in slide-in-from-right-4 duration-500",

  // Hover effects
  hoverLift: "hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
  hoverScale: "hover:scale-105 transition-transform duration-200",
  hoverGlow:
    "hover:shadow-xl hover:shadow-primary/25 transition-all duration-300",

  // Loading states
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",

  // Interactive elements
  buttonPress: "active:scale-95 transition-transform duration-100",
  cardHover: "hover:shadow-xl hover:-translate-y-2 transition-all duration-300",

  // Stagger delays
  delay100: "animation-delay-100",
  delay200: "animation-delay-200",
  delay300: "animation-delay-300",
  delay400: "animation-delay-400",
  delay500: "animation-delay-500",
};

// Utility function to combine animation classes
export const combineAnimations = (...classes: string[]) => classes.join(" ");

// Stagger delay utility
export const getStaggerDelay = (index: number, baseDelay = 100) =>
  `${index * baseDelay}ms`;
