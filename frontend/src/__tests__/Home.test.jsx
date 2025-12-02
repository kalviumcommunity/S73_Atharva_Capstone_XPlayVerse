import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";

describe("Home Page Tests", () => {
  test("renders main heading", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("WELCOME TO");
    expect(heading).toHaveTextContent("XPlayVerse");
  });

  test("renders login button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  test("renders signup button", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText("SIGNUP")).toBeInTheDocument();
  });

  test("renders 3 feature cards", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const features = screen.getAllByRole("heading", { level: 3 });
    expect(features.length).toBe(3);
  });

  test("renders tagline/description", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/ultimate gaming platform/i)).toBeInTheDocument();
  });
});
