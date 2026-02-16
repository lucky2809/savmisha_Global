import { Tune } from '@mui/icons-material'
import { Box, Button, Modal, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { AnimatedCard } from '../StyledComponents/StylecComp';
import { useNavigate } from 'react-router-dom';

function ModalLogiin({ modalNavLogin, setModalmodalNav }) {
    const navigate  = useNavigate()

    // const onSubmit = () => {
    //     navigate('/login')
    // }


    return (
        <Fragment>
            <Modal sx={{ height: screen, width: screen, display: "flex", alignItems: "center ", justifyContent: "center", border: "2px solid black" }}
                open={modalNavLogin}
            // onClose={handleClose}
            >
                <AnimatedCard className='bg-white rounded-md'>
                    <Box component={"main-modal-box"} sx={{ bgcolor: "white", }} >
                        <Button onClick={() => setModalmodalNav(false)} sx={{ color: "black", width: "100%", display: "flex", justifyContent: "end" }} > <CloseIcon /> </Button>
                        <div className=' h-40 w-80 px-5 flex flex-col gap-2 justify-center'>
                            <h1 className='font-semibold text-md text-center'>If you want to log in</h1>
                            <Button onClick={() => navigate('/login')} variant='contained' sx={{ width: "100%" }}>log in</Button>
                        </div>
                    </Box>
                </AnimatedCard>
            </Modal>
        </Fragment>
    )
}

export default ModalLogiin