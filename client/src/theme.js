import { createTheme } from '@mui/material/styles'
import '@fontsource/poppins' // Fuente sans-serif para cuerpo
import '@fontsource/playfair-display' // Fuente elegante para títulos


const theme = createTheme({   //Crea un tema global
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',

        h1: { fontFamily: '"Playfair Display", serif' },
        h2: { fontFamily: '"Playfair Display", serif' },
        h3: { fontFamily: '"Playfair Display", serif' },
        h4: { fontFamily: '"Playfair Display", serif' },
    },
    palette: {
        primary: {
            main: '#29a374', // Azul elegante 3B82F6
            dark: '#147550ff',
            light: '#60A5FA'
        },

        secondary: {
            main: '#F59E0B' // Dorado suave
        },

        background: {
            default: '#ffffff', //Fondo gris claro cbd5e1
            paper: '#ffffff',
            auth: "url('/assets/background.png')"
        },

        text: {
            primary: '#1E293B', // Azul grisáceo oscuro
            secondary: '#64748B'
        }
    },

    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
            fontWeight: 600
        },

        button: {
            textTransform: 'none',   //Quita la mayúscula automática
            fontWeight: 600,
            fontSize: '1.2rem'
        }
    },

    shape: {
        borderRadius: 10   //Radio del borde para buttons, cards, etc
    },

    components: {
        MuiButton: {
            styleOverrides: {   //Se fuerza a que todos los botones de MaterialUI tengan borderRadius
                root: {  //Estilo base del componente
                    borderRadius: 10
                }
            }
        }
    },

    /*MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundImage: "url('/assets/background.png')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            },
        },
    }*/
})

export default theme