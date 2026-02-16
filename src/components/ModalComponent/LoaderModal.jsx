import { Tune } from '@mui/icons-material'
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material'
import React, { Fragment } from 'react'

function LoaderModal() {
    return (
        <Fragment>

            <Modal sx={{ height: screen, width: screen, display: "flex", alignItems: "center ", justifyContent: "center", }}
                open={true}
            // onClose={handleClose}

            >
                <Box component={"main-modal-box"} sx={{outline: 0}} >

                    <div className=' h-[200px] w-[350px] flex justify-center items-center'>
                        <CircularProgress sx={{ color: "red" }} size="3rem" />
                    </div>
                </Box>
            </Modal>
        </Fragment>
    )
}

export default LoaderModal