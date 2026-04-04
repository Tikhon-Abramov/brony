import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import Select from './Select';

type TimeInputProps = {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    minHour?: number;
    maxHour?: number;
    minuteStep?: number;
    placeholder?: string;
    disabled?: boolean;
};

function pad(value: number) {
    return String(value).padStart(2, '0');
}

function clampHour(hour: number, minHour: number, maxHour: number) {
    if (Number.isNaN(hour)) return minHour;
    return Math.min(Math.max(hour, minHour), maxHour);
}

function clampMinute(minute: number) {
    if (Number.isNaN(minute)) return 0;
    return Math.min(Math.max(minute, 0), 59);
}

function normalizeTime(value: string, minHour: number, maxHour: number) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) {
        return '';
    }

    const left = digits.slice(0, 2);
    const right = digits.slice(2, 4);

    if (digits.length <= 2) {
        return `${left}:`;
    }

    const hour = clampHour(Number(left), minHour, maxHour);
    const minute = clampMinute(Number(right));

    return `${pad(hour)}:${pad(minute)}`;
}

function ensureCompleteTime(value: string, minHour: number, maxHour: number) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) {
        return `${pad(minHour)}:00`;
    }

    const left = digits.slice(0, 2);
    const right = digits.slice(2, 4);

    const hour = clampHour(Number(left || minHour), minHour, maxHour);
    const minute = clampMinute(Number((right || '0').padEnd(2, '0')));

    return `${pad(hour)}:${pad(minute)}`;
}

function splitTime(value: string, minHour: number) {
    const safeValue =
        /^\d{2}:\d{2}$/.test(value) ? value : `${pad(minHour)}:00`;

    const [hour, minute] = safeValue.split(':');
    return { hour, minute };
}

export default function TimeInput({
                                      id,
                                      value,
                                      onChange,
                                      minHour = 9,
                                      maxHour = 23,
                                      minuteStep = 1,
                                      placeholder = 'чч:мм',
                                      disabled = false,
                                  }: TimeInputProps) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const { hour, minute } = useMemo(
        () => splitTime(value, minHour),
        [value, minHour],
    );

    const hourOptions = useMemo(
        () =>
            Array.from({ length: maxHour - minHour + 1 }, (_, index) => {
                const currentHour = minHour + index;
                return {
                    value: pad(currentHour),
                    label: pad(currentHour),
                };
            }),
        [minHour, maxHour],
    );

    const minuteOptions = useMemo(() => {
        const result: { value: string; label: string }[] = [];

        for (let minuteValue = 0; minuteValue < 60; minuteValue += minuteStep) {
            result.push({
                value: pad(minuteValue),
                label: pad(minuteValue),
            });
        }

        return result;
    }, [minuteStep]);

    useEffect(() => {
        if (!open) return;

        const handleOutside = (event: MouseEvent) => {
            if (!rootRef.current) return;

            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const handleInputChange = (nextValue: string) => {
        const formatted = normalizeTime(nextValue, minHour, maxHour);
        onChange(formatted);
    };

    const handleInputBlur = () => {
        onChange(ensureCompleteTime(value, minHour, maxHour));
    };

    const handleHourChange = (nextHour: string) => {
        onChange(`${nextHour}:${minute}`);
    };

    const handleMinuteChange = (nextMinute: string) => {
        onChange(`${hour}:${nextMinute}`);
    };

    return (
        <Root ref={rootRef}>
            <InputWrap>
                <StyledInput
                    id={id}
                    type="text"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={5}
                />

                <IconButton
                    type="button"
                    onClick={() => !disabled && setOpen((prev) => !prev)}
                    disabled={disabled}
                    aria-label="Выбрать время"
                    $open={open}
                >
                    <ClockIcon viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M12 7.25V12L15.25 14M21 12A9 9 0 1 1 3 12A9 9 0 0 1 21 12Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </ClockIcon>
                </IconButton>
            </InputWrap>

            {open && (
                <Picker>
                    <PickerColumn>
                        <PickerLabel>Часы</PickerLabel>
                        <Select value={hour} onChange={handleHourChange} options={hourOptions} />
                    </PickerColumn>

                    <Divider>:</Divider>

                    <PickerColumn>
                        <PickerLabel>Минуты</PickerLabel>
                        <Select
                            value={minute}
                            onChange={handleMinuteChange}
                            options={minuteOptions}
                        />
                    </PickerColumn>
                </Picker>
            )}
        </Root>
    );
}

const Root = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 12px 52px 12px 14px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.muted};
  }

  &:focus {
    border-color: rgba(125, 220, 255, 0.24);
    box-shadow: 0 0 0 3px rgba(125, 220, 255, 0.12);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button<{ $open: boolean }>`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme, $open }) =>
    $open ? 'rgba(125, 220, 255, 0.28)' : theme.line};
  background: ${({ theme }) => theme.panel};
  color: ${({ theme }) => theme.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    border-color: rgba(125, 220, 255, 0.22);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const ClockIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const Picker = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  z-index: 1300;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.panel};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(18px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: end;
`;

const PickerColumn = styled.div`
  min-width: 0;
`;

const PickerLabel = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
`;

const Divider = styled.div`
  padding-bottom: 12px;
  font-size: 18px;
  color: ${({ theme }) => theme.muted};
  font-weight: 600;
`;