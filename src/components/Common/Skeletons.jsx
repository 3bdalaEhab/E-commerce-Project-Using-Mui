import React from "react";
import { Grid, Card, CardContent, Skeleton, Box, Container } from "@mui/material";

export const ProductSkeleton = () => {
    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ borderRadius: "16px", height: "100%" }}>
                            <Skeleton variant="rectangular" height={260} animation="wave" />
                            <CardContent>
                                <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Skeleton variant="text" width="30%" />
                                    <Skeleton variant="circular" width={24} height={24} />
                                </Box>
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: "12px" }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export const CartSkeleton = () => {
    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: 8 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} sx={{ display: "flex", mb: 2, borderRadius: "16px", p: 0 }}>
                            <Skeleton variant="rectangular" width={200} height={160} animation="wave" />
                            <CardContent sx={{ flex: 1, p: 3 }}>
                                <Skeleton variant="text" width="60%" height={30} />
                                <Skeleton variant="text" width="30%" />
                                <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                                    <Skeleton variant="rectangular" width={100} height={35} sx={{ borderRadius: "10px" }} />
                                    <Skeleton variant="text" width={60} />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, borderRadius: "20px" }}>
                        <Skeleton variant="text" width="50%" height={30} />
                        <Skeleton variant="rectangular" height={2} sx={{ my: 2 }} />
                        <Skeleton variant="text" sx={{ mb: 2 }} />
                        <Skeleton variant="text" sx={{ mb: 3 }} />
                        <Skeleton variant="rectangular" height={50} sx={{ borderRadius: "14px" }} />
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export const WishlistSkeleton = () => {
    return (
        <Container sx={{ py: 8 }}>
            <Box sx={{ textAlign: "center", mb: 8 }}>
                <Skeleton variant="text" width="40%" height={60} sx={{ mx: "auto" }} />
                <Skeleton variant="text" width="20%" sx={{ mx: "auto" }} />
            </Box>
            <Grid container spacing={4} justifyContent="center">
                {[1, 2, 3, 4].map((i) => (
                    <Grid item key={i}>
                        <Card sx={{ width: 280, borderRadius: "16px" }}>
                            <Skeleton variant="rectangular" height={220} animation="wave" />
                            <CardContent sx={{ p: 2.5 }}>
                                <Skeleton variant="text" width="80%" height={30} sx={{ mx: "auto", mb: 1 }} />
                                <Skeleton variant="text" width="40%" sx={{ mx: "auto", mb: 2 }} />
                                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: "10px" }} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
