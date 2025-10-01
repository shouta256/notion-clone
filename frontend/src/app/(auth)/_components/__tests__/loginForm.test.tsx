import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/app/(auth)/_components/loginForm";
import { renderWithProviders } from "@/test/test-utils";

const fillLoginForm = async () => {
  const emailInput = screen.getByLabelText("email");
  const passwordInput = screen.getByLabelText("password");

  await userEvent.type(emailInput, "test@example.com");
  await userEvent.type(passwordInput, "supersecret");
};

describe("LoginForm", () => {
  it("calls onLogin with the entered credentials", async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);
    const onSwitchToSignup = vi.fn();

    renderWithProviders(<LoginForm onLogin={onLogin} onSwitchToSignup={onSwitchToSignup} />);

    await fillLoginForm();

    const submitButton = screen.getByRole("button", { name: "ログイン" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith("test@example.com", "supersecret");
    });
    expect(
      screen.queryByText("ユーザー名またはパスワードが正しくありません。"),
    ).not.toBeInTheDocument();
    expect(onSwitchToSignup).not.toHaveBeenCalled();
  });

  it("shows an error message when login fails", async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error("invalid"));

    renderWithProviders(<LoginForm onLogin={onLogin} onSwitchToSignup={vi.fn()} />);

    await fillLoginForm();

    const submitButton = screen.getByRole("button", { name: "ログイン" });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledTimes(1);
      expect(screen.getByText("ユーザー名またはパスワードが正しくありません。")).toBeVisible();
    });
  });

  it("invokes onSwitchToSignup when the switch button is activated", async () => {
    const onSwitchToSignup = vi.fn();

    renderWithProviders(<LoginForm onLogin={vi.fn()} onSwitchToSignup={onSwitchToSignup} />);

    const switchButton = screen.getByRole("button", { name: "こちら" });
    await userEvent.click(switchButton);
    expect(onSwitchToSignup).toHaveBeenCalledTimes(1);

    onSwitchToSignup.mockClear();

    switchButton.focus();
    await userEvent.keyboard("{Enter}");

    expect(onSwitchToSignup).toHaveBeenCalled();
  });
});
