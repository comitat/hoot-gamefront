import { extendTheme } from "@chakra-ui/react"

export const theme = extendTheme({
    styles: {
        global: {
            html: {
                fontSize: '16px',
            },
            body: {
                bg: '#17112a',
                color: 'white',
                fontFamily: '"Onest", sans-serif',
                textRendering: "optimizeLegibility",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                overflowX: 'hidden',
                userSelect: 'none',
            },
        },
    },
    colors: {
        bg: {
            block: 'rgba(52, 43, 85, 0.3)',
            blockSolid: '#271F43',
            body: '#17112a',
            bodyTransparent: 'rgba(23, 17, 42, 0.7)',
            bodyLighter: '#261E43',
            blueTop: '#003EDF',
            blueBottom: '#0729A3',
            grey: 'rgba(151, 143, 172, 0.6)',
            blueGrad: 'linear-gradient(#003EDF, #0729A3)',
            blueGradLight: 'linear-gradient(#003EDF, #003EDF, #0729A3)',
            blueVioGrad: 'linear-gradient(#5347de, #3c2a90)',
            transparent: 'rgba(255, 255, 255, 0.06)',
            transparentLight: 'rgba(255, 255, 255, 0.1)',
            transparentEv: 'rgba(52, 43, 85, 0.30)',
            blueMessage: '#151289',
            tab: '#433A65'
        },
        neonGreen: '#83FFB4',
        lightGrey: '#E3E9EC',
        roseRed: '#fa2c45',
        blueSharp: '#083ab4',
        neutralGray: '#898b8d',
        aWhite: '#fefefe',
    },
    radii: {
        block: '0.5rem',
        button: '0.5rem',
        large: '1rem',
        xl: '2rem',
    },
    components: {
        Button: {
            sizes: {
                xs: {
                    fontSize: '1rem',
                    padding: '0',
                },
            },
        },
        Radio: {
            baseStyle: {
                _checked: {
                        content: "'✔'",
                        position: 'absolute',
                        inset: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        color: 'green',
                },
            },
        },
    },
})
  