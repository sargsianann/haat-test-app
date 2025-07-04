import Header from "@/components/CategoryDetail/Header";
import { render } from "@testing-library/react-native";
import React from "react";

describe("Header", () => {
  it("renders title and applies paddingTop and height", () => {
    const { getByText, getByTestId } = render(
      <Header title="My Market" paddingTop={40} height={100} />
    );

    const title = getByText("My Market");
    expect(title).toBeTruthy();

    const blurView = getByTestId("header-blur");
    expect(blurView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ paddingTop: 40, height: 100 }),
      ])
    );
  });
});
