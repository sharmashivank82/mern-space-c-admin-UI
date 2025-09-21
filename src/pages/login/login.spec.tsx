import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./login";

describe("Login Page", () => {
  it("should render with require fields", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();
  });
});
