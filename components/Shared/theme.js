const baseColors = {
  mono: {
    black: '#000',
    nearblack: '#262626',
    darkgray: '#666666',
    lightgray: '#C4C4C4',
    silver: '#999999',
    white: '#ffffff',
    transparent: 'transparent'
  },
  blue: {
    lightest: '#F6F8FE',
    lighter: '#EFF3FD',
    light: '#E4EBFC',
    mid: '#d1ddfa'
  },
  green: {
    primary: '#1AD08F',
    light: '#D2F5ED',
    dark: '#007056'
  },
  red: {
    light: '#FC6D6F',
    dark: '#660000'
  },
  yellow: {
    light: '#FFDC99',
    deep: '#FCA703'
  },
  purple: {
    light: '#E0D7FE',
    deep: '#5E26FF'
  }
}

// The core color object is the only non-semantic object here. This is because these colors are used so widely that it would be highly redundant to replicate these color values repeatedly within this "colors" object to style the text/background of every single Component the app renders.
const core = {
  primary: baseColors.purple.deep,
  secondary: baseColors.purple.light,
  black: baseColors.mono.black,
  nearblack: baseColors.mono.nearblack,
  darkgray: baseColors.mono.darkgray,
  lightgray: baseColors.mono.lightgray,
  silver: baseColors.mono.silver,
  white: baseColors.mono.white,
  transparent: baseColors.mono.transparent
}

const colors = {
  core,
  buttons: {
    primary: {
      background: baseColors.green.primary,
      borderColor: baseColors.green.primary,
      color: baseColors.mono.nearblack
    },
    secondary: {
      background: baseColors.mono.transparent,
      borderColor: baseColors.mono.nearblack,
      color: baseColors.mono.nearblack
    },
    tertiary: {
      background: baseColors.mono.transparent,
      borderColor: baseColors.purple.light,
      color: baseColors.purple.light
    },
    'transparent-dark': {
      bg: 'black',
      borderColor: 'black',
      color: 'black'
    }
  },
  background: {
    app: baseColors.blue.lightest,
    screen: baseColors.blue.lighter
  },
  card: {
    account: {
      background: core.primary,
      color: core.secondary
    },
    balance: {
      background: baseColors.mono.transparent,
      color: core.nearblack
    },
    confirmation: {
      background: baseColors.green.light,
      foreground: baseColors.green.dark
    },
    error: {
      background: baseColors.red.light
    }
  },
  input: {
    background: {
      base: baseColors.blue.light,
      active: baseColors.blue.mid
    },
    border: core.silver
  },
  status: {
    success: {
      background: baseColors.green.primary,
      foreground: baseColors.mono.darkgray
    },
    pending: {
      background: baseColors.yellow.deep,
      foreground: baseColors.mono.darkgray
    },
    fail: {
      background: baseColors.red.light,
      foreground: baseColors.mono.darkgray
    },
    inactive: baseColors.mono.lightgray
  }
}

// theme.js
const theme = {
  colors,
  fontSizes: [
    '0rem',
    '0.875rem',
    '1.125rem',
    '1.25rem',
    '1.5rem',
    '2rem',
    '3rem'
  ],
  fontWeights: [0, 400, 600, 900],
  letterSpacings: [0, 1, 2, 4, 8],
  lineHeights: {
    solid: 1,
    title: 1.2,
    copy: 1.4
  },
  textStyles: {
    bigTitle: {
      fontSize: [5, 6, 6],
      fontWeight: 700,
      margin: 0,
      lineHeight: 'solid',
      fontFamily: 'system-ui'
    },
    title: {
      fontSize: 5,
      fontColor: core.primary,
      fontWeight: 700,
      margin: 0,
      lineHeight: 'title',
      fontFamily: 'system-ui'
    },
    text: {
      fontSize: 3,
      fontColor: core.nearblack,
      fontWeight: 400,
      lineHeight: 'copy',
      fontFamily: 'system-ui'
    },
    label: {
      fontSize: 1,
      fontColor: core.darkgray,
      fontWeight: 700,
      textTransform: 'uppercase',
      lineHeight: 'solid',
      fontFamily: 'system-ui'
    }
  },
  fonts: {
    sansSerif:
      '"system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
    mono:
      '"system-ui", "Segoe UI", Roboto Mono, Helvetica, Arial, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";'
  },
  space: [0, 4, 8, 16, 24, 32, 48, 64, 128, 256],
  sizes: [0, 4, 8, 16, 24, 32, 48, 64, 80, 120, 240, 300, 480],
  radii: ['0', '1px', '4px', '8px', '16px', '32px'],
  // width: [0, 16, 32, 48, 64, 128, 256],
  minWidths: [0, 16, 32, 64, 128, 256],
  maxWidths: [0, 16, 32, 64, 128, 256, 512, 768, 1024, 1536],
  // heights: [0, 16, 32, 48, 64, 128, 256],
  minHeights: [0, 16, 32, 64, 128, 256],
  maxHeights: [0, 16, 32, 64, 128, 256],
  borders: [0, `1px solid`, `4px solid`],
  borderStyles: ['solid'],
  borderWidths: ['0', '1px', '2px', '4px'],
  breakpoints: ['40em', '52em', '64em'],
  // Alex, Todo - Use SmoothShadow https://css-tricks.com/make-a-smooth-shadow-friend/
  shadows: [
    '0',
    '0 0.9px 9px rgba(0, 0, 0, 0.017), 0 2.2px 18.6px rgba(0, 0, 0, 0.027),0 4.1px 29.7px rgba(0, 0, 0, 0.034),0 7.4px 45.2px rgba(0, 0, 0, 0.041),0 13.8px 73.1px rgba(0, 0, 0, 0.051), 0 33px 160px rgba(0, 0, 0, 0.07)'
  ],
  opacity: {
    disabled: 0.4
  },
  zIndices: [0, 9, 99, 999, 9999]
}

export default theme
