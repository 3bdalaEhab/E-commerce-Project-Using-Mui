import React from "react";
import { Box, Skeleton, Grid, useTheme, Card, CardContent } from "@mui/material";

interface SkeletonGridProps {
    count?: number;
    type?: "product" | "category";
}

const ProductSkeleton = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: "28px",
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Skeleton variant="rectangular" height={280} animation="wave" />
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Skeleton variant="text" width="40%" height={20} animation="wave" />
                    <Skeleton variant="circular" width={20} height={20} animation="wave" />
                </Box>
                <Skeleton variant="text" width="80%" height={32} animation="wave" sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} animation="wave" />
                <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Skeleton variant="text" width={40} height={15} animation="wave" />
                        <Skeleton variant="text" width={60} height={30} animation="wave" />
                    </Box>
                    <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} animation="wave" />
                </Box>
            </CardContent>
        </Card>
    );
};

const CategorySkeleton = () => {
    const theme = useTheme();
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: "32px",
                overflow: "hidden",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Skeleton variant="rectangular" height={380} animation="wave" />
            <CardContent sx={{ textAlign: "center", py: 5 }}>
                <Skeleton variant="text" width="60%" height={40} sx={{ mx: "auto", mb: 2 }} animation="wave" />
                <Skeleton variant="text" width="40%" height={20} sx={{ mx: "auto" }} animation="wave" />
            </CardContent>
        </Card>
    );
};

const SkeletonLoader: React.FC<SkeletonGridProps> = ({ count = 8, type = "product" }) => {
    return (
        <Grid container spacing={4}>
            {Array.from({ length: count }).map((_, index) => (
                <Grid
                    key={index}
                    size={type === "product" ? { xs: 12, sm: 6, md: 4, lg: 3 } : { xs: 12, sm: 6, lg: 4 }}
                >
                    {type === "product" ? <ProductSkeleton /> : <CategorySkeleton />}
                </Grid>
            ))}
        </Grid>
    );
};

export default SkeletonLoader;
