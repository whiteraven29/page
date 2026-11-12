import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import { ApiError } from "../../api/client.js";
import { AuthContext } from "./AuthContext.js";
import LoginPage from "./LoginPage.jsx";

it("shows a friendly message when the password is wrong", async () => {
  const login = vi.fn().mockRejectedValue(new ApiError(401, null));
  render(
    <AuthContext.Provider value={{ login }}>
      <MemoryRouter><LoginPage /></MemoryRouter>
    </AuthContext.Provider>,
  );
  await userEvent.type(screen.getByLabelText("Email"), "amina@example.com");
  await userEvent.type(screen.getByLabelText("Password"), "wrong");
  await userEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password.");
  expect(login).toHaveBeenCalledWith("amina@example.com", "wrong");
});
