import { render, screen, fireEvent } from "@/test-utils";
import { Button } from "@/components/ui/button";

describe("Button", () => {
    it("renders children", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        fireEvent.click(screen.getByRole("button"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is set", () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("applies destructive variant class", () => {
        render(<Button variant="destructive">Delete</Button>);
        expect(screen.getByRole("button")).toHaveClass("bg-destructive");
    });
});
