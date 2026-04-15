import React from 'react'
import { WorkOutline as WorkOutlineIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import hotelImg from '../assets/hotelImg.jpg'

const Branding = () => {
    const navigate = useNavigate()

    return (
        <Box sx={{ width: { xs: '0%', md: '50%' }, display: { xs: 'none', md: 'flex' }, minHeight: '100vh' }} >
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/home')} sx={{
                position: 'absolute', top: 20, left: 20, zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'primary.main', fontWeight: 600, px: 3, py: 1, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: 'white', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }, transition: 'all 0.3s ease'
            }} >
            </Button>

            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #29a374 0%, #1b7050 100%)', position: 'relative', overflow: 'hidden',
                '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${hotelImg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }
            }} >

                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 6 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} >
                        <WorkOutlineIcon sx={{ fontSize: 80, color: 'white', mb: 3 }} />

                        <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }} > HotelDesk </Typography>
                        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 300, lineHeight: 1.6 }} > Tu experiencia de lujo frente al mar comienza aquí </Typography>
                    </motion.div>
                </Box>
            </Box>

        </Box>
    )   
}

export default Branding