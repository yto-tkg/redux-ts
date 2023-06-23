import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../../../utils/test-utils";
import UserDisplay from "../UserDisplay";
import { fireEvent, screen } from "@testing-library/react";

export const handlers = [
  rest.get("/api/user", (req, res, ctx) => {
    return res(ctx.json("John Smith"), ctx.delay(150));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

test("fetches & receives a user after clicking the fetch user button", async () => {
  renderWithProviders(<UserDisplay />);

  expect(screen.getByText(/no user/i)).toBeInTheDocument();
  expect(screen.queryByText(/Fetching user/i)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /fetch user/i }));
  expect(screen.getByText(/no user/i)).toBeInTheDocument();

  expect(await screen.findByText(/John Smith/i)).toBeInTheDocument();
  expect(screen.queryByText(/no user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Fetchin user/i)).not.toBeInTheDocument();
});
