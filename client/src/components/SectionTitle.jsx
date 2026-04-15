import { Box, Typography } from '@mui/material'


const SectionTitle = ({ children, subtitle, color = 'primary.main' }) => (
  <Box sx={{ textAlign: 'center', mb: 7 }}>
    <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: color, fontSize: { xs: '2rem', md: '2.75rem' }, marginBottom: 2, letterSpacing: '-0.02em' }} >
      {children}
    </Typography>

    {subtitle && (
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: '1.1rem', paddingBottom: 2 }}>
        {subtitle}
      </Typography>
    )}

    <Box sx={{ width: 80, height: 4, backgroundColor: 'secondary.main', margin: '0 auto', borderRadius: 2 }} />
  </Box>
)

export default SectionTitle