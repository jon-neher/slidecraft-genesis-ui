import { describe, it, expect, vi, beforeEach } from "vitest";
import { ensureAccessToken } from "./hubspot_tokens";

const selectMock = vi.fn();
const updateMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: () => ({ select: selectMock, update: updateMock }),
  })),
}));

let fetchMock: any;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  selectMock.mockReset();
  updateMock.mockReset();
});

describe("ensureAccessToken", () => {
  it("returns existing token when not expired", async () => {
    selectMock.mockReturnValue({
      eq: () => ({
        maybeSingle: () =>
          Promise.resolve({
            data: {
              access_token: "tok",
              refresh_token: "ref",
              expires_at: new Date(Date.now() + 3600e3).toISOString(),
            },
            error: null,
          }),
      }),
    });

    const token = await ensureAccessToken("p1");

    expect(token).toBe("tok");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("refreshes expired token", async () => {
    const expired = new Date(Date.now() - 1000).toISOString();
    selectMock.mockReturnValue({
      eq: () => ({
        maybeSingle: () =>
          Promise.resolve({
            data: {
              access_token: "old",
              refresh_token: "ref",
              expires_at: expired,
            },
            error: null,
          }),
      }),
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "new",
        refresh_token: "newref",
        expires_in: 3600,
      }),
    });
    updateMock.mockReturnValue({ eq: () => Promise.resolve({}) });

    const token = await ensureAccessToken("p1");

    expect(fetchMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(token).toBe("new");
  });
});
