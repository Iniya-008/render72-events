import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";

// Start fetching as soon as this module loads, not after the component mounts
let initialRequest = getEvents();
initialRequest.catch(() => {}); // avoid unhandled rejection; real handling is below

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    setError(false);

    try {
      const request = initialRequest || getEvents();
      initialRequest = null; // retries make a fresh request
      const data = await request;

      // Supports either an array response or { events: [...] }
      const eventList = Array.isArray(data) ? data : data.events || [];

      setEvents(eventList);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo">
          PULSE<span>.</span>
        </Link>

        <a href="#events" className="nav-link">
          Explore
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">EVENTS • IDEAS • EXPERIENCES</p>

            <h1>
              FIND WHAT'S
              <br />
              <span>HAPPENING.</span>
            </h1>

            <p className="hero-description">
              Discover hackathons, workshops and experiences worth showing up
              for.
            </p>

            <a href="#events" className="primary-button">
              Explore events ↓
            </a>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DISCOVER</p>
              <h2>Upcoming events</h2>
            </div>

            {!loading && !error && <p>{events.length} events</p>}
          </div>

          {loading ? (
            <div className="events-grid" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <div className="event-card skeleton" key={n}>
                  <div className="image-wrapper" />
                  <div className="event-info">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="empty-state">
              <p className="eyebrow">CONNECTION ERROR</p>
              <h3>Couldn't load events.</h3>
              <p>Something went wrong while contacting the server.</p>

              <button onClick={loadEvents} className="primary-button">
                Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <h3>No events available right now.</h3>
              <p>Check back soon for new experiences.</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <Link
                  to={`/event/${event.id}`}
                  className="event-card"
                  key={event.id}
                >
                  <div className="image-wrapper">
                    {event.cover_image_url ? (
                      <img
                        src={event.cover_image_url}
                        alt={event.cover_image_alt || event.name}
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="image-placeholder">EVENT</div>
                    )}

                    <span className="status">
                      {event.registration_status || "EVENT"}
                    </span>
                  </div>

                  <div className="event-info">
                    <div className="event-meta">
                      <span>{event.category || "Event"}</span>
                      <span>•</span>
                      <span>{event.event_mode || "OFFLINE"}</span>
                    </div>

                    <h3>{event.name}</h3>

                    <p>{event.blurb}</p>

                    <div className="card-bottom">
                      <strong>
                        {event.price === 0
                          ? "FREE"
                          : event.price
                            ? `₹${event.price}`
                            : "VIEW EVENT"}
                      </strong>

                      <span>View event →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <strong>PULSE.</strong>
        <p>Find your next experience.</p>
      </footer>
    </>
  );
}

export default Home;