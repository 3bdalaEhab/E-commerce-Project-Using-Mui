import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * A highly reusable and theme-aware TextField component.
 * Standardizes styling across the application to ensure a premium look.
 */
const CustomTextField = React.memo(React.forwardRef(({
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

    return (
        <TextField
            label={label}
            type={type}
            fullWidth
            error={!!error}
            helperText={helperText}
            disabled={disabled}
            autoComplete="off"
            inputRef={ref}
            sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                    borderRadius: '16px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.01)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid transparent',
                    '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.02)',
                        borderColor: theme.palette.primary.main + '40',
                    },
                    '&.Mui-focused': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 1)',
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 0 4px ${theme.palette.primary.main}15`,
                    },
                    '&.Mui-error': {
                        borderColor: theme.palette.error.main,
                    }
                },
                '& .MuiInputBase-input': {
                    color: theme.palette.text.primary,
                    padding: '14px 16px',
                    fontWeight: 500,
                    '&::placeholder': {
                        color: theme.palette.text.disabled,
                        opacity: 1,
                    },
                },
                '& .MuiFormLabel-root': {
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main,
                    },
                    '&.Mui-error': {
                        color: theme.palette.error.main,
                    }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none', // We use the container border for a cleaner look
                },
                ...sx
            }}
            InputProps={{
                startAdornment: Icon ? (
                    <InputAdornment position="start">
                        <Icon color="primary" sx={{ opacity: 0.8 }} />
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
