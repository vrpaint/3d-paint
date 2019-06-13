import './Loading.css';
import * as React from 'react';

interface ILoadingProps {
    percent: number;
}

export function Loading({ percent }: ILoadingProps) {
    return <div className="Loading">{Math.round(percent * 100)}%</div>;
}
