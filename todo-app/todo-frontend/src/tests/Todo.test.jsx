import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Todo from "../Todos/Todo";

describe("Todo", () => {
  test("renders", () => {
    const data = { text: "Groceries", done: false };
    render(<Todo todo={data} />);
    expect(screen.getByText("Groceries")).toBeDefined();
    expect(screen.getByText("This todo is not done")).toBeDefined();
  });
});
