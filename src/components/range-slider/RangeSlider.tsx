import React, { useEffect, useRef, useState } from 'react';
import './RangeSlider.css';

type RangeSliderProps = {
    min: number;
    max: number;
    step: number;
    formatLabel?: (value: number) => string;
    value?: number[] | readonly number[];
    onValueChange?: (values: number[]) => void;
}

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
    (
        {
            min,
            max,
            step,
            formatLabel = (value) => value.toString(),
            value = [min, max],
            onValueChange = () => { }
        }: RangeSliderProps,
        ref
    ) => {
        const initialValue = Array.isArray(value) ? value : [min, max];
        const [localValues, setLocalValues] = useState(initialValue);
        const [dragging, setDragging] = useState<number | null>(null);

        const trackRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setLocalValues(Array.isArray(value) ? value : [min, max]);
        }, [min, max, value]);

        const calculatePercentage = (value: number) => {
            return ((value - min) / (max - min)) * 100;
        };

        const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
            e.preventDefault();
            setDragging(index);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (dragging === null || !trackRef.current) return;

            const trackRect = trackRef.current.getBoundingClientRect();
            const position = (e.clientX - trackRect.left) / trackRect.width;
            const newValue = Math.round(min + position * (max - min) / step) * step;

            const newValues = [...localValues];

            if (dragging === 0) {
                // Left thumb
                newValues[0] = Math.min(Math.max(newValue, min), localValues[1] - step);
            } else {
                // Right thumb
                newValues[1] = Math.max(Math.min(newValue, max), localValues[0] + step);
            }

            handleValueChange(newValues);
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        useEffect(() => {
            if (dragging !== null) {
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);

                return () => {
                    window.removeEventListener('mousemove', handleMouseMove);
                    window.removeEventListener('mouseup', handleMouseUp);
                };
            }
        }, [dragging, localValues, handleMouseMove]);

        const handleValueChange = (newValues: number[]) => {
            setLocalValues(newValues);
            if (onValueChange) {
                onValueChange(newValues);
            }
        };

        return (
            <div className="range-slider" ref={ref}>
                <div className="range-slider-track" ref={trackRef}>
                    <div
                        className="range-slider-range"
                        style={{
                            left: `${calculatePercentage(localValues[0])}%`,
                            right: `${100 - calculatePercentage(localValues[1])}%`
                        }}
                    />
                    {localValues.map((value, index) => (
                        <React.Fragment key={index}>
                            <div
                                className="range-slider-value-label"
                                style={{ left: `calc(${calculatePercentage(value)}%)` }}
                            >
                                <span>{formatLabel ? formatLabel(value) : value}</span>
                            </div>
                            <div
                                className="range-slider-thumb"
                                style={{ left: `${calculatePercentage(value)}%` }}
                                onMouseDown={handleMouseDown(index)}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
);

RangeSlider.displayName = 'RangeSlider';

export default RangeSlider;