import CalendarHeatmap from "react-calendar-heatmap";
import "./Heatmap.css";
import { Tooltip } from "react-tooltip";
import { useState, useEffect } from "react";

const today = new Date();
//set today as 1 day prior so only completed days are shown
today.setDate(today.getDate() - 1);

type HeatmapValue = {
  date: string;
  count: number;
};

type WordCountData = {
  currentCount: number;
  daily: HeatmapValue[];
};

function Heatmap() {
  const [values, setValues] = useState<Array<WordCountData>>([]);

  useEffect(() => {
    let ignore = false;
    fetch("http://localhost:5001/")
      .then((result) => result.json())
      .then((data) => {
        if (!ignore) {
          setValues(data.daily);
        }
      });
    return () => {
      ignore = true;
    };
  }, [values]);

  return (
    <div>
      <CalendarHeatmap
        startDate={new Date("2022-12-31")}
        endDate={today}
        values={values}
        horizontal={false}
        gutterSize={2}
        showWeekdayLabels={true}
        showOutOfRangeDays={false}
        weekdayLabels={["sun", "mon", "tue", "wed", "thu", "fri", "sat"]}
        monthLabels={[
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ]}
        classForValue={(value: HeatmapValue) => {
          if (!value) {
            return "color-empty";
          } else if (value.count == 0) {
            return `color-empty`;
          } else if (value.count < 20) {
            return `color-purple-1`;
          } else if (value.count < 50) {
            return `color-purple-2`;
          } else if (value.count < 100) {
            return `color-purple-3`;
          } else if (value.count < 150) {
            return `color-purple-4`;
          } else {
            return `color-purple-5`;
          }
        }}
        tooltipDataAttrs={(value: HeatmapValue) => {
          if (!value) {
            return {};
          } else if (value.count == 1) {
            return {
              "data-tooltip-id": "my-tooltip",
              "data-tooltip-content": `${value.date}: ${value.count} word`,
            };
          } else {
            return {
              "data-tooltip-id": "my-tooltip",
              "data-tooltip-content": `${value.date}: ${value.count} words`,
            };
          }
        }}
      />
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default Heatmap;
