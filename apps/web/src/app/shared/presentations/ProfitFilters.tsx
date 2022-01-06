import { ProfitFiltersData } from '../../features/home/store/distributor';
import DatePicker from 'react-datepicker';
import { ChangeEvent, useEffect, useState } from 'react';
import { GroupBy } from '@presacom/models';
import { Form } from 'react-bootstrap';
import { formatISO } from 'date-fns';

interface ProfitFiltersProps {
  filters: ProfitFiltersData;
  onFiltersChange: (filters: ProfitFiltersData) => void;
}

function ProfitFilters({ filters, onFiltersChange }: ProfitFiltersProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.BY_WEEK);

  const onStartDateChange = (start: Date | null) => {
    setStartDate(start || undefined);
    onFiltersChange({
      startTime: start?.toISOString() || undefined,
      endTime: endDate?.toISOString(),
      groupBy
    })
  };

  const onEndDateChange = (end: Date | null) => {
    setEndDate(end || undefined);
    onFiltersChange({
      startTime: startDate?.toISOString(),
      endTime: end?.toISOString() || undefined,
      groupBy
    })
  };

  const onGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGroupBy(e.target.value as GroupBy);
    onFiltersChange({
      startTime: startDate?.toISOString(),
      endTime: endDate?.toISOString(),
      groupBy: e.target.value as GroupBy
    })
  }

  useEffect(() => {
    if (filters.startTime) {
      setStartDate(new Date(filters.startTime));
    }
    if (filters.endTime) {
      setEndDate(new Date(filters.endTime));
    }
  }, [filters])

  return (
    <>
      <div className="d-inline-block me-2">
        <Form.Select
          value={groupBy}
          size="sm"
          aria-label="Selectati perioada"
          className="me-3"
          onChange={onGroupChange}
        >
          <option value={GroupBy.BY_WEEK}>Saptamanal</option>
          <option value={GroupBy.BY_MONTH}>Lunar</option>
          <option value={GroupBy.BY_YEAR}>Anual</option>
        </Form.Select>
      </div>
      <div className="d-inline-block me-2">
        <span className="me-2 text-black d-i">De la:</span>
        <div className="d-inline-block">
          <DatePicker
            selected={startDate}
            onChange={onStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
      <div className="d-inline-block me-2">
        <span className="me-2 text-black">Pana la:</span>
        <div className="d-inline-block">
          <DatePicker
            selected={endDate}
            onChange={onEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
      </div>
    </>
  );
}

export default ProfitFilters;