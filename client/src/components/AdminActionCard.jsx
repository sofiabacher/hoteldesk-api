import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Typography, Box } from '@mui/material'

const AdminActionCard = ({
    title,
    icon: Icon,
    color,
    route,
    action,
    isPrimary = false,
    navigate,
    // Para uso como tarjeta de estadísticas
    value,
    subtitle,
    change,
    changeType = 'neutral', // 'positive', 'negative', 'neutral'
    showStats = false,
    statsColor = 'primary.main'
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={showStats ? {} : { y: -4 }}
    >
        <Card
            sx={{
                height: showStats ? '180px' : '100%',
                minHeight: showStats ? '180px' : 'auto',
                cursor: showStats ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                background: isPrimary
                    ? 'linear-gradient(135deg, rgba(41, 163, 116, 0.95) 0%, rgba(41, 163, 116, 0.85) 100%)'
                    : showStats
                        ? 'white'
                        : 'primary.main',
                border: isPrimary || showStats ? '2px solid' : '2px solid transparent',
                borderColor: showStats ? 'divider' : 'primary.main',
                boxShadow: isPrimary || showStats ? 6 : 2,
                '&:hover': {
                    transform: showStats ? 'none' : 'translateY(-6px) scale(1.02)',
                    boxShadow: isPrimary || showStats ? 8 : 6,
                    background: isPrimary
                        ? 'linear-gradient(135deg, rgba(41, 163, 116, 1) 0%, rgba(41, 163, 116, 0.95) 100%)'
                        : showStats
                            ? 'white'
                            : 'linear-gradient(135deg, rgba(41, 163, 116, 0.05) 0%, rgba(41, 163, 116, 0.02) 100%)',
                    border: '2px solid',
                    borderColor: 'primary.main'
                }
            }}
            onClick={() => showStats ? null : (route ? navigate(route) : action?.())}
        >
            <CardContent sx={{ textAlign: showStats ? 'left' : 'center', py: 4, px: 3 }}>
                {!showStats ? (
                    <>
                        <Box sx={{
                            backgroundColor: isPrimary ? 'rgba(255, 255, 255, 0.2)' : 'primary.main',
                            p: 3,
                            borderRadius: '50%',
                            display: 'inline-flex',
                            mb: 3,
                            mx: 'auto',
                            boxShadow: isPrimary ? '0 8px 32px rgba(0,0,0,0.1)' : '0 4px 16px rgba(41, 163, 116, 0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <Icon sx={{ fontSize: 56, color: isPrimary ? 'white' : 'white' }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" color={isPrimary ? 'white' : 'primary.main'} gutterBottom sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                            {title}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                            <Box sx={{
                                backgroundColor: statsColor,
                                p: 2,
                                borderRadius: 2,
                                mr: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon sx={{ fontSize: 32, color: 'white' }} />
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {title}
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">
                                    {value}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            {subtitle && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {subtitle}
                                </Typography>
                            )}
                            {change && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 'medium',
                                        color: changeType === 'positive' ? 'success.main' :
                                              changeType === 'negative' ? 'error.main' : 'text.secondary'
                                    }}
                                >
                                    {change}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    </motion.div>
)

export default AdminActionCard