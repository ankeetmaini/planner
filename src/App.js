import { useLayoutEffect, useMemo, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { tasks as initialTasks, owners as initialOwners } from "./tasks";
import CanvasChart from "./CanvasChart";
import Legend from "./Legend";
import Prism from "./Prism";
import styles from "./App.module.css";

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [owners, setOwners] = useState(initialOwners);

  const [preloadCounter, setPreloadCounter] = useState(false);

  const [tasksString, setTasksString] = useState(() =>
    stringifyObject(initialTasks)
  );
  const [ownersString, setOwnersString] = useState(
    () => `// Optional team metadata\n\n${stringifyObject(initialOwners)}`
  );

  const handleOwnersChange = (newString) => {
    try {
      const parsed = parseCode(newString);
      setOwners(parsed);
      setOwnersString(newString);
    } catch (error) {
      // Parsing errors are fine; they're expected while typing.
    }
  };

  const handleTasksChange = (newString) => {
    try {
      const parsed = parseCode(newString);
      setTasks(parsed);
      setTasksString(newString);
    } catch (error) {
      // Parsing errors are fine; they're expected while typing.
    }
  };

  // Pre-load images so we can draw avatars to the Canvas.
  useLayoutEffect(() => {
    preloadImages(owners, () => {
      setPreloadCounter((value) => value + 1);
    });
  }, [owners]);

  // Generate unique colors for each owner to mark their tasks.
  const colorMap = useMemo(() => {
    const map = new Map();

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      const task = tasks[taskIndex];
      const owner = owners[task.owner];
      const ownerName = owner?.name || task.owner || "team";

      const color = getColor(ownerName);

      map.set(ownerName, color);
    }

    return map;
  }, [owners, tasks]);

  return (
    <div className={styles.App}>
      <Legend colorMap={colorMap} owners={owners} tasks={tasks} />

      <div className={styles.ChartContainer}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <CanvasChart
              colorMap={colorMap}
              owners={owners}
              preloadCounter={preloadCounter}
              tasks={tasks}
              width={width}
            />
          )}
        </AutoSizer>
      </div>

      <div className={styles.CodeContainer}>
        <div className={styles.CodeColumnLeft}>
          <div className={styles.CodeHeader}>Tasks</div>
          <Prism code={tasksString} onChange={handleTasksChange} />
        </div>
        <div className={styles.CodeColumnRight}>
          <div className={styles.CodeHeader}>Team</div>
          <Prism code={ownersString} onChange={handleOwnersChange} />
        </div>
      </div>
    </div>
  );
}

function parseCode(maybeCodeString) {
  // eslint-disable-next-line no-new-func
  return Function('"use strict";return (' + maybeCodeString + ")")();
}

function stringifyObject(objectOrArray) {
  const string = JSON.stringify(objectOrArray, null, 2);
  // eslint-disable-next-line no-regex-spaces
  return string.replace(/  "([^"]+)"/g, "  $1");
}

async function preloadImages(owners, callback) {
  const promises = [];

  for (let key in owners) {
    const owner = owners[key];

    if (owner?.avatar != null) {
      promises.push(
        new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            owner.avatar = {
              height: image.naturalHeight,
              image,
              width: image.naturalWidth,
            };

            resolve();
          };
          image.src = owner.avatar;
        })
      );
    }
  }

  await Promise.all(promises);

  callback();
}

const availableColors = [
  "#363852",
  "#726D81",
  "#B29DA0",
  "#DECBC6",
  "#4A4E69",
  "#9A8C98",
  "#C9ADA7",
  "#22223B",
  "#F2E9E4",
];
const takenColorMap = new Map();

function getColor(stringInput) {
  if (!takenColorMap.has(stringInput)) {
    const color = availableColors.shift();

    takenColorMap.set(stringInput, color);
  }
  return takenColorMap.get(stringInput);
}