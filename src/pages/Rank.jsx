import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useResults } from "../hooks/useResults";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Spinner from "../views/spinner/Spinner";
import "../style/Rank.css";
import { NationMetadata } from "../shared/nationalMetadata";

const nationMap = Object.fromEntries(
  NationMetadata.NationInfor.map((n) => [n.name.toLowerCase(), n]),
);
const avatarBase = "/Avatar";
const flagBase = "/Flags";

const Rank = () => {
  const { eventId } = useParams();
  const { data: events = [] } = useEvents();
  const { data: results = [], isLoading, error } = useResults(eventId);

  const currentEvent = events.find((e) => String(e.id) === eventId);

  if (isLoading) return <Spinner />;
  if (error)
    return (
      <div className="leaderboard-style">
        <section className="leaderboard">
          <p className="text-center text-red-500">
            Failed to load leaderboard.
          </p>
        </section>
      </div>
    );

  const sorted = [...results].sort((a, b) => {
    const timeA = a.time || "99:99:99";
    const timeB = b.time || "99:99:99";
    return timeA.localeCompare(timeB);
  });

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  const podiumOrder =
    top3.length === 3
      ? [top3[1], top3[0], top3[2]]
      : top3.length === 2
        ? [top3[1], top3[0]]
        : top3;

  return (
    <div className="leaderboard-style">
      <section className="leaderboard">
        {/* <Breadcrumbs /> */}
        <h1>{currentEvent ? currentEvent.name : "Leaderboard"}</h1>

        {sorted.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No results available for this event.
          </p>
        ) : (
          <>
            <div className="top-runner">
              {podiumOrder.map((runner, idx) => {
                const actualRank = sorted.indexOf(runner) + 1;
                const isFirst = actualRank === 1;
                const isSecond = actualRank === 2;
                const isThird = actualRank === 3;
                return (
                  <div
                    key={runner.id}
                    className={`top-card ${isFirst ? "first" : isSecond ? "second" : isThird ? "third" : ""}`}
                  >
                    <div className="runner">
                      <img
                        src={runner.avatar || `${avatarBase}/${actualRank}.svg`}
                        alt={runner.runner_name}
                      />
                    </div>
                    <h2>{runner.runner_name}</h2>
                    <p>TOP {actualRank}</p>
                  </div>
                );
              })}
            </div>

            <div className="table-box">
              <div className="table-header">
                <span>Rank</span>
                <span>Name</span>
                <span>Nation</span>
                <span>Time Run</span>
              </div>

              {sorted.map((runner, i) => {
                const rank = i + 1;
                const rankClass =
                  rank === 1
                    ? "gold"
                    : rank === 2
                      ? "silver"
                      : rank === 3
                        ? "bronze"
                        : "";
                const entry = runner.nationality
                  ? nationMap[runner.nationality.toLowerCase()]
                  : null;
                const flagSrc = entry?.image_url || null;
                return (
                  <div key={runner.id} className="table-row">
                    <span className={`rank ${rankClass}`}>{rank}</span>
                    <span>{runner.runner_name}</span>
                    <span className="nation">
                      {runner.nationality}
                      {flagSrc && (
                        <img src={flagSrc} alt={runner.nationality} />
                      )}
                    </span>
                    <span>{runner.time}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Rank;
