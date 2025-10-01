import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InputField } from "@/app/(auth)/_components/inputField";
import { renderWithProviders } from "@/test/test-utils";

describe("InputField", () => {
  it("calls onChange when the user types", async () => {
    const handleChange = vi.fn();

    renderWithProviders(
      <InputField
        label="email"
        type="email"
        value=""
        onChange={handleChange}
        placeholder="メールアドレスを入力"
      />,
    );

    await userEvent.type(screen.getByPlaceholderText("メールアドレスを入力"), "foo@bar.com");

    expect(handleChange).toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    renderWithProviders(
      <InputField
        label="password"
        type="password"
        value="secret"
        onChange={vi.fn()}
        placeholder="パスワードを入力"
      />,
    );

    const input = screen.getByPlaceholderText("パスワードを入力");
    expect(input).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button");
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("does not render the visibility toggle for non-password inputs", () => {
    renderWithProviders(
      <InputField
        label="user name"
        type="text"
        value=""
        onChange={vi.fn()}
        placeholder="ユーザ名を入力"
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });
});
