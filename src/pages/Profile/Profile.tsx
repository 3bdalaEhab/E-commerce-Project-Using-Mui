import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Tabs,
    Tab,
    Stack,
    TextField,
    Button,
    Avatar,
    useTheme,
    Card,
    CardContent,
    IconButton,
    Divider
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, addressService } from "../../services";
import { useToast } from "../../Context";
import PageMeta from "../../components/PageMeta/PageMeta";
import { Address } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
        </div>
    );
}

const Profile: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    // User Data Query
    // const { data: userData } = useQuery({ ... }); // Assuming context or simple local storage for name for now, or fetch from getMe

    // Addresses Query
    const { data: addressesData, isLoading: addressesLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: addressService.getAddresses,
        select: res => res.data
    });

    // Add Address Mutation
    const addAddressMutation = useMutation({
        mutationFn: addressService.addAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            showToast("✅ Address added successfully", "success");
            setNewAddress({ name: '', details: '', phone: '', city: '' });
            setShowAddAddress(false);
        },
        onError: () => showToast("❌ Failed to add address", "error")
    });

    // Remove Address Mutation
    const removeAddressMutation = useMutation({
        mutationFn: addressService.removeAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            showToast("🗑️ Address removed", "success");
        }
    });

    const [showAddAddress, setShowAddAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({ name: '', details: '', phone: '', city: '' });

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAddressMutation.mutate(newAddress);
    };

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
            <PageMeta title="My Profile" description="Manage your account settings" />

            {/* Header */}
            <Box sx={{
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.4)' : 'primary.main',
                color: 'white',
                pt: { xs: 4, md: 8 },
                pb: { xs: 8, md: 12 },
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar sx={{ width: 100, height: 100, fontSize: '3rem', bgcolor: 'white', color: 'primary.main', fontWeight: 900, boxShadow: theme.shadows[10] }}>
                            M
                        </Avatar>
                        <Box>
                            <Typography variant="h3" fontWeight="900">My Account</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.8 }}>Welcome back, User</Typography>
                        </Box>
                    </Stack>
                </Container>
                {/* Decorative Circle */}
                <Box sx={{
                    position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)'
                }} />
            </Box>

            <Container maxWidth="lg" sx={{ mt: -8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: "24px",
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: 'background.paper',
                        boxShadow: theme.shadows[4],
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        minHeight: 600
                    }}
                >
                    {/* Sidebar Tabs */}
                    <Box sx={{
                        width: { xs: '100%', md: 280 },
                        borderRight: { md: `1px solid ${theme.palette.divider}` },
                        borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                    }}>
                        <Tabs
                            orientation="vertical"
                            value={activeTab}
                            onChange={(e, v) => setActiveTab(v)}
                            sx={{
                                '& .MuiTabs-indicator': { width: 4, left: 0, borderRadius: '0 4px 4px 0' },
                                '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', pl: 4, py: 3, fontWeight: 700, fontSize: '1rem', textTransform: 'none' },
                                '& .Mui-selected': { bgcolor: 'action.selected', color: 'primary.main' }
                            }}
                        >
                            <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
                            <Tab icon={<LocationOnIcon />} iconPosition="start" label="Addresses" />
                            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="My Orders" />
                            <Tab icon={<LogoutIcon />} iconPosition="start" label="Logout" sx={{ color: 'error.main', mt: 'auto' }} />
                        </Tabs>
                    </Box>

                    {/* Content Area */}
                    <Box sx={{ flex: 1 }}>
                        <TabPanel value={activeTab} index={0}>
                            <Typography variant="h5" fontWeight="800" gutterBottom>Personal Information</Typography>
                            <Typography color="text.secondary" mb={4}>Update your personal details here.</Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Full Name" defaultValue="" variant="outlined" InputProps={{ sx: { borderRadius: "12px" } }} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Email Address" defaultValue="" disabled variant="outlined" InputProps={{ sx: { borderRadius: "12px" } }} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField fullWidth label="Phone Number" defaultValue="" variant="outlined" InputProps={{ sx: { borderRadius: "12px" } }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" size="large" sx={{ borderRadius: "12px", px: 4, py: 1.5, fontWeight: 900 }}>
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={activeTab} index={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                                <Box>
                                    <Typography variant="h5" fontWeight="800">Address Book</Typography>
                                    <Typography color="text.secondary">Manage your shipping destinations</Typography>
                                </Box>
                                <Button
                                    startIcon={<AddIcon />}
                                    variant="contained"
                                    sx={{ borderRadius: "12px", fontWeight: 800 }}
                                    onClick={() => setShowAddAddress(!showAddAddress)}
                                >
                                    Add New
                                </Button>
                            </Stack>

                            {/* Add Address Form */}
                            <AnimatePresence>
                                {showAddAddress && (
                                    <Box component={motion.div} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} sx={{ overflow: 'hidden', mb: 4 }}>
                                        <Card variant="outlined" sx={{ borderRadius: "16px", mb: 4, border: `1px dashed ${theme.palette.primary.main}` }}>
                                            <CardContent>
                                                <form onSubmit={handleAddressSubmit}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth label="Alias (e.g., Home, Work)" required
                                                                value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth label="Detailed Address" required
                                                                value={newAddress.details} onChange={e => setNewAddress({ ...newAddress, details: e.target.value })}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth label="Phone" required
                                                                value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                fullWidth label="City" required
                                                                value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                                                <Button onClick={() => setShowAddAddress(false)} color="inherit">Cancel</Button>
                                                                <Button type="submit" variant="contained">Save Address</Button>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}
                            </AnimatePresence>

                            <Stack spacing={2}>
                                {addressesLoading ? (
                                    <Typography>Loading addresses...</Typography>
                                ) : addressesData?.length === 0 ? (
                                    <Typography color="text.secondary" align="center" py={4}>No addresses saved yet.</Typography>
                                ) : (
                                    addressesData?.map((addr: Address) => (
                                        <Paper key={addr._id} variant="outlined" sx={{ p: 3, borderRadius: "16px", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                                    <Typography variant="h6" fontWeight="800">{addr.name}</Typography>
                                                    <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>{addr.city}</Typography>
                                                </Stack>
                                                <Typography color="text.secondary" variant="body2">{addr.details}</Typography>
                                                <Typography color="text.secondary" variant="body2">{addr.phone}</Typography>
                                            </Box>
                                            <IconButton onClick={() => removeAddressMutation.mutate(addr._id)} color="error" sx={{ bgcolor: 'error.lighter' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Paper>
                                    ))
                                )}
                            </Stack>
                        </TabPanel>

                        <TabPanel value={activeTab} index={2}>
                            <Typography variant="h5" fontWeight="800" gutterBottom>Order History</Typography>
                            <Typography color="text.secondary">Track your past purchases.</Typography>
                            <Box sx={{ py: 8, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">Coming Soon...</Typography>
                            </Box>
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Profile;
