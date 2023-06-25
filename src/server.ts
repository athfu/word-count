import express, { Express, Request, Response } from "express";
import cors from "cors";
import count from "./count.json" assert { type: "json" };
import fs from "fs";
import cron from "node-cron";

const app: Express = express();
app.use(cors());
const port = 5001;

const countLog = "/Users/athena/code/word-count/src/count.json";

type HeatmapValue = {
  date: string;
  count: number;
};

type WordCountData = {
  currentCount: number;
  daily: HeatmapValue[];
};

function getWordCount() {
  const data = fs.readFileSync("/Users/athena/Primer/writing.md", "utf8");
  const wordCount = data.split(/\s+/).length;
  return wordCount;
}

function updateWordCount() {
  const data: WordCountData = JSON.parse(fs.readFileSync(countLog, "utf8"));

  //get today's date in the correct format
  let today = new Date();
  const timezoneOffset = today.getTimezoneOffset();
  today = new Date(today.getTime() - timezoneOffset * 60 * 1000);
  const day = today.toISOString().split("T")[0];

  const newWordCount = getWordCount();
  const dailyCount = newWordCount - data.currentCount;
  data.currentCount = newWordCount;
  const newDateData: HeatmapValue = {
    date: day,
    count: dailyCount,
  };

  //sort daily to see if today's date already exists
  data.daily.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const lastDate = data.daily[data.daily.length - 1];

  //replace last entry if today's date already exists
  if (lastDate.date === day) {
    data.daily.pop();
  }

  data.daily.push(newDateData);

  fs.writeFileSync(countLog, JSON.stringify(data, undefined, 2));
}

function scheduleCron() {
  cron.schedule(
    "30 23 * * *",
    () => {
      console.log("Running a job at 23:30 at Europe/London timezone");
      updateWordCount();
    },
    {
      scheduled: true,
      timezone: "Europe/London",
    }
  );
}

function readWordCountData() {
  // Reads word count data from count json file
  return count;
}

app.get("/", (req: Request, res: Response) => {
  // updateWordCount();
  res.send(readWordCountData());
});

scheduleCron();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
