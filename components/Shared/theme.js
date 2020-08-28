export const baseColors = {
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
    mid: '#d1ddfa',
    mid2: '#bacbf7',
    muted: '#e8ecf7'
  },
  green: {
    primary: '#1AD08F',
    light: '#D2F5ED',
    muted: '#85e0cb',
    dark: '#007056',
    darker: '#08442F'
  },
  red: {
    light: '#FC6D6F',
    dark: '#660000'
  },
  orange: {
    light: '#FF9E80',
    dark: '#661800'
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
      color: baseColors.green.darker
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
    'tertiary-selected': {
      background: baseColors.purple.primary,
      borderColor: baseColors.purple.primary,
      color: baseColors.purple.light
    }
  },
  background: {
    app: baseColors.blue.lightest,
    screen: baseColors.blue.lighter,
    text: baseColors.blue.light,
    messageHistory: baseColors.blue.muted
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
      background: baseColors.red.light,
      foreground: baseColors.red.dark
    }
  },
  input: {
    background: {
      base: baseColors.blue.mid,
      active: baseColors.blue.mid2,
      valid: baseColors.green.muted,
      invalid: baseColors.red.light
    },
    border: core.silver
  },
  status: {
    success: {
      background: baseColors.green.primary,
      foreground: baseColors.green.darker
    },
    pending: {
      background: baseColors.yellow.deep,
      foreground: baseColors.mono.darkgray
    },
    warning: {
      background: baseColors.orange.light,
      foreground: baseColors.orange.dark
    },
    fail: {
      background: baseColors.red.light,
      foreground: baseColors.red.dark
    },
    inactive: baseColors.mono.lightgray
  }
}

const theme = {
  colors,
  fontSizes: ['0rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '2rem', '3rem'],
  fontWeights: [0, 400, 600, 900],
  letterSpacings: [0, 1, 2, 4, 8],
  lineHeights: {
    solid: 1,
    title: 1.2,
    copy: 1.4
  },
  textStyles: {
    header: {
      fontSize: 'calc(48px + (48 - 32) * (100vw - 360px) / (1440 - 360))',
      fontWeight: 400,
      margin: 0,
      lineHeight: 'title',
      fontFamily: 'RT-Alias-Grotesk'
    },
    bigTitle: {
      fontSize: 6,
      fontWeight: 700,
      margin: 0,
      lineHeight: 'solid',
      fontFamily: 'RT-Alias-Medium'
    },
    title: {
      fontSize: 4,
      fontWeight: 400,
      margin: 0,
      lineHeight: 'title',
      fontFamily: 'RT-Alias-Grotesk'
    },
    text: {
      fontSize: 2,
      fontColor: core.nearblack,
      fontWeight: 400,
      lineHeight: 'copy',
      fontFamily: 'RT-Alias-Grotesk'
    },
    label: {
      fontSize: 2,
      fontColor: core.darkgray,
      fontWeight: 400,
      lineHeight: 'solid',
      fontFamily: 'RT-Alias-Grotesk'
    },
    num: {
      m: {
        fontSize: 4,
        fontWeight: 400,
        margin: 0,
        lineHeight: 'title',
        fontFamily: 'RT-Alias-Grotesk'
      },
      l: {
        fontSize: 5,
        fontWeight: 700,
        margin: 0,
        lineHeight: 'title',
        fontFamily: 'RT-Alias-Grotesk'
      },
      xl: {
        fontSize: 6,
        fontWeight: 700,
        margin: 0,
        lineHeight: 'solid',
        fontFamily: 'RT-Alias-Grotesk'
      }
    }
  },
  fonts: {
    AliasMedium:
      '"RT-Alias-Medium", "system-ui", "Segoe UI", "Roboto", Helvetica',
    AliasGrotesk:
      '"RT-Alias-Grotesk", "system-ui", "Segoe UI", "Roboto", Helvetica',
    sansSerif:
      '"system-ui", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
    mono:
      '"system-ui", "Segoe UI", Roboto Mono, Helvetica, Arial, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";'
  },
  space: [0, 4, 8, 16, 24, 32, 48, 64, 128, 256],
  sizes: [
    0,
    4,
    8,
    16,
    24,
    32,
    48,
    64,
    80,
    160,
    240,
    300,
    480,
    560,
    640,
    720,
    800,
    960,
    1024,
    1200
  ],
  radii: ['0', '1px', '4px', '8px', '16px', '32px', '100px'],
  borders: [0, `1px solid`, `4px solid`],
  borderStyles: ['solid'],
  borderWidths: ['0', '1px', '2px', '4px'],
  breakpoints: ['40em', '52em', '64em'],
  shadows: [
    '0',
    '0 0.7px 2.2px -8px rgba(0, 0, 0, 0.18),0 1.7px 5.4px  rgba(0, 0, 0, 0.129),0 3.1px 10.1px rgba(0, 0, 0, 0.107),0 5.6px 18.1px rgba(0, 0, 0, 0.09),0 10.4px 33.8px rgba(0, 0, 0, 0.073),0 25px 81px rgba(0, 0, 0, 0.051)',
    'rgba(0, 0, 0, 0.10) 0px 0.7px 2.2px -8px, rgba(0, 0, 0, 0.04) 0px 1.7px 2.4px, rgba(0, 0, 0, 0.106) 0px 3.1px 8.1px, rgba(0, 0, 0, 0.04) 0px 5.6px 12.1px, rgba(0, 0, 0, 0.045) 0px 4.4px 4.8px, rgba(0, 0, 0, 0.05) 0px 15px 41px'
  ],
  opacity: {
    disabled: 0.4
  },
  zIndices: [0, 9, 99, 999, 9999]
}

export default theme
