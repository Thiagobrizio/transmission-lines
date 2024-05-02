import { faker } from "@faker-js/faker";
import { Button } from "@repo/ui";
import { defaultConductorLocation } from "@repo/validators/forms/ConductorLocation.schema";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useCreateConductorLocationModal } from "~/utils/modals";
import { createRender, screen, within } from "~test-utils";
import completeForm from "~tests/helpers/completeForm";
import { createConductorLocation, mockIds } from "~tests/helpers/mockData";

const labels = {
    x: /x/i,
    y: /y/i,
};

describe("Create Conductor Location Modal", () => {
    const mockConductorLocation = createConductorLocation();
    const geometryId = mockIds.geometryId();
    const trpcFn = vi.fn().mockResolvedValue(mockConductorLocation);
    const render = createRender(trpcFn);
    const displayModal = useCreateConductorLocationModal(geometryId);

    async function renderForm() {
        const user = userEvent.setup();
        const utils = render(
            <Button onClick={displayModal}>Click Here</Button>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /click here/i })
        );
        const dialog = await screen.findByRole("dialog");
        const form = await within(dialog).findByRole("form");

        return {
            ...utils,
            dialog,
            form,
            user,
        };
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("fill out form correctly and test that the information is sent to server", async () => {
        const { form, user, dialog } = await renderForm();

        expect(form).toHaveFormValues(defaultConductorLocation);
        await completeForm(user, form, labels, mockConductorLocation);

        const confirm = within(dialog).getByRole("button", {
            name: /create/i,
        });

        await user.click(confirm);

        expect(trpcFn).toHaveBeenCalledWith({
            geometryId,
            ...mockConductorLocation,
        });
        expect(trpcFn).toHaveBeenCalledTimes(1);
        expect(dialog).not.toBeInTheDocument();
    });

    test("incorrect data is not sent to server", async () => {
        const { form, user, dialog } = await renderForm();

        await completeForm(user, form, labels, {
            ...mockConductorLocation,
            y: faker.number.int({ min: -10, max: -1 }),
        });

        const confirm = within(dialog).getByRole("button", {
            name: /create/i,
        });

        await user.click(confirm);

        expect(trpcFn).not.toHaveBeenCalled();
        expect(dialog).toBeInTheDocument();
    });
});
