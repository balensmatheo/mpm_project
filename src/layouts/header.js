import {AppBar, Box, Button, IconButton, Toolbar, Typography} from "@mui/material";
import {Add, PlusOne} from "@mui/icons-material";


export default function Header() {

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar color={"primary"} position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        MPM Creator Studio
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
};