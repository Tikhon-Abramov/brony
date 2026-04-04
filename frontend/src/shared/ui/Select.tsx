import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type SelectOption<T extends string = string> = {
    value: T;
    label: string;
};

type SelectProps<T extends string = string> = {
    value: T;
    onChange: (value: T) => void;
    options: SelectOption<T>[];
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
};

export default function Select<T extends string = string>({
                                                              value,
                                                              onChange,
                                                              options,
                                                              placeholder = 'Выбрать',
                                                              disabled = false,
                                                              id,
                                                              className,
                                                          }: SelectProps<T>) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const activeOption = useMemo(
        () => options.find((option) => option.value === value),
        [options, value],
    );

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
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

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    const handleToggle = () => {
        if (disabled) return;
        setOpen((prev) => !prev);
    };

    const handleSelect = (nextValue: T) => {
        onChange(nextValue);
        setOpen(false);
    };

    return (
        <Root ref={rootRef} className={className}>
            <Trigger
                id={id}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                $open={open}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <TriggerText $placeholder={!activeOption}>
                    {activeOption?.label ?? placeholder}
                </TriggerText>

                <Chevron $open={open} viewBox="0 0 20 20" aria-hidden="true">
                    <path
                        d="M5.25 7.5L10 12.25L14.75 7.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Chevron>
            </Trigger>

            {open && (
                <Menu role="listbox">
                    {options.map((option) => {
                        const selected = option.value === value;

                        return (
                            <OptionButton
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                $selected={selected}
                                onClick={() => handleSelect(option.value)}
                            >
                                <OptionLabel>{option.label}</OptionLabel>

                                {selected && (
                                    <Check viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            d="M4.75 10.5L8.25 14L15.25 7"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Check>
                                )}
                            </OptionButton>
                        );
                    })}
                </Menu>
            )}
        </Root>
    );
}

const Root = styled.div`
  position: relative;
  width: 100%;
`;

const Trigger = styled.button<{ $open: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid
    ${({ theme, $open }) =>
    $open ? 'rgba(125, 220, 255, 0.28)' : theme.line};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: rgba(125, 220, 255, 0.22);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(125, 220, 255, 0.14);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TriggerText = styled.span<{ $placeholder: boolean }>`
  font-size: 14px;
  text-align: left;
  color: ${({ theme, $placeholder }) =>
    $placeholder ? theme.muted : theme.text};
`;

const Chevron = styled.svg<{ $open: boolean }>`
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.muted};
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  z-index: 1200;
  padding: 8px;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.panel};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(18px);
  max-height: 240px;
  overflow: auto;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  background: ${({ $selected, theme }) =>
    $selected
        ? theme.mode === 'dark'
            ? 'rgba(125, 220, 255, 0.1)'
            : 'rgba(34, 158, 217, 0.1)'
        : 'transparent'};
  color: ${({ theme, $selected }) => ($selected ? theme.text : theme.muted)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;

  &:hover {
    background: ${({ theme, $selected }) =>
    $selected
        ? theme.mode === 'dark'
            ? 'rgba(125, 220, 255, 0.14)'
            : 'rgba(34, 158, 217, 0.14)'
        : theme.mode === 'dark'
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(23,33,43,0.04)'};
    color: ${({ theme }) => theme.text};
  }
`;

const OptionLabel = styled.span`
  font-size: 14px;
  text-align: left;
`;

const Check = styled.svg`
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
    color: ${({ theme }) =>
            theme.mode === 'dark' ? '#9be7ff' : '#229ed9'};
`;