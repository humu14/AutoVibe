import React from 'react';

const UserAvatar = ({ name }) => {
    const getInitials = (str) => {
        const matches = str.match(/\b(\w)/g);
        return matches.join('').toUpperCase();
    };

    const initials = name ? getInitials(name) : '';

    return (
        <div
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#4285F4', // You can change the background color
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
            }}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
