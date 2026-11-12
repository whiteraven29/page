import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, api, setAccessToken } from "./client.js";

const json = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), { status });

afterEach(() => {
  vi.restoreAllMocks();
  setAccessToken(null);
});

describe("api client", () => {
  it("sends the access token", async () => {
    setAccessToken("abc");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(json(200, { ok: true }));
    await api("/notes/");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });

  it("refreshes once on 401 and retries", async () => {
    setAccessToken("old");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(json(401, { error: { message: "expired" } }))
      .mockResolvedValueOnce(json(200, { access: "new" }))
      .mockResolvedValueOnce(json(200, { results: [] }));
    const data = await api("/notes/");
    expect(data).toEqual({ results: [] });
    expect(fetchMock.mock.calls[1][0]).toBe("/api/v1/auth/refresh/");
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe("Bearer new");
  });

  it("turns the standard error shape into ApiError", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      json(400, { error: { status: 400, code: "invalid", message: "Some fields need fixing.", details: { title: ["Required."] } } }),
    );
    const err = await api("/notes/", { method: "POST", body: {} }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.details.title[0]).toBe("Required.");
  });
});
