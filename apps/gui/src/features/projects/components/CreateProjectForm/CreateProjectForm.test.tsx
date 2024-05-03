import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import CreateProjectForm from "./CreateProjectForm";
import { screen, within, createRender } from "~test-utils";
import { createMockProject } from "~tests/helpers/mockData";

describe("CreateProjectForm", () => {
    const mockProject = createMockProject();
    const trpcFn = vi.fn().mockResolvedValue(mockProject);

    const render = createRender(trpcFn);

    function setup() {
        const user = userEvent.setup();

        const utils = render(<CreateProjectForm />);

        return {
            ...utils,
            user,
        };
    }

    test("submits form with valid input", async () => {
        const { user } = setup();

        // Fill in form fields with valid input
        await user.type(screen.getByLabelText(/name/i), mockProject.name);
        // Submit the form
        await user.click(screen.getByRole("button", { name: /submit/i }));

        const toast = await screen.findByRole("status");

        // Assert
        expect(
            within(toast).getByText(`${mockProject.name} has been created.`)
        ).toBeInTheDocument();
        expect(trpcFn).toBeCalledTimes(1);
        expect(trpcFn).toHaveBeenCalledWith(mockProject);
    });

    test("displays error message for invalid input", async () => {
        const { user } = setup();

        // Fill in form fields with valid input
        await user.type(screen.getByLabelText(/name/i), "1");
        // Submit the form
        await user.click(screen.getByRole("button", { name: /submit/i }));

        // Assert that the form is submitted successfully
        // Add your assertions here
        expect(
            screen.getByText(/name must be at least 3 character\(s\)/i)
        ).toBeInTheDocument();
        expect(trpcFn).not.toHaveBeenCalled();
    });
});
