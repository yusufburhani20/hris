import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/icon-512.png"
            alt="HRIS Enterprise Logo"
            {...props}
        />
    );
}
