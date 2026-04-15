import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Typography, Box } from '@mui/material'

const StatCard = ({ title, value, icon: Icon, color, iconColor, subtitle, trend, isHighlighted = false }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -5 }}>
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible', boxShadow: isHighlighted ? 4 : 2, '&:hover': { boxShadow: 6 }, border: isHighlighted ? `2px solid` : '1px solid', 
            borderColor: isHighlighted ? 'primary.main' : 'divider', background: isHighlighted ? 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)' : 'white', transition: 'all 0.3s ease' }}
        >
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: 180 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Icon sx={{ fontSize: 48, color: iconColor, display: 'block' }} />
                </Box>

                <Typography variant="h3" component="div" color={color} fontWeight="bold" sx={{ mb: 0.5, fontSize: '2.2rem', lineHeight: 1, textAlign: 'center' }}>
                    {value}
                </Typography>

                <Typography variant="h6" color="text.secondary" fontWeight="600" sx={{ mb: subtitle ? 1 : 0, textAlign: 'center', fontSize: '0.95rem' }}>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: trend ? 1 : 0, textAlign: 'center', fontSize: '0.8rem', opacity: 0.8 }}>
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    </motion.div>
)

export default StatCard