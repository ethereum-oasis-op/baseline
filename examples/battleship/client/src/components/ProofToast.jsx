import React from 'react'

import {Toast, ToastHeader, ToastBody} from 'reactstrap'

export const ProofToast = ({index, toast, removeToast}) => {
    return (
        <Toast fade>
            <ToastHeader icon={<span>🚢</span>} toggle={() => removeToast(index)}>
                Proof Verification Failed
            </ToastHeader>
            <ToastBody>
                {toast.coord} should be a {toast.attempt ? 'miss' : 'hit'}.
            </ToastBody>
        </Toast>
    )
}