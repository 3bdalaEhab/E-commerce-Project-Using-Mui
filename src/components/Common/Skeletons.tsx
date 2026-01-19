import React from 'react';
import { Box, Skeleton, Grid, Paper, Container, Divider } from '@mui/material';

export const ProductSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item}>
                    <Paper sx={{ p: 0, borderRadius: '24px', height: '100%', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>
                        <Skeleton variant="rectangular" height={280} />
                        <Box sx={{ p: 3, pt: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Skeleton variant="text" width="30%" height={20} />
                                <Skeleton variant="circular" width={24} height={24} />
                            </Box>
                            <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Skeleton variant="text" width={40} height={16} />
                                    <Skeleton variant="text" width={80} height={32} />
                                </Box>
                                <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);

export const CartSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
                {[1, 2, 3].map((item) => (
                    <Paper key={item} sx={{ display: 'flex', gap: 3, p: 3, mb: 3, borderRadius: '24px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <Skeleton variant="rectangular" width={180} height={180} sx={{ borderRadius: '20px' }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={36} />
                            <Skeleton variant="text" width="20%" height={24} sx={{ mb: 2 }} />
                            <Skeleton variant="text" width="40%" height={24} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 2 }}>
                                <Skeleton variant="rectangular" width={120} height={42} sx={{ borderRadius: '12px' }} />
                                <Skeleton variant="circular" width={48} height={48} />
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '24px' }} />
            </Grid>
        </Grid>
    </Container>
);

export const WishlistSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3} justifyContent="center">
            {[1, 2, 3, 4].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item}>
                    <Paper sx={{ p: 0, borderRadius: '24px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                        <Skeleton variant="rectangular" height={240} />
                        <Box sx={{ p: 2 }}>
                            <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px' }} />
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);

export const DetailsSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
        <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
            <Skeleton variant="text" width={60} height={24} />
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="text" width={120} height={24} />
        </Box>
        <Paper sx={{ p: 0, borderRadius: '32px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Grid container>
                <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 2, md: 4 } }}>
                    <Skeleton variant="rectangular" height={500} sx={{ borderRadius: '24px' }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ p: { xs: 4, md: 6 } }}>
                        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="90%" height={60} sx={{ mb: 3 }} />
                        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={100} sx={{ mb: 4, borderRadius: '16px' }} />
                        <Divider sx={{ mb: 4 }} />
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width={60} height={20} />
                                <Skeleton variant="text" width={150} height={48} />
                            </Box>
                            <Skeleton variant="rectangular" width="100%" height={60} sx={{ flex: 2, borderRadius: '14px' }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    </Container>
);

export const CategoriesSkeleton: React.FC = () => (
    <Container maxWidth="lg" sx={{ py: 8 }}>
        <Skeleton variant="text" width="30%" height={48} sx={{ mb: 4, mx: 'auto' }} />
        <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item}>
                    <Paper sx={{ p: 2, borderRadius: '24px', textAlign: 'center' }}>
                        <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                        <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    </Container>
);
