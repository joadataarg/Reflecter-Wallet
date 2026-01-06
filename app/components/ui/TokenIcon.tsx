import React from 'react';

interface TokenIconProps {
    src: string;
    alt: string;
    fallback: string;
    size?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ src, alt, fallback, size = 'w-6 h-6' }) => {
    const [imgError, setImgError] = React.useState(false);

    if (imgError) {
        return <span className="text-white font-bold text-sm">{fallback}</span>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={size}
            onError={() => setImgError(true)}
        />
    );
};
