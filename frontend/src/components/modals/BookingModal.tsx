import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeBookingModal } from '../../features/uiSlice';
import { addBooking } from '../../features/bookingsSlice';
import {
    DAY_END_TIME,
    addMinutesToTime,
    durationToMinutes,
    findBookingConflict,
    isDateTimeInPast,
    isDurationValid,
    isEndTimeWithinDay,
    isTimeRangeValid,
} from '../../utils/booking';
import TimeInput from '../../shared/ui/TimeInput';
import SearchableSelect from '../../shared/ui/SearchableSelect';
import { api, type EmployeeReferenceOption, type ReferenceOption } from '../../services/api';

function formatDurationInput(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) return '';
    if (digits.length <= 2) return `${digits}:`;

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function normalizeDuration(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) {
        return '00:30';
    }

    const hours = digits.slice(0, 2).padEnd(2, '0');
    const minutes = digits.slice(2, 4).padEnd(2, '0');

    return `${hours}:${minutes}`;
}

export default function BookingModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.bookingModalOpen);
    const bookings = useAppSelector((state) => state.bookings.items);

    const [fullName, setFullName] = useState('');
    const [purpose, setPurpose] = useState('');
    const [department, setDepartment] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('10:00');
    const [duration, setDuration] = useState('00:30');
    const [error, setError] = useState('');
    const [departmentOptions, setDepartmentOptions] = useState<ReferenceOption[]>([]);
    const [employeeOptions, setEmployeeOptions] = useState<EmployeeReferenceOption[]>([]);
    const [isLoadingRefs, setIsLoadingRefs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredEmployeeOptions = useMemo(() => {
        if (!department) {
            return employeeOptions.map((employee) => ({
                value: employee.fullName,
                label: employee.fullName,
            }));
        }

        return employeeOptions
            .filter((employee) => employee.department === department)
            .map((employee) => ({
                value: employee.fullName,
                label: employee.fullName,
            }));
    }, [department, employeeOptions]);

    const employeeDepartmentMap = useMemo(() => {
        return Object.fromEntries(
            employeeOptions.map((employee) => [employee.fullName, employee.department]),
        ) as Record<string, string>;
    }, [employeeOptions]);

    const endTime = useMemo(() => {
        if (!isDurationValid(duration)) return '';
        return addMinutesToTime(startTime, durationToMinutes(duration));
    }, [startTime, duration]);

    useEffect(() => {
        if (!isOpen) return;

        let cancelled = false;

        const loadReferences = async () => {
            try {
                setIsLoadingRefs(true);

                const [departments, employees] = await Promise.all([
                    api.getDepartments(),
                    api.getEmployees(),
                ]);

                if (!cancelled) {
                    setDepartmentOptions(departments);
                    setEmployeeOptions(employees);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Ошибка загрузки справочников');
                }
            } finally {
                if (!cancelled) {
                    setIsLoadingRefs(false);
                }
            }
        };

        setDate(format(new Date(), 'yyyy-MM-dd'));
        setStartTime('10:00');
        setDuration('00:30');
        setError('');
        loadReferences();

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(closeBookingModal());
    };

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        setError('');

        if (!value) return;

        if (fullName && employeeDepartmentMap[fullName] !== value) {
            setFullName('');
        }
    };

    const handleEmployeeChange = (value: string) => {
        setFullName(value);
        setError('');

        if (!value) return;

        const employeeDepartment = employeeDepartmentMap[value];
        if (employeeDepartment) {
            setDepartment(employeeDepartment);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !purpose.trim() || !department.trim()) {
            setError('Заполни ФИО, отдел и цель совещания');
            return;
        }

        if (!isDurationValid(duration)) {
            setError('Укажи длительность в формате ЧЧ:ММ');
            return;
        }

        if (isDateTimeInPast(date, startTime)) {
            setError('Нельзя выбрать прошедшее время');
            return;
        }

        if (!isTimeRangeValid(startTime, endTime)) {
            setError('Время окончания должно быть позже времени начала');
            return;
        }

        if (!isEndTimeWithinDay(endTime)) {
            setError(`Бронирование не должно выходить за пределы ${DAY_END_TIME}`);
            return;
        }

        const conflict = findBookingConflict(bookings, {
            date,
            roomId: 'room-main',
            startTime,
            endTime,
        });

        if (conflict) {
            setError(`Этот интервал уже занят: ${conflict.startTime} — ${conflict.endTime}`);
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const createdBooking = await api.createBooking({
                fullName: fullName.trim(),
                purpose: purpose.trim(),
                department: department.trim(),
                roomName: 'Конференц-зал',
                date,
                startTime,
                endTime,
            });

            dispatch(addBooking(createdBooking));
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка создания заявки');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Overlay onClick={handleClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Top>
                    <HeaderBlock>
                        <Title>Новое бронирование</Title>
                    </HeaderBlock>

                    <CloseButton type="button" onClick={handleClose} aria-label="Закрыть">
                        ✕
                    </CloseButton>
                </Top>

                <Form onSubmit={handleSubmit}>
                    <Field>
                        <Label htmlFor="booking-department">Отдел</Label>
                        <SearchableSelect
                            id="booking-department"
                            value={department}
                            onChange={handleDepartmentChange}
                            options={departmentOptions}
                            placeholder={isLoadingRefs ? 'Загрузка...' : 'Выбери отдел'}
                            searchPlaceholder="Найти отдел..."
                            allowClear
                            disabled={isLoadingRefs}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="booking-full-name">ФИО</Label>
                        <SearchableSelect
                            id="booking-full-name"
                            value={fullName}
                            onChange={handleEmployeeChange}
                            options={filteredEmployeeOptions}
                            placeholder={
                                isLoadingRefs
                                    ? 'Загрузка...'
                                    : department
                                        ? 'Выбери сотрудника отдела'
                                        : 'Выбери сотрудника'
                            }
                            searchPlaceholder="Найти сотрудника..."
                            emptyText="Сотрудники не найдены"
                            allowClear
                            disabled={isLoadingRefs}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="booking-purpose">Цель встречи</Label>
                        <Input
                            id="booking-purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="Например, Распределение обязанностей"
                        />
                    </Field>

                    <DoubleGrid>
                        <Field>
                            <Label htmlFor="booking-date">Дата</Label>
                            <Input
                                id="booking-date"
                                type="date"
                                value={date}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setError('');
                                }}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="booking-start-time">Время начала</Label>
                            <TimeInput
                                id="booking-start-time"
                                value={startTime}
                                onChange={(value) => {
                                    setStartTime(value);
                                    setError('');
                                }}
                                minHour={9}
                                maxHour={23}
                            />
                        </Field>
                    </DoubleGrid>

                    <Field>
                        <Label htmlFor="booking-duration">Длительность бронирования</Label>
                        <Input
                            id="booking-duration"
                            type="text"
                            inputMode="numeric"
                            value={duration}
                            onChange={(e) => {
                                setDuration(formatDurationInput(e.target.value));
                                setError('');
                            }}
                            onBlur={() => setDuration(normalizeDuration(duration))}
                            placeholder="01:30"
                            maxLength={5}
                        />
                        <HelperText>
                            Формат: ЧЧ:ММ. Например, 00:30, 01:00 или 02:30.
                        </HelperText>
                    </Field>

                    {endTime && isDurationValid(duration) && (
                        <InfoBox>
                            Интервал бронирования: <strong>{startTime}</strong> — <strong>{endTime}</strong>
                        </InfoBox>
                    )}

                    {error && <ErrorText>{error}</ErrorText>}

                    <Actions>
                        <GhostButton type="button" onClick={handleClose} disabled={isSubmitting}>
                            Отмена
                        </GhostButton>

                        <PrimaryButton type="submit" disabled={isSubmitting || isLoadingRefs}>
                            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                        </PrimaryButton>
                    </Actions>
                </Form>
            </ModalCard>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(8, 10, 16, 0.68);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1100;
`;

const ModalCard = styled.div`
    width: 100%;
    max-width: 620px;
    border-radius: 28px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.panel};
    box-shadow: ${({ theme }) => theme.shadow};
    padding: 24px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
