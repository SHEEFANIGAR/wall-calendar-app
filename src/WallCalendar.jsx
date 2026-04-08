import { useState, useEffect, useRef } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const IMAGES = [
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=900&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80",
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=900&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
  "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=900&q=80",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&q=80",
  "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80",
];

const COLORS = [
  "#2e5fa3",
  "#3b4f8c",
  "#c06b8a",
  "#8a6fbf",
  "#3a8c5c",
  "#1a7fa8",
  "#c07c2e",
  "#d4973a",
  "#b05a2e",
  "#a0491e",
  "#4a6741",
  "#2c4d7c",
];

const HOLIDAYS = {
  "1-1": "New Year",
  "8-15": "Independence Day",
  "10-2": "Gandhi Jayanti",
};

export default function WallCalendar() {
  const today = new Date();
  const [date, setDate] = useState(new Date());
  const [flip, setFlip] = useState(false);

  const year = date.getFullYear();
  const month = date.getMonth();

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDay, setHoverDay] = useState(null);

  const [events, setEvents] = useState({});
  const [notes, setNotes] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [text, setText] = useState("");

  const accent = COLORS[month];
  const inputRef = useRef();

  useEffect(() => {
    const ev = localStorage.getItem("events");
    const nt = localStorage.getItem("notes");
    if (ev) setEvents(JSON.parse(ev));
    if (nt) setNotes(JSON.parse(nt));
  }, []);

  const saveEvents = (data) => {
    setEvents(data);
    localStorage.setItem("events", JSON.stringify(data));
  };

  const saveNotes = (data) => {
    setNotes(data);
    localStorage.setItem("notes", JSON.stringify(data));
  };

  function changeMonth(dir) {
    setFlip(true);
    setTimeout(() => {
      setDate((prev) => {
        const d = new Date(prev);
        d.setMonth(prev.getMonth() + dir);
        return d;
      });
      setFlip(false);
    }, 250);
  }

  function handleClick(day) {
    if (!rangeStart || rangeEnd) {
      setRangeStart(day);
      setRangeEnd(null);
    } else {
      setRangeEnd(day);
    }
  }

  function isSameDay(a, b) {
    return a && b && a.y === b.y && a.m === b.m && a.d === b.d;
  }

  function isBetween(day) {
    if (!rangeStart || !rangeEnd) return false;
    const d = new Date(day.y, day.m, day.d);
    const s = new Date(rangeStart.y, rangeStart.m, rangeStart.d);
    const e = new Date(rangeEnd.y, rangeEnd.m, rangeEnd.d);
    return d > s && d < e;
  }

  function isPreview(day) {
    if (!rangeStart || rangeEnd || !hoverDay) return false;
    const d = new Date(day.y, day.m, day.d);
    const s = new Date(rangeStart.y, rangeStart.m, rangeStart.d);
    const h = new Date(hoverDay.y, hoverDay.m, hoverDay.d);
    return d > Math.min(s, h) && d < Math.max(s, h);
  }

  function isToday(d) {
    return (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  function addEvent() {
    if (!text.trim() || !activeDay) return;
    const key = `${activeDay.y}-${activeDay.m}-${activeDay.d}`;
    const updated = {
      ...events,
      [key]: [...(events[key] || []), { id: Date.now(), text }],
    };
    saveEvents(updated);
    setText("");
  }

  const days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();

  const grid = [];
  for (let i = 0; i < start; i++) grid.push(null);
  for (let i = 1; i <= days; i++) grid.push(i);

  return (
    <div className="container">
      <div
        className={`card ${flip ? "flip" : ""}`}
        style={{ "--accent": accent }}
      >
        <div className="hero">
          <img src={IMAGES[month]} alt="" />
          <div className="overlay"></div>
          <h2>
            {MONTHS[month]} {year}
          </h2>
        </div>

        <div className="nav">
          <button onClick={() => changeMonth(-1)}>‹</button>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="grid">
          {DAYS.map((d) => (
            <div key={d} className="day">
              {d}
            </div>
          ))}

          {grid.map((d, i) => {
            if (!d) return <div key={i}></div>;
            const day = { y: year, m: month, d };
            const key = `${year}-${month}-${d}`;

            return (
              <div
                key={i}
                className={`cell
                  ${isSameDay(day, rangeStart) ? "start" : ""}
                  ${isSameDay(day, rangeEnd) ? "end" : ""}
                  ${isBetween(day) ? "middle" : ""}
                  ${isPreview(day) ? "preview" : ""}
                  ${isToday(d) ? "today" : ""}
                `}
                onClick={() => handleClick(day)}
                onMouseEnter={() => setHoverDay(day)}
                onMouseLeave={() => setHoverDay(null)}
                onDoubleClick={() => setActiveDay(day)}
              >
                {d}

                {HOLIDAYS[`${month + 1}-${d}`] && (
                  <span className="holiday">★</span>
                )}

                {(events[key] || []).map((ev) => (
                  <div key={ev.id} className="dot"></div>
                ))}
              </div>
            );
          })}
        </div>

        <textarea
          placeholder="Monthly notes..."
          value={notes[`${year}-${month}`] || ""}
          onChange={(e) => {
            const updated = { ...notes, [`${year}-${month}`]: e.target.value };
            saveNotes(updated);
          }}
        />

        {activeDay && (
          <div className="event-box">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={addEvent}>Add</button>
          </div>
        )}
      </div>

      <style>{`
        body { background:#f4f1ec; font-family:sans-serif; }
        .container { max-width:420px; margin:40px auto; }
        .card { background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.15); transition:0.3s; }
        .flip { transform:rotateX(90deg); opacity:0; }

        .hero { position:relative; height:220px; }
        .hero img { width:100%; height:100%; object-fit:cover; }
        .overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent,rgba(0,0,0,0.6)); }
        .hero h2 { position:absolute; bottom:10px; right:15px; color:white; }

        .nav { display:flex; justify-content:space-between; padding:10px; }
        .nav button { border:none; padding:6px 12px; border-radius:20px; cursor:pointer; }

        .grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; padding:10px; }

        .cell {
          aspect-ratio:1;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:50%;
          cursor:pointer;
          position:relative;
          transition:0.2s;
        }

        .cell:hover { background:#eee; transform:scale(1.1); }

        .start, .end {
          background: var(--accent);
          color: white;
          z-index:2;
        }

        .middle {
          background: rgba(0,0,0,0.08);
          border-radius:0;
        }

        .preview {
          background: rgba(0,0,0,0.05);
        }

        .today {
          border:2px solid var(--accent);
        }

        .holiday {
          position:absolute;
          top:4px;
          right:6px;
          font-size:10px;
          color:red;
        }

        .dot {
          width:5px;
          height:5px;
          background:#333;
          border-radius:50%;
          position:absolute;
          bottom:4px;
        }

        textarea {
          width:90%;
          margin:10px;
          padding:8px;
          border-radius:6px;
          border:1px solid #ddd;
        }

        .event-box {
          display:flex;
          gap:5px;
          padding:10px;
        }
      `}</style>
    </div>
  );
}
