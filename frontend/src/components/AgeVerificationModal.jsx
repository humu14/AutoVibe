// AgeVerificationModal.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Dialog,
    DialogHeader,
    DialogBody,
} from "@material-tailwind/react";
import Button from '@mui/material/Button';

export default function AgeVerificationModal({ isOpen, onClose, onConfirm }) {
    const [isOver18, setIsOver18] = useState(null);
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (userInfo) {
            setIsOver18(true); // Assuming the user is verified if authenticated
        }
    }, [userInfo]);

    const handleYes = () => {
        console.log("Yes Clicked");
        setIsOver18(true);
        onConfirm(true);
        onClose();
    };

    const handleNo = () => {
        console.log("No Clicked");
        setIsOver18(false);
        onConfirm(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} handler={onClose}>
            <DialogHeader>Are you 18 years or older?</DialogHeader>
            <DialogBody className="text-center flex justify-center space-x-4">
                <Button
                    color="success"
                    variant="contained"
                    onClick={handleYes}
                    disabled={isOver18 === false}
                >
                    Yes
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={handleNo}
                    disabled={isOver18 === true}
                >
                    No
                </Button>
            </DialogBody>
        </Dialog>
    );
}
