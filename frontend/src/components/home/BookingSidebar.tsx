import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setSearch, setStatusFilter } from '../../features/bookingsSlice';
import { openHistoryModal } from '../../features/uiSlice';
import { glassCard } from '../../styles/theme';
import Select from '../../shared/ui/Select';

const statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'pending', label: 'На согласовании' },
    { value: 'approved', label: 'Подтверждённые' },
    { value: 'rejected', label: 'Отклонённые' },
] as const;

export default function BookingSidebar() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.bookings.filters);

    return (
        <Sidebar>
            <SectionCard>
                <SectionTitle>Фильтры</SectionTitle>

                <Field>
                    <Label htmlFor="search">Поиск по ФИО или отделу</Label>
                    <Input
                        id="search"
                        value={filters.search}
                        onChange={(e) => dispatch(setSearch(e.target.value))}
                        placeholder="Например, Алексей или HR"
                    />
                </Field>

                <Field $last>
                    <Label htmlFor="status-filter">Статус</Label>
                    <Select
                        id="status-filter"
                        value={filters.status}
                        onChange={(value) =>
                            dispatch(
                                setStatusFilter(
                                    value as 'all' | 'pending' | 'approved' | 'rejected',
                                ),
                            )
                        }
                        options={[...statusOptions]}
                    />
                </Field>

                <HistoryButton type="button" onClick={() => dispatch(openHistoryModal())}>
                    Открыть историю заявок
                </HistoryButton>
            </SectionCard>
        </Sidebar>
    );
}

const Sidebar = styled.aside`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const SectionCard = styled.section`
    ${glassCard};
    padding: 16px;
`;

const SectionTitle = styled.h2`
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 700;
`;

const Field = styled.div<{ $last?: boolean }>`
    margin-bottom: ${({ $last }) => ($last ? '0' : '12px')};
`;

const Label = styled.label`
    display: block;
    font-size: 13px;
    color: ${({ theme }) => theme.muted};
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 14px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;

    &::placeholder {
        color: ${({ theme }) => theme.muted};
    }

    &:focus {
        border-color: rgba(125, 220, 255, 0.24);
        box-shadow: 0 0 0 3px rgba(125, 220, 255, 0.12);
    }
`;

const HistoryButton = styled.button`
    width: 100%;
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.line};
    background: ${({ theme }) => theme.input};
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;

    &:hover {
        border-color: rgba(125, 220, 255, 0.22);
        background: ${({ theme }) =>
                theme.mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(255,255,255,0.82)'};
    }

    &:active {
        transform: translateY(1px);
    }
`;