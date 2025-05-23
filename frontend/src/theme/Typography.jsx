const typography = {
  fontFamily: "'Plus Jakarta Sans', sans-serif;",
  h1: {
    fontWeight: 400,
    fontSize: '3rem',       // Reduced from 5rem (~80px) to 3rem (~48px)
    lineHeight: 1.2,        // Proportional, was 7.5rem
  },
  h2: {
    fontWeight: 400,
    fontSize: '2.5rem',     // Reduced from 4rem (~64px) to 2.5rem (~40px)
    lineHeight: 1.2,        // Proportional, was 5rem
  },
  h3: {
    fontWeight: 400,
    fontSize: '2rem',       // Reduced from 3rem (~48px) to 2rem (~32px)
    lineHeight: 1.2,        // Proportional, was 3.75rem
  },
  h4: {
    fontWeight: 400,
    fontSize: '1.75rem',    // Kept at 1.75rem (~28px), was 2.25rem
    lineHeight: 1.2,        // Proportional, was 3rem
  },
  h5: {
    fontWeight: 400,
    fontSize: '1.5rem',     // Reduced from 1.75rem (~28px) to 1.5rem (~24px)
    lineHeight: 1.2,        // Proportional, was 2.3rem
  },
  h6: {
    fontWeight: 500,
    fontSize: '1.25rem',    // Kept at 1.25rem (~20px)
    lineHeight: 1.2,        // Proportional, was 1.75rem
  },
  h7: {
    fontWeight: 500,
    fontSize: '1.0rem',    // Kept at 1.25rem (~20px)
    lineHeight: 1.2,        // Proportional, was 1.75rem
  },
  button: {
    textTransform: 'capitalize',
    fontWeight: 500,
    fontSize: '1rem',       // ~16px, unchanged
    lineHeight: 1.75,       // Proportional, was 1.75rem
  },
  body1: {
    fontSize: '1.125rem',   // ~18px, unchanged
    fontWeight: 400,
    lineHeight: 1.5,        // Proportional, was 1.6875rem (~1.5x)
  },
  body2: {
    fontSize: '1rem',       // ~16px, unchanged
    letterSpacing: '0rem',
    fontWeight: 400,
    lineHeight: 1.5,        // Proportional, was 1.5rem
  },
  subtitle1: {
    fontSize: '1.125rem',   // ~18px, unchanged
    fontWeight: 400,
    lineHeight: 1.5,        // Proportional, was 1.6rem
  },
  subtitle2: {
    fontSize: '1rem',       // ~16px, unchanged
    fontWeight: 500,
    lineHeight: 1.5,        // Proportional, was 1.6rem
  },
  caption: {
    fontSize: '0.875rem',   // ~14px, added for small text
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',    // ~12px, added for uppercase labels
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: 'uppercase',
  },
};

export default typography;