import { render, screen } from "@testing-library/react";
import Home from "./pages/home";
import { vi } from "vitest";

// Mock your hook
vi.mock("../hooks/useFeatured", () => ({
  useFeatured: () => ({
    data: [],
    loading: false,
    error: null,
  }),
}));

// Mock child components
vi.mock("../components/PokemonCard", () => ({
  default: () => <div>Pokemon Card</div>,
}));

vi.mock("../components/PokemonModal", () => ({
  default: () => <div>Pokemon Modal</div>,
}));

test("renders Home without crashing", () => {
  render(<Home />);
  expect(screen.getByText(/Catch 'em/i)).toBeInTheDocument();
});