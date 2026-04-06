import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type SearchableSelectOption<T extends string = string> = {
    value: T;
    label: string;
};

type SearchableSelectProps<T extends string = string> = {
    value: T | '';
    onChange: (value: T | '') => void;
    options: readonly SearchableSelectOption<T>[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    allowClear?: boolean;
};

export default function SearchableSelect<T extends string = string>({
                                                                        value,
                                                                        onChange,
                                                                        options,
                                                                        placeholder = 'Выбрать',
                                                                        searchPlaceholder = 'Поиск...',
                                                                        emptyText = 'Ничего не найдено',
                                                                        disabled = false,
                                                                        id,
                                                                        className,
                                                                        allowClear = false,
                                                                    }: SearchableSelectProps<T>) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const activeOption = useMemo(
        () => options.find((option) => option.value === value),
        [options, value],
    );

    const filteredOptions = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        if (!normalized) return options;

        return options.filter((option) =>
            option.label.toLowerCase().includes(normalized),
        );
    }, [options, search]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current) return;

            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => {
                searchInputRef.current?.focus();
            });
        }
    }, [open]);

    const handleToggle = () => {
        if (disabled) return;

        setOpen((prev) => !prev);

        if (open) {
            setSearch('');
        }
    };

    const handleSelect = (nextValue: T | '') => {
        onChange(nextValue);
        setOpen(false);
        setSearch('');
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

                <RightSide>
                    {allowClear && value ? (
                        <ClearButton
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSelect('');
                            }}
                            aria-label="Очистить"
                        >
                            ✕
                        </ClearButton>
                    ) : null}

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
                </RightSide>
            </Trigger>

            {open && (
                <Menu>
                    <SearchWrap>
                        <SearchInput
                            ref={searchInputRef}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                        />
                    </SearchWrap>

                    <Options role="listbox">
                        {allowClear && (
                            <OptionButton
                                type="button"
                                role="option"
                                aria-selected={value === ''}
                                $selected={value === ''}
                                onClick={() => handleSelect('')}
                            >
                                <OptionLabel>Не выбрано</OptionLabel>
                            </OptionButton>
                        )}

                        {filteredOptions.length === 0 ? (
                            <EmptyState>{emptyText}</EmptyState>
                        ) : (
                            filteredOptions.map((option) => {
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
                            })
                        )}
                    </Options>
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RightSide = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(23,33,43,0.08)'};
  color: ${({ theme }) => theme.muted};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
`;

const SearchWrap = styled.div`
  padding: 4px 4px 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.line};
  background: ${({ theme }) => theme.input};
  color: ${({ theme }) => theme.text};
  font-size: 14px;

  &::placeholder {
    color: ${({ theme }) => theme.muted};
  }

  &:focus {
    border-color: rgba(125, 220, 255, 0.24);
    box-shadow: 0 0 0 3px rgba(125, 220, 255, 0.12);
  }
`;

const Options = styled.div`
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

const EmptyState = styled.div`
  padding: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.muted};
  text-align: center;
`;

const Check = styled.svg`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  color: ${({ theme }) =>
    theme.mode === 'dark' ? '#9be7ff' : '#229ed9'};
`;