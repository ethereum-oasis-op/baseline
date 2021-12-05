import React from 'react'

import {Toast, ToastHeader, ToastBody} from 'reactstrap'

export const ProofToast = ({index, toast, removeToast}) => {
    return (
        <Toast fade>
            <ToastHeader icon={<span>🚢</span>} toggle={() => removeToast(index)}>
                Proof Generation Failed
            </ToastHeader>
            <ToastBody>
                {toast} should be a hit.
            </ToastBody>
        </Toast>
    )
}