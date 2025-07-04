import CategoryTabs from "@/components/CategoryDetail/CategoryTabs";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("CategoryTabs", () => {
  it("renders category buttons and highlights the selected one", () => {
    const categories = [
      { id: 1, title: "Fruits" },
      { id: 2, title: "Vegetables" },
    ];
    const onSelect = jest.fn();

    const { getByText } = render(
      <CategoryTabs
        categories={categories}
        selectedId={2}
        onSelect={onSelect}
      />
    );

    const fruits = getByText("Fruits");
    const vegetables = getByText("Vegetables");

    fireEvent.press(fruits);

    expect(onSelect).toHaveBeenCalledWith(1);
    expect(fruits.props.style).toContainEqual(
      expect.objectContaining({ color: "#333" })
    );
  });
});
