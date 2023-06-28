import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

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
        name: "john",
        email: "john@gmail.com",
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

  beforeEach(() => {
    fetch.resetMocks();
  });
  
  test("renders Profile", async () => {
    fetch.mockResponseOnce(JSON.stringify({ id: 1, name: "john", email: "john@gmail.com" }));
  
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Profile />
      </MemoryRouter>
    );
  
    expect(screen.getByText("is loading")).toBeInTheDocument();
  
    // await screen.findByText("personal information");
  });