import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 8, py: 3, textAlign: "center", backgroundColor: "#d2fadcff", borderTop: "1px solid #bfbfbf" }} >
      <Typography variant="body1" color="black">
        © 2025 HotelDesk — Todos los derechos reservados
      </Typography>
    </Box>
  )
}

export default Footer