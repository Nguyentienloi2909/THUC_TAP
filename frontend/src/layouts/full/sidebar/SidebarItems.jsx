import React from 'react';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = ({ items }) => {
    const { pathname } = useLocation();
    const pathDirect = pathname;

    return (
        <Box sx={{ px: 3 }}>
            <List sx={{ pt: 0 }} className="sidebarNav">
                {items && items.map((item) => {
                    if (item.navlabel) {
                        return <NavGroup item={item} key={item.subheader} />;
                    } else {
                        return (
                            <NavItem item={item} key={item.id} pathDirect={pathDirect} />
                        );
                    }
                })}
            </List>
        </Box>
    );
};

export default SidebarItems;