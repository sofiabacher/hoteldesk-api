import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'

const ReportHeader = ({ title, subtitle, icon: Icon, color }) => {
    const navigate = useNavigate()
    const handleBackToDashboard = () => { navigate('/admin') }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToDashboard}
                   sx={{ mr: 3, borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: 'primary.dark', backgroundColor: 'rgba(41, 163, 116, 0.04)' } }}
                >
                    Volver al panel
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ backgroundColor: color || 'primary.main', p: 1.5, borderRadius: 2, mr: 2 }}>
                        <Icon sx={{ fontSize: 32, color: 'white' }} />
                    </Box>
                    
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary.main"> {title} </Typography>
                        <Typography variant="body1" color="text.secondary"> {subtitle} </Typography>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    )
}

export default ReportHeader