import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../services/api";

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==============================
  // LOAD EVENT
  // ==============================

  const loadEvent = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEventById(id);

      // API may return { event: {...} }
      // or directly the event object
      setEvent(data.event || data);
    } catch (err) {
      console.error(err);

      if (err.message === "NOT_FOUND") {
        setError("NOT_FOUND");
      } else {
        setError("SERVER");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <main className="state-page">
        <div className="loader"></div>
        <h2>Loading event...</h2>
      </main>
    );
  }

  // ==============================
  // 404
  // ==============================

  if (error === "NOT_FOUND") {
    return (
      <main className="state-page">
        <p className="eyebrow">404</p>

        <h1>Event not found.</h1>

        <p>
          The event you're looking for doesn't seem to exist.
        </p>

        <Link to="/" className="primary-button">
          Back home
        </Link>
      </main>
    );
  }

  // ==============================
  // SERVER ERROR
  // ==============================

  if (error || !event) {
    return (
      <main className="state-page">
        <p className="eyebrow">CONNECTION ERROR</p>

        <h1>Couldn't load this event.</h1>

        <p>
          Please check your connection and try again.
        </p>

        <button
          onClick={loadEvent}
          className="primary-button"
        >
          Try Again
        </button>
      </main>
    );
  }

  // ==============================
  // SEATS LEFT
  // ==============================

  const seatsLeft =
    event.total_seats != null &&
    event.seats_filled != null
      ? Math.max(
          event.total_seats - event.seats_filled,
          0
        )
      : null;

  // ==============================
  // REGISTER BUTTON
  // ==============================

  const handleRegister = () => {
    if (event.registration_status !== "OPEN") {
      return;
    }

    alert(
      `Registration is open for ${event.name}!\n\nPlease contact the event organizer to complete registration.`
    );
  };

  // ==============================
  // PAGE
  // ==============================

  return (
    <>
      {/* NAVBAR */}

      <header className="navbar">
        <Link to="/" className="logo">
          PULSE<span>.</span>
        </Link>

        <Link to="/" className="nav-link">
          ← All events
        </Link>
      </header>

      <main className="detail-page">

        {/* ==============================
            HERO
        ============================== */}

        <section className="detail-hero">

          <div>
            <p className="eyebrow">
              {event.category || "EVENT"}

              {event.event_mode &&
                ` • ${event.event_mode}`}
            </p>

            <h1>{event.name}</h1>

            {event.blurb && (
              <p className="detail-blurb">
                {event.blurb}
              </p>
            )}

            {/* TAGS */}

            {event.tags?.length > 0 && (
              <div className="event-tags">
                {event.tags.map((tag, index) => (
                  <span key={`${tag}-${index}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ==============================
              REGISTRATION CARD
          ============================== */}

          <div className="registration-card">

            <p>REGISTRATION</p>

            <h2>
              {event.price === 0
                ? "FREE"
                : event.price != null
                  ? `₹${Number(
                      event.price
                    ).toLocaleString("en-IN")}`
                  : "EVENT"}
            </h2>

            {/* PRICE TYPE */}

            {event.is_per_head === false &&
              event.price > 0 && (
                <small>per team</small>
              )}

            {event.is_per_head === true &&
              event.price > 0 && (
                <small>per person</small>
              )}

            {/* SEATS */}

            {seatsLeft !== null && (
              <p>
                {seatsLeft > 0
                  ? `${seatsLeft} seats remaining`
                  : "No seats remaining"}
              </p>
            )}

            {/* REGISTER BUTTON */}

            <button
              type="button"
              className="primary-button register-button"
              disabled={
                event.registration_status !== "OPEN"
              }
              onClick={handleRegister}
            >
              {event.registration_status === "OPEN"
                ? "Register now →"
                : event.registration_status ===
                    "SOLD_OUT"
                  ? "SOLD OUT"
                  : event.registration_status ===
                      "CLOSED"
                    ? "CLOSED"
                    : "Unavailable"}
            </button>

          </div>
        </section>

        {/* ==============================
            BANNER IMAGE
        ============================== */}

        {(event.banner_image_url ||
          event.cover_image_url) && (
          <div className="banner-wrapper">

            <img
              src={
                event.banner_image_url ||
                event.cover_image_url
              }
              alt={
                event.banner_image_alt ||
                event.cover_image_alt ||
                event.name
              }
            />

          </div>
        )}

        {/* ==============================
            DETAIL CONTENT
        ============================== */}

        <div className="detail-content">

          {/* ABOUT */}

          {(event.description || event.blurb) && (
            <section>

              <p className="eyebrow">
                ABOUT
              </p>

              <h2>
                The experience.
              </h2>

              <p className="large-copy">
                {event.description ||
                  event.blurb}
              </p>

            </section>
          )}

          {/* ==============================
              HIGHLIGHTS
          ============================== */}

          {event.highlights?.length > 0 && (
            <section>

              <p className="eyebrow">
                HIGHLIGHTS
              </p>

              <h2>
                Why show up?
              </h2>

              <div className="highlight-grid">

                {event.highlights.map(
                  (item, index) => (
                    <div
                      className="highlight-card"
                      key={index}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <p>
                        {typeof item === "string"
                          ? item
                          : item.title ||
                            item.description ||
                            ""}
                      </p>

                    </div>
                  )
                )}

              </div>
            </section>
          )}

          {/* ==============================
              WHAT TO EXPECT
          ============================== */}

          {event.what_to_expect?.length >
            0 && (
            <section>

              <p className="eyebrow">
                WHAT TO EXPECT
              </p>

              <h2>
                Come ready.
              </h2>

              <ul className="clean-list">

                {event.what_to_expect.map(
                  (item, index) => (
                    <li key={index}>
                      {typeof item ===
                      "string"
                        ? item
                        : item.title ||
                          item.description ||
                          ""}
                    </li>
                  )
                )}

              </ul>

            </section>
          )}

          {/* ==============================
              SCHEDULE
          ============================== */}

          {event.schedules?.length > 0 && (
            <section>

              <p className="eyebrow">
                SCHEDULE
              </p>

              <h2>
                When & where.
              </h2>

              <div className="schedule-list">

                {event.schedules.map(
                  (schedule, index) => (
                    <div
                      className="schedule-item"
                      key={index}
                    >

                      <strong>
                        {schedule.title ||
                          schedule.name ||
                          `Session ${
                            index + 1
                          }`}
                      </strong>

                      <p>
                        {schedule.venue ||
                          schedule.location ||
                          schedule.description ||
                          ""}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* ==============================
              PRIZES
          ============================== */}

          {event.prizes?.length > 0 && (
            <section className="prize-section">

              <p className="eyebrow">
                PRIZES
              </p>

              <h2>
                Build something that matters.
              </h2>

              <div className="prize-grid">

                {event.prizes.map(
                  (prize, index) => (
                    <div key={index}>

                      <span>
                        {prize.title ||
                          prize.name ||
                          "Prize"}
                      </span>

                      <strong>
                        {prize.amount != null
                          ? `₹${Number(
                              prize.amount
                            ).toLocaleString(
                              "en-IN"
                            )}`
                          : prize.description ||
                            ""}
                      </strong>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* ==============================
              ELIGIBILITY
          ============================== */}

          {event.eligibility?.length > 0 && (
            <section>

              <p className="eyebrow">
                BEFORE YOU APPLY
              </p>

              <h2>
                Eligibility.
              </h2>

              <ul className="clean-list">

                {event.eligibility.map(
                  (item, index) => (
                    <li key={index}>
                      {typeof item ===
                      "string"
                        ? item
                        : item.title ||
                          item.description ||
                          ""}
                    </li>
                  )
                )}

              </ul>

              {(event.min_teamsize ||
                event.max_teamsize) && (
                <p className="team-size">

                  Team size:{" "}

                  {event.min_teamsize || 1}

                  {" – "}

                  {event.max_teamsize ||
                    event.min_teamsize ||
                    1}

                </p>
              )}

            </section>
          )}

          {/* ==============================
              FAQ
          ============================== */}

          {event.faqs?.length > 0 && (
            <section>

              <p className="eyebrow">
                FAQ
              </p>

              <h2>
                Questions, answered.
              </h2>

              <div className="faq-list">

                {event.faqs.map(
                  (faq, index) => (
                    <details key={index}>

                      <summary>
                        {faq.question ||
                          `Question ${
                            index + 1
                          }`}
                      </summary>

                      <p>
                        {faq.answer ||
                          "Information not available."}
                      </p>

                    </details>
                  )
                )}

              </div>

            </section>
          )}

        </div>
      </main>

      {/* ==============================
          FOOTER
      ============================== */}

      <footer>
        <strong>PULSE.</strong>

        <p>
          Find your next experience.
        </p>
      </footer>
    </>
  );
}

export default EventDetail;