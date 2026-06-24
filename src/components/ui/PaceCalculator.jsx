import { useState } from "react";

const CONVERSION = {
  Mile: {
    Mile: 1,
    Kilometer: 1.609344,
    Meter: 1609.344,
    Yard: 1760,
    "Half Mile": 2,
    "Quarter Mile": 4,
    "Eigth Mile": 8,
    "1500M": 1.072896,
    "800M": 2.01168,
    "400M": 4.02336,
    "200M": 8.04672,
  },
  Kilometer: {
    Mile: 0.6213712,
    Kilometer: 1,
    Meter: 1000,
    Yard: 1093.613,
    "Half Mile": 1.2427424,
    "Quarter Mile": 2.4854848,
    "Eigth Mile": 4.9709696,
    "1500M": 0.66666666,
    "800M": 1.25,
    "400M": 2.5,
    "200M": 5,
  },
  Meter: {
    Mile: 0.0006213712,
    Kilometer: 0.001,
    Meter: 1,
    Yard: 1.093613,
    "Half Mile": 0.0012427424,
    "Quarter Mile": 0.0024854848,
    "Eigth Mile": 0.0049709696,
    "1500M": 0.00066666666,
    "800M": 0.00125,
    "400M": 0.0025,
    "200M": 0.005,
  },
  Yard: {
    Mile: 0.0005681,
    Kilometer: 0.0009144,
    Meter: 0.9144,
    Yard: 1,
    "Half Mile": 0.0011362,
    "Quarter Mile": 0.0022724,
    "Eigth Mile": 0.0045448,
    "1500M": 0.0006096,
    "800M": 0.001143,
    "400M": 0.002286,
    "200M": 0.004572,
  },
};
const EVENTS = [
  { value: "", label: "Pick Event" },
  { value: "26.21875-Mile", label: "Marathon" },
  { value: "13.109375-Mile", label: "Half-Marathon" },
  { value: "5-Kilometer", label: "5K" },
  { value: "5-Mile", label: "5M" },
  { value: "8-Kilometer", label: "8K" },
  { value: "10-Kilometer", label: "10K" },
  { value: "15-Kilometer", label: "15K" },
  { value: "10-Mile", label: "10M" },
  { value: "20-Kilometer", label: "20K" },
  { value: "15-Mile", label: "15M" },
  { value: "25-Kilometer", label: "25K" },
  { value: "30-Kilometer", label: "30K" },
  { value: "20-Mile", label: "20M" },
];

function hhmmssToSeconds(h, m, s) {
  return Number(h) * 3600 + Number(m) * 60 + Number(s);
}

