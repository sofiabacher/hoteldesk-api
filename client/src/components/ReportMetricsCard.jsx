import React from 'react'
import { Card, Typography, Box } from '@mui/material'

const ReportMetricsCard = ({ metric, index }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'good': return 'success.main'
            case 'warning': return 'warning.main'
            case 'error': return 'error.main'
            default: return 'text.secondary'
        }
    }

    return (
        <Card  sx={{ p: 3, textAlign: 'center', height: '100%', boxShadow: 2, transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }} >
            <Typography variant="h4" color="primary.main" fontWeight="bold" sx={{ mb: 1 }}> {metric.value} </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}> {metric.metric} </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography variant="body2" color={getStatusColor(metric.status)} fontWeight="600"
                    sx={{ display: 'flex', alignItems: 'center', '&::before': metric.status === 'good' ? '↑' : metric.status === 'warning' ? '→' : '↓', mr: 0.5 }}
                >
                    {metric.change}
                </Typography>
            </Box>
        </Card>
    )
}

export default ReportMetricsCard