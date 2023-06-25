import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../components/Header";

jest.mock("@auth0/auth0-react");

describe("Header component", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
      user: null,
      isLoading: false,
      logout: jest.fn(),
    });
  });

  test("renders Home link and login buttons when not authenticated", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  test("renders profile link and logout button when authenticated", () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
      user: { name: "" },
      isLoading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Auth Debugger")).toBeInTheDocument();
    expect(screen.getByText("LogOut")).toBeInTheDocument();
    expect(screen.getByText("Welcome 👋")).toBeInTheDocument();
  });
});