function secondsToHhmmss(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

function toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export default function PaceCalculator({ onClose }) {
  const [timeH, setTimeH] = useState("");
  const [timeM, setTimeM] = useState("");
  const [timeS, setTimeS] = useState("");
  const [distAmount, setDistAmount] = useState("");
  const [distUnit, setDistUnit] = useState("Kilometer");
  const [paceM, setPaceM] = useState("");
  const [paceS, setPaceS] = useState("");
  const [paceUnit, setPaceUnit] = useState("Kilometer");
  const [result, setResult] = useState(null);

  const getTime = () => {
    const h = toNum(timeH);
    const m = toNum(timeM);
    const s = toNum(timeS);
    const secs = hhmmssToSeconds(h, m, s);
    return secs > 0 ? secs : false;
  };

  const getDistance = () => {
    const d = toNum(distAmount.replace(",", "."));
    return d > 0 ? d : false;
  };

  const getPace = () => {
    const m = toNum(paceM);
    const s = toNum(paceS);
    const secs = hhmmssToSeconds(0, m, s);
    return secs > 0 ? secs : false;
  };

  const convertUnits = (from, to, reverse) => {
    if (reverse) return CONVERSION[to][from] || 1;
    return CONVERSION[from]?.[to] || 1;
  };

  const getFactor = (reverse) => convertUnits(distUnit, paceUnit, reverse);

  const handleEvent = (value) => {
    if (!value) return;
    const [amount, unit] = value.split("-");
    setDistAmount(amount);
    setDistUnit(unit);
  };

  const calcTime = () => {
    const dist = getDistance();
    const pace = getPace();
    if (!dist || !pace) {
      setResult({
        type: "error",
        msg: "To calculate Time, enter Pace and Distance",
      });
      return;
    }
    const totalSecs = dist * pace * getFactor();
    const t = secondsToHhmmss(totalSecs);
    setTimeH(t.h);
    setTimeM(t.m);
    setTimeS(t.s);
    setResult({
      type: "info",
      time: `${t.h}h ${t.m}m ${t.s}s`,
      dist: `${distAmount} ${distUnit}`,
      pace: `${paceM}m ${paceS}s / ${paceUnit}`,
    });
  };

  const calcDistance = () => {
    const time = getTime();
    const pace = getPace();
    if (!time || !pace) {
      setResult({
        type: "error",
        msg: "To calculate Distance, enter Time and Pace",
      });
      return;
    }
    const dist = time / (pace / getFactor(true));
    const d = dist.toFixed(4);
    setDistAmount(d);
    setResult({
      type: "info",
      time: `${timeH}h ${timeM}m ${timeS}s`,
      dist: `${d} ${distUnit}`,
      pace: `${paceM}m ${paceS}s / ${paceUnit}`,
    });
  };

  const calcPace = () => {
    const time = getTime();
    const dist = getDistance();
    if (!time || !dist) {
      setResult({
        type: "error",
        msg: "To calculate Pace, enter Time and Distance",
      });
      return;
    }
    const paceSec = time / dist / getFactor();
    let p = secondsToHhmmss(paceSec);
    if (Number(p.h) > 0) {
      p.m = String(Number(p.m) + Number(p.h) * 60).padStart(2, "0");
      p.h = "00";
    }
    setPaceM(p.m);
    setPaceS(p.s);
    setResult({
      type: "info",
      time: `${timeH}h ${timeM}m ${timeS}s`,
      dist: `${distAmount} ${distUnit}`,
      pace: `${p.m}m ${p.s}s / ${paceUnit}`,
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">Running Pace Calculator</h3>
      <p className="text-sm text-gray-500 mb-6">
        Enter any two values, then click the button for the third.
      </p>

      {/* Time */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">schedule</span>{" "}
          Time
        </h4>
        <div className="flex gap-2 items-end">
          <label className="form-control w-20">
            <span className="label-text text-xs">Hours</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              min="0"
              max="99"
              placeholder="hh"
              value={timeH}
              onChange={(e) => setTimeH(e.target.value)}
            />
          </label>
          <label className="form-control w-20">
            <span className="label-text text-xs">Mins</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              min="0"
              max="59"
              placeholder="mm"
              value={timeM}
              onChange={(e) => setTimeM(e.target.value)}
            />
          </label>
          <label className="form-control w-20">
            <span className="label-text text-xs">Secs</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              min="0"
              max="59"
              placeholder="ss"
              value={timeS}
              onChange={(e) => setTimeS(e.target.value)}
            />
          </label>
          <button
            className="btn btn-primary btn-sm"
            onClick={calcTime}
            disabled={!getDistance() || !getPace()}
          >
            Calculate Time
          </button>
        </div>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">signpost</span>{" "}
          Distance
        </h4>
        <div className="flex gap-2 items-end flex-wrap">
          <label className="form-control w-28">
            <span className="label-text text-xs">Distance</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              step="any"
              min="0"
              placeholder="0.00"
              value={distAmount}
              onChange={(e) => setDistAmount(e.target.value)}
            />
          </label>
          <label className="form-control w-28">
            <span className="label-text text-xs">Unit</span>
            <select
              className="select select-bordered select-sm"
              value={distUnit}
              onChange={(e) => setDistUnit(e.target.value)}
            >
              <option value="Mile">Miles</option>
              <option value="Kilometer">Kilometers</option>
              <option value="Meter">Meters</option>
              <option value="Yard">Yards</option>
            </select>
          </label>
          <span className="text-xs text-gray-400 self-center">or</span>
          <label className="form-control w-40">
            <span className="label-text text-xs">Pick Event</span>
            <select
              className="select select-bordered select-sm"
              onChange={(e) => handleEvent(e.target.value)}
            >
              {EVENTS.map((ev) => (
                <option key={ev.value} value={ev.value}>
                  {ev.label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn btn-primary btn-sm"
            onClick={calcDistance}
            disabled={!getTime() || !getPace()}
          >
            Calculate Distance
          </button>
        </div>
      </div>

      {/* Pace */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">bolt</span> Pace
        </h4>
        <div className="flex gap-2 items-end">
          <label className="form-control w-20">
            <span className="label-text text-xs">Mins</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              min="0"
              max="59"
              placeholder="mm"
              value={paceM}
              onChange={(e) => setPaceM(e.target.value)}
            />
          </label>
          <label className="form-control w-20">
            <span className="label-text text-xs">Secs</span>
            <input
              type="number"
              className="input input-bordered input-sm"
              min="0"
              max="60"
              placeholder="ss"
              value={paceS}
              onChange={(e) => setPaceS(e.target.value)}
            />
          </label>
          <label className="form-control w-28">
            <span className="label-text text-xs">Per</span>
            <select
              className="select select-bordered select-sm"
              value={paceUnit}
              onChange={(e) => setPaceUnit(e.target.value)}
            >
              <option value="Mile">Mile</option>
              <option value="Kilometer">Km.</option>
              <option value="Half Mile">880 yrds</option>
              <option value="Quarter Mile">440 yrds</option>
              <option value="Eigth Mile">220 yrds</option>
              <option value="1500M">1500 M</option>
              <option value="800M">800 M</option>
              <option value="400M">400 M</option>
              <option value="200M">200 M</option>
              <option value="Meter">Meter</option>
              <option value="Yard">Yard</option>
            </select>
          </label>
          <button
            className="btn btn-primary btn-sm"
            onClick={calcPace}
            disabled={!getTime() || !getDistance()}
          >
            Calculate Pace
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg p-4 ${result.type === "error" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}
        >
          {result.type === "error" ? (
            <p className="text-red-600 text-sm">{result.msg}</p>
          ) : (
            <div className="text-sm space-y-1">
              <p className="font-semibold text-green-700">Result:</p>
              <p>
                <span className="font-medium">Time:</span> {result.time}
              </p>
              <p>
                <span className="font-medium">Distance:</span> {result.dist}
              </p>
              <p>
                <span className="font-medium">Pace:</span> {result.pace}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
