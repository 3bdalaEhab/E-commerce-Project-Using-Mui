import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Container,
    useTheme,
} from "@mui/material";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CategoriesSkeleton } from "../../components/Common/Skeletons";
import PageMeta from "../../components/PageMeta/PageMeta";
import EmptyState from "../../components/Common/EmptyState";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateAPIContent } from "../../utils/localization";
import { categoryService } from "../../services";
import { Category } from "../../types";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const Categories: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getCategories(),
        select: (res) => res.data
    });

    if (isLoading) return <CategoriesSkeleton />;

    if (isError)
        return (
            <EmptyState
                title={t("common.somethingWentWrong")}
                description={t("categories.errorDesc")}
                actionText={t("common.retry")}
                onAction={() => window.location.reload()}
                icon={<Box sx={{ color: 'error.main' }}>⚠️</Box>}
            />
        );

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta
                title={t("PageMeta.categoriesTitle")}
                description={t("PageMeta.categoriesDesc")}
            />

            <Box sx={{ pt: 10, pb: 6, textAlign: "center" }}>
                <Typography variant="h3" fontWeight="1000" sx={{ mb: 1, letterSpacing: -1.5 }}>
                    {t("categories.title")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("categories.subtitle")}
                </Typography>
            </Box>

            <Container maxWidth="xl">
                <Box
                    component={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: 4,
                        px: { xs: 2, md: 4 }
                    }}
                >
                    <AnimatePresence>
                        {data?.map((category: Category) => (
                            <motion.div
                                key={category._id}
                                variants={itemVariants}
                                style={{ height: "100%" }}
                            >
                                <Card
                                    onClick={() => navigate("/products")}
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: "32px",
                                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: `1px solid ${theme.palette.divider}`,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                        "&:hover": {
                                            borderColor: theme.palette.primary.main,
                                            transform: "translateY(-16px)",
                                            boxShadow:
                                                theme.palette.mode === "dark"
                                                    ? "0 30px 60px rgba(0,0,0,0.6)"
                                                    : "0 30px 60px rgba(0,0,0,0.1)",
                                            "& .category-label": { color: theme.palette.primary.main }
                                        },
                                    }}
                                >
                                    <Box sx={{ position: "relative", height: 380, overflow: "hidden" }}>
                                        <CardMedia
                                            component="img"
                                            image={category.image}
                                            alt={category.name}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                ".MuiCard-root:hover &": { transform: "scale(1.15)" }
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(to top, rgba(2,6,23,0.8) 0%, transparent 60%)",
                                                opacity: 0.8,
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ textAlign: "center", py: 5, px: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography
                                            className="category-label"
                                            variant="h4"
                                            noWrap
                                            sx={{
                                                fontWeight: 1000,
                                                letterSpacing: "-1.5px",
                                                textTransform: "capitalize",
                                                mb: 1,
                                                transition: "color 0.4s ease",
                                            }}
                                        >
                                            {translateAPIContent(category.name, 'categories')}
                                        </Typography>
                                        <Typography
                                            variant="button"
                                            color="text.secondary"
                                            sx={{
                                                fontWeight: "900",
                                                letterSpacing: "2px",
                                                fontSize: "0.75rem",
                                                borderBottom: "2px solid transparent",
                                                display: "inline-block",
                                                mx: "auto",
                                                pb: 0.5,
                                                transition: "all 0.3s ease",
                                                opacity: 0.6
                                            }}
                                        >
                                            {t("categories.browseCollection")}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Box>
            </Container>
        </Box>
    );
};

export default Categories;
