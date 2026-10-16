const BASE_URL = "https://render72.pages.dev/api/test";

export async function getEvents() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${BASE_URL}/events`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getEventById(id) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      signal: controller.signal,
    });

    if (response.status === 404) {
      throw new Error("NOT_FOUND");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}