`;

const HeaderBlock = styled.div`
    min-width: 0;
`;

const Title = styled.h2`
    margin: 0 0 8px;
    font-size: 24px;
    line-height: 1.2;
`;

const CloseButton = styled.button`
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    border-radius: 14px;
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.line};
    cursor: pointer;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const Field = styled.div``;

const DoubleGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
`;

const Input = styled.input`
    width: 100%;
    min-height: 48px;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    font-size: 14px;

    &::placeholder {
        color: ${({ theme }) => theme.muted};
    }

    &[type='date']::-webkit-calendar-picker-indicator {
        opacity: 0.75;
        cursor: pointer;
    }
`;

const HelperText = styled.div`
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.45;
    color: ${({ theme }) => theme.muted};
`;

const InfoBox = styled.div`
    padding: 12px 14px;
    border-radius: 16px;
    background: ${({ theme }) =>
            theme.mode === 'dark'
                    ? 'rgba(125, 220, 255, 0.08)'
                    : 'rgba(34, 158, 217, 0.08)'};
    border: 1px solid rgba(125, 220, 255, 0.16);
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    line-height: 1.5;
`;

const ErrorText = styled.div`
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.danger};
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 6px;
    flex-wrap: wrap;
`;

const BaseButton = styled.button`
    min-height: 46px;
    padding: 12px 16px;
    border-radius: 16px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.line};
    font-size: 14px;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const GhostButton = styled(BaseButton)`
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
`;

const PrimaryButton = styled(BaseButton)`
    background: ${({ theme }) => theme.cyan};
    color: ${({ theme }) => (theme.mode === 'dark' ? '#c8efff' : '#0f4d73')};
    border-color: rgba(125, 220, 255, 0.28);
    font-weight: 600;
`;