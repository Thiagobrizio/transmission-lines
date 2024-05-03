import { format } from "date-fns";
import { toast } from "sonner";

function success(text: string) {
    toast.success(text, {
        duration: 100000,
        description: format(new Date(), "PPPPpp"),
    });
}
function error(text: string) {
    toast.error(text, {
        description: format(new Date(), "PPPPpp"),
    });
}

export default {
    success,
    error,
};
