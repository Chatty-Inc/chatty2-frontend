import { createTheme } from "@material-ui/core/styles";

export default function themeOptions(mode) {
    if (mode !== 'dark' && mode !== 'light') mode = 'dark';

    const options = {
        shape: {
            borderRadius: 7,
        },
        palette: {
            mode: mode,
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#9c27b0',
            },
        },
        typography: {
            fontFamily: [
                '"Noto Sans"',
                'Roboto',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: (mode === 'dark' ?
                    `/* ====== Custom scrollbar ======= */
::-webkit-scrollbar {
    background-color: #fff;
    width: 14px
}

/* Background of the scrollbar except button or resizer */
::-webkit-scrollbar-track {
    background-color: #2c2c2c;
}

::-webkit-scrollbar-corner {
    background-color: #2c2c2c;
}

body.light ::-webkit-scrollbar-track, body.light ::-webkit-scrollbar-corner {
    background-color: rgb(223, 223, 223);
}

/* scrollbar itself */
::-webkit-scrollbar-thumb {
    background-color: rgb(107, 107, 107);
    border-radius: 14px;
    border: 3px solid #2c2c2c;
    transition: all 500ms ease-out;
}
::-webkit-scrollbar-thumb:hover {
    background-color: rgb(149, 149, 149);
}

.light *::-webkit-scrollbar-thumb {
    background-color: rgb(150, 150, 150) !important;
    border: 3px solid rgb(223, 223, 223) !important;
}
.light *::-webkit-scrollbar-thumb:hover {
    background-color: rgb(101, 101, 101) !important;
}
/* ============ */` : ''),
            },
        }
    }
    return (createTheme(options));
}