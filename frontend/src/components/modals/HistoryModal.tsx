import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { closeHistoryModal } from '../../features/uiSlice';
import { getBookingStatusLabel, timeToMinutes } from '../../utils/booking';
import type { BookingStatus } from '../../services/mocks';
import Select from '../../shared/ui/Select';
import TimeInput from '../../shared/ui/TimeInput';
import SearchableSelect from '../../shared/ui/SearchableSelect';
import { api, type EmployeeReferenceOption, type ReferenceOption } from '../../services/api';

const statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'pending', label: 'На согласовании' },
    { value: 'approved', label: 'Подтверждённые' },
    { value: 'rejected', label: 'Отклонённые' },
    { value: 'unreviewed', label: 'Не рассмотрено' },
] as const;

export default function HistoryModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.historyModalOpen);
    const bookings = useAppSelector((state) => state.bookings.items);

    const [fullName, setFullName] = useState('');
    const [department, setDepartment] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [status, setStatus] = useState<'all' | BookingStatus | 'unreviewed'>('all');
    const [useTimeFilter, setUseTimeFilter] = useState(false);
    const [departmentOptions, setDepartmentOptions] = useState<ReferenceOption[]>([]);
    const [employeeOptions, setEmployeeOptions] = useState<EmployeeReferenceOption[]>([]);
    const [isLoadingRefs, setIsLoadingRefs] = useState(false);

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
            } catch (error) {
                console.error('Failed to load reference data:', error);
            } finally {
                if (!cancelled) {
                    setIsLoadingRefs(false);
                }
            }
        };

        loadReferences();

        return () => {
            cancelled = true;
        };
    }, [isOpen]);

    const employeeDepartmentMap = useMemo(() => {
        return Object.fromEntries(
            employeeOptions.map((employee) => [employee.fullName, employee.department]),
        ) as Record<string, string>;
    }, [employeeOptions]);

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

    const filteredItems = useMemo(() => {
        return [...bookings]
            .filter((item) => {
                const matchesFullName = !fullName || item.fullName === fullName;
                const matchesDepartment = !department || (item.department ?? '') === department;
                const matchesDate = !date || item.date === date;

                const matchesTime =
                    !useTimeFilter ||
                    (timeToMinutes(time) >= timeToMinutes(item.startTime) &&
                        timeToMinutes(time) < timeToMinutes(item.endTime));

                const matchesStatus = status === 'all' || item.status === status;

                return (
                    matchesFullName &&
                    matchesDepartment &&
                    matchesDate &&
                    matchesTime &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date);

                if (dateCompare !== 0) {
                    return dateCompare;
                }

                return timeToMinutes(b.startTime) - timeToMinutes(a.startTime);
            });
    }, [bookings, fullName, department, date, time, status, useTimeFilter]);

    if (!isOpen) return null;

    const handleClose = () => {
        dispatch(closeHistoryModal());
    };

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);

        if (!value) {
            return;
        }

        if (fullName && employeeDepartmentMap[fullName] !== value) {
            setFullName('');
        }
    };

    const handleEmployeeChange = (value: string) => {
        setFullName(value);

        if (!value) {
            return;
        }

        const employeeDepartment = employeeDepartmentMap[value];

        if (employeeDepartment) {
            setDepartment(employeeDepartment);
        }
    };

    return (
        <Overlay onClick={handleClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <Top>
                    <Title>История заявок</Title>
                    <CloseButton type="button" onClick={handleClose}>
                        ✕
                    </CloseButton>
                </Top>

                <FiltersGrid>
                    <Field>
                        <Label htmlFor="history-department">Отдел</Label>
                        <SearchableSelect
                            id="history-department"
                            value={department}
                            onChange={handleDepartmentChange}
                            options={departmentOptions}
                            placeholder={isLoadingRefs ? 'Загрузка...' : 'Все отделы'}
                            searchPlaceholder="Найти отдел..."
                            allowClear
                            disabled={isLoadingRefs}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="history-full-name">ФИО</Label>
                        <SearchableSelect
                            id="history-full-name"
                            value={fullName}
                            onChange={handleEmployeeChange}
                            options={filteredEmployeeOptions}
                            placeholder={
                                isLoadingRefs
                                    ? 'Загрузка...'
                                    : department
                                        ? 'Сотрудники выбранного отдела'
                                        : 'Все сотрудники'
                            }
                            searchPlaceholder="Найти сотрудника..."
                            emptyText="Сотрудники не найдены"
                            allowClear
                            disabled={isLoadingRefs}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="history-date">Дата</Label>
                        <Input
                            id="history-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="history-time">Время бронирования</Label>
                        <TimeInput
                            id="history-time"
                            value={time}
                            onChange={setTime}
                            minHour={9}
                            maxHour={23}
                        />
                        <CheckboxRow>
                            <Checkbox
                                id="history-use-time"
                                type="checkbox"
                                checked={useTimeFilter}
                                onChange={(e) => setUseTimeFilter(e.target.checked)}
                            />
                            <CheckboxLabel htmlFor="history-use-time">
                                Фильтровать по времени
                            </CheckboxLabel>
                        </CheckboxRow>
                    </Field>

                    <Field>
                        <Label htmlFor="history-status">Статус</Label>
                        <Select
                            id="history-status"
                            value={status}
                            onChange={(value) =>
                                setStatus(value as 'all' | BookingStatus | 'unreviewed')
                            }
                            options={[...statusOptions]}
                        />
                    </Field>
                </FiltersGrid>

                <Content>
                    {filteredItems.length === 0 ? (
                        <EmptyState>По текущим фильтрам ничего не найдено</EmptyState>
                    ) : (
                        <HistoryGrid>
                            {filteredItems.map((item) => (
                                <HistoryCard key={item.id}>
                                    <CardTop>
                                        <CardName>{item.fullName}</CardName>
                                        <StatusBadge $status={item.status}>
                                            {getBookingStatusLabel(item.status)}
                                        </StatusBadge>
                                    </CardTop>

                                    <CardText>{item.purpose}</CardText>

                                    <CardMeta>
                                        {item.date} · {item.startTime} — {item.endTime}
                                        {item.department ? ` · ${item.department}` : ''}
                                    </CardMeta>

                                    {item.rejectionReason && (
                                        <RejectReason>Причина: {item.rejectionReason}</RejectReason>
                                    )}

                                    {item.processedBy && (
                                        <ProcessedBy>
                                            Обработал: {item.processedBy.name}
                                        </ProcessedBy>
                                    )}
                                </HistoryCard>
                            ))}
                        </HistoryGrid>
                    )}
                </Content>
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
    max-width: 1100px;
    max-height: calc(100vh - 32px);
    overflow: auto;
    border-radius: 28px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.panel};
    box-shadow: ${({ theme }) => theme.shadow};
    padding: 22px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 18px;
`;

const Title = styled.h2`
    margin: 0;
    font-size: 24px;
`;

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
`;

const FiltersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 18px;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`;

const Field = styled.div`
    min-width: 0;
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

    &:focus {
        border-color: rgba(125, 220, 255, 0.24);
        box-shadow: 0 0 0 3px rgba(125, 220, 255, 0.12);
    }
`;

const CheckboxRow = styled.div`
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Checkbox = styled.input`
    accent-color: ${({ theme }) => theme.cyan};
`;

const CheckboxLabel = styled.label`
    font-size: 12px;
    color: ${({ theme }) => theme.muted};
`;

const Content = styled.div`
    min-height: 220px;
`;

const HistoryGrid = styled.div`
    display: grid;
    gap: 12px;
`;

const HistoryCard = styled.article`
    padding: 16px;
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
`;

const CardTop = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;

    @media (max-width: 640px) {
        flex-direction: column;
    }
`;

const CardName = styled.h3`
    margin: 0;
    font-size: 16px;
`;

const CardText = styled.p`
    margin: 0 0 8px;
    color: ${({ theme }) =>
            theme.mode === 'dark' ? 'rgba(255,255,255,.88)' : '#24425c'};
`;

const CardMeta = styled.p`
    margin: 0;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
`;

const EmptyState = styled.div`
    padding: 18px;
    border-radius: 18px;
    border: 1px dashed ${({ theme }) => theme.line};
    color: ${({ theme }) => theme.muted};
    text-align: center;
`;

const RejectReason = styled.p`
    margin: 10px 0 0;
    font-size: 13px;
    color: ${({ theme }) => theme.danger};
`;

const ProcessedBy = styled.p`
    margin: 10px 0 0;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 12px;
  border-radius: 999px;
  padding: 6px 10px;
  white-space: nowrap;
  background: ${({ $status }) => {
    if ($status === 'approved') return 'rgba(52,211,153,.15)';
    if ($status === 'rejected') return 'rgba(251,113,133,.14)';
    if ($status === 'unreviewed') return 'rgba(148,163,184,.18)';
    return 'rgba(245,158,11,.16)';
}};
  color: ${({ $status }) => {
    if ($status === 'approved') return '#5da577';
    if ($status === 'rejected') return '#ae7078';
    if ($status === 'unreviewed') return '#848a91';
    return '#9a812f';
}};
`;