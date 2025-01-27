import React from 'react';

const Iframe = ({ source }) => {

    if (!source) {
        return <div>Loading...</div>;
    }

    const src = source;     
    return (
        <iframe src={src} width="100%" height="600px"></iframe>
    );
};

export default Iframe;