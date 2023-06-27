import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import React from "react";

let mockAccessToken = "mockAccessToken";

let mockIsAuthenticated = true;

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: {
        sub: "subId",
        name: "yaqi",
        email: "yaqi@gmail.com",
        email_verified: true,
      },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: jest.fn(),
    };
  },
}));

jest.mock("../AuthTokenContext", () => ({
    useAuthToken: () => {
      return {
        accessToken: mockAccessToken,
      };
    },
  }));

test("renders Profile", () => {

  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <Profile />
    </MemoryRouter>
  );

  expect(screen.getByText("Personal Infomation")).toBeInTheDocument();
});