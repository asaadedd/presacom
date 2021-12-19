import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  getMonth,
  getWeek,
  getYear,
  startOfMonth,
  startOfWeek,
  startOfYear, subMonths, subWeeks, subYears
} from 'date-fns'

const MONTHS = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie'
]

export enum TimeSelectionType {
  BY_WEEK = 'BY_WEEK',
  BY_MONTH = 'BY_MONTH',
  BY_YEAR = 'BY_YEAR'
}

export interface SelectedTime {
  startTime: Date;
  endTime: Date;
  selectionType: TimeSelectionType
}

interface TimeboxSelectorProps {
  selectedTime?: SelectedTime;
  onTimeSelect: (date: SelectedTime) => void
}

function TimeboxSelector(props: TimeboxSelectorProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOptions] = useState(0);

  const changeSelectedTime = (type: TimeSelectionType, diff: number) => {
    if (type === TimeSelectionType.BY_WEEK) {
      props.onTimeSelect({
        startTime: startOfWeek(subWeeks(new Date(), diff)),
        endTime: endOfWeek(subWeeks(new Date(), diff)),
        selectionType: type
      });
      setSelectedOptions(diff);
    } else if (type === TimeSelectionType.BY_MONTH) {
      props.onTimeSelect({
        startTime: startOfMonth(subMonths(new Date(), diff)),
        endTime: endOfMonth(subMonths(new Date(), diff)),
        selectionType: type
      });
      setSelectedOptions(diff);
    } else {
      props.onTimeSelect({
        startTime: startOfYear(subYears(new Date(), diff)),
        endTime: endOfYear(subYears(new Date(), diff)),
        selectionType: type
      });
      setSelectedOptions(diff);
    }
  };

  useEffect(() => {
    if (props.selectedTime?.selectionType) {
      const currentWeek = getWeek(new Date());
      const currentMonth = getMonth(new Date());
      const currentYear = getYear(new Date());
      if (props.selectedTime?.selectionType === TimeSelectionType.BY_WEEK) {
        setOptions([...Array(10).keys()].map((index) => `Saptamana ${currentWeek - index}`));
        setSelectedOptions(0);
      } else if (props.selectedTime?.selectionType === TimeSelectionType.BY_MONTH) {
        setOptions([...Array(10).keys()].map((index) => {
          const currentIndex = currentMonth - index;
          if (currentIndex >= 0) {
            return `${MONTHS[currentIndex]} ${currentYear}`;
          } else {
            return `${MONTHS[12 + currentIndex + 1]} ${currentYear}`
          }
        }));
        setSelectedOptions(0);
      } else {
        setOptions([...Array(10).keys()].map((index) => `${currentYear - index}`));
        setSelectedOptions(0);
      }
    } else {
      setOptions([]);
      setSelectedOptions(0);
    }
  }, [props.selectedTime?.selectionType]);

  return (
    <div className="d-flex">
      <Button className="me-1"
              size="sm"
              onClick={() => changeSelectedTime(TimeSelectionType.BY_WEEK, 0)}
              active={props.selectedTime?.selectionType === TimeSelectionType.BY_WEEK}
              variant="primary">
        Saptamanal
      </Button>
      <Button
              size="sm"
              onClick={() => changeSelectedTime(TimeSelectionType.BY_MONTH, 0)}
              active={props.selectedTime?.selectionType === TimeSelectionType.BY_MONTH}
              variant="primary">
        Lunar
      </Button>
      <Button className="ms-1"
              size="sm"
              onClick={() => changeSelectedTime(TimeSelectionType.BY_YEAR, 0)}
              active={props.selectedTime?.selectionType === TimeSelectionType.BY_YEAR}
              variant="primary">
        Anual
      </Button>
      {
        props.selectedTime?.selectionType ? (
          <Form.Select value={selectedOption}
                       size="sm"
                       aria-label="Selectati perioada"
                       className="ms-2"
                       onChange={(e) => changeSelectedTime((props.selectedTime as any).selectionType, e.target.selectedIndex)}>
            {
              options.map((opt, i) => <option value={i} key={opt}>{opt}</option>)
            }
          </Form.Select>
        ) : null
      }
    </div>
  )
}

export default TimeboxSelector;
