import React from 'react';
import { TextField, InputAdornment, TextFieldProps, useTheme } from '@mui/material';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
    label: string;
    icon?: React.ElementType;
    error?: boolean | string | any;
    helperText?: React.ReactNode;
}

/**
 * A "Triple-A" Premium, theme-aware TextField component.
 * Features advanced glassmorphism, smooth transitions, and pixel-perfect dark mode integration.
 */
const CustomTextField = React.memo(React.forwardRef<HTMLDivElement, CustomTextFieldProps>(({
    label,
    icon: Icon,
    error,
    helperText,
    disabled,
    type = 'text',
    InputProps,
    sx = {},
    ...props
}, ref) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <TextField
            label={label}
            type={type}
            fullWidth
            error={!!error}
            helperText={helperText}
            disabled={disabled}
            autoComplete="off"
            ref={ref}
            sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                    borderRadius: '16px',
                    backgroundColor: isDark
                        ? 'rgba(30, 41, 59, 0.5)' // Sophisticated slate in dark mode
                        : 'rgba(248, 250, 252, 0.8)', // Ultra-light subtle gray in light mode
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    '&:hover': {
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(248, 250, 252, 1)',
                        borderColor: `${theme.palette.primary.main}40`,
                        transform: 'translateY(-1px)',
                    },
                    '&.Mui-focused': {
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : '#fff',
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 4px ${theme.palette.primary.main}15`,
                        transform: 'translateY(-2px)',
                    },
                    '&.Mui-error': {
                        borderColor: theme.palette.error.main,
                        '&.Mui-focused': {
                            boxShadow: `0 0 0 4px ${theme.palette.error.main}15`,
                        }
                    }
                },
                '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    padding: '14px 16px',
                    fontWeight: 500,
                    fontSize: '1rem',
                    '&::placeholder': {
                        color: theme.palette.text.disabled,
                        opacity: 1,
                    },
                },
                '& .MuiFormLabel-root': {
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    ml: Icon ? 0 : 0.5,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                    },
                    '&.Mui-error': {
                        color: theme.palette.error.main,
                    }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                },
                '& .MuiInputAdornment-root': {
                    color: theme.palette.text.secondary,
                },
                '& .MuiIconButton-root': {
                    color: theme.palette.text.secondary,
                    '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`,
                        color: theme.palette.primary.main,
                    }
                },
                ...sx
            }}
            InputProps={{
                startAdornment: Icon ? (
                    <InputAdornment position="start">
                        <Icon
                            sx={{
                                fontSize: '1.2rem',
                                color: !!error ? 'error.main' : 'primary.main',
                                opacity: disabled ? 0.3 : 0.8,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </InputAdornment>
                ) : null,
                ...InputProps,
            }}
            {...props}
        />
    );
}));

CustomTextField.displayName = 'CustomTextField';

export default CustomTextField;
