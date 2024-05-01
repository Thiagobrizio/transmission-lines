import { styled } from "@linaria/react";
import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
} from "@repo/ui";
import { Check, ChevronsUpDown } from "lucide-react";
import { forwardRef, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Data = {
    id: string;
    name: string;
} & Record<string, unknown>;

export interface BaseSelectProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    data: Data[];
    onChange?: (value: string | number | readonly string[] | undefined) => void;
}

const BaseSelect = forwardRef<HTMLButtonElement, BaseSelectProps>(
    ({ data, value, onChange, ...props }, ref) => {
        const { t } = useTranslation("baseSelect");
        const [open, setOpen] = useState(false);

        function handleSelect(currentValue: typeof value) {
            if (onChange) onChange(currentValue === value ? "" : currentValue);
            setOpen(false);
        }

        const selectedName = useMemo(() => {
            if (value) {
                const currentConductorType = data.find(
                    (conductorType) => conductorType.id === value
                );
                if (currentConductorType) {
                    return currentConductorType.name;
                }
                throw Error("Can't find conductor type.");
            }
            return t("select");
        }, [data, t, value]);

        return (
            <Popover open={open} onOpenChange={setOpen} modal>
                <PopoverTrigger asChild>
                    <StyledButton
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        ref={ref}
                        {...props}
                    >
                        {selectedName}
                        <StyledChevron />
                    </StyledButton>
                </PopoverTrigger>
                <StyledPopoverContent>
                    <Command>
                        <CommandInput placeholder={t("searchConductors")} />
                        <StyledScrollArea>
                            <CommandEmpty>{t("noneFound")}</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {data.map((conductorType) => (
                                        <CommandItem
                                            key={conductorType.id}
                                            value={conductorType.id}
                                            keywords={[conductorType.name]}
                                            onSelect={handleSelect}
                                        >
                                            <StyledIcon
                                                selected={
                                                    value === conductorType.id
                                                }
                                            />
                                            {conductorType.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </StyledScrollArea>
                    </Command>
                </StyledPopoverContent>
            </Popover>
        );
    }
);

export default BaseSelect;

const StyledIcon = styled(Check)<{ selected: boolean }>`
    margin-right: 0.5rem;
    width: 1rem;
    height: 1rem;
    opacity: ${(props) => (props.selected ? 1 : 0)};
`;

const StyledChevron = styled(ChevronsUpDown)`
    margin-left: 0.5rem;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    opacity: 0.5;
`;

const StyledPopoverContent = styled(PopoverContent)`
    padding: 0;
    width: 200px;
`;

const StyledButton = styled(Button)`
    justify-content: space-between;
    width: 100%;
`;

const StyledScrollArea = styled(ScrollArea)`
    height: 20rem;
`;
