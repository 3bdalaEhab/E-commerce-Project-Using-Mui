import React from 'react';
import { Box, Skeleton, Grid, Paper, Container } from '@mui/material';

export const ProductSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Grid item key={item} xs={12} sm={6} md={4} lg={3}>
                    <Paper sx={{ p: 2, borderRadius: '24px' }}>
                        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '16px', mb: 2 }} />
                        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="80%" height={28} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: '12px' }} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);

export const CartSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
                {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Skeleton variant="rectangular" width={200} height={150} sx={{ borderRadius: '16px' }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={30} />
                            <Skeleton variant="text" width="40%" height={24} />
                            <Skeleton variant="rectangular" width={100} height={40} sx={{ mt: 2, borderRadius: '8px' }} />
                        </Box>
                    </Box>
                ))}
            </Grid>
            <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '24px' }} />
            </Grid>
        </Grid>
    </Container>
);

export const WishlistSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} justifyContent="center">
            {[1, 2, 3, 4].map((item) => (
                <Grid item key={item}>
                    <Paper sx={{ p: 2, borderRadius: '24px', width: 300 }}>
                        <Skeleton variant="rectangular" height={240} sx={{ borderRadius: '16px', mb: 2 }} />
                        <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
                        <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mb: 2 }} />
                        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);
