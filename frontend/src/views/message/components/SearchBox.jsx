import { TextField, useTheme } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

const SearchBox = () => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
            placeholder="Search messages..."
            variant="outlined"
            size="small"
            InputProps={{
                startAdornment: (
                    <IconSearch
                        size={20}
                        style={{
                            marginRight: theme.spacing(1),
                            color: theme.palette.text.secondary
                        }}
                    />
                ),
                sx: {
                    borderRadius: '20px',
                    bgcolor: theme.palette.background.paper,
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: theme.palette.divider,
                        },
                        '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                        },
                    }
                }
            }}
        />
    );
};

export default SearchBox;
