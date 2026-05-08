import { useState } from "react";

export function useTeacherDialog() {
    const [open, setOpen] = useState(false);

    return {
        open,
        setOpen,
    };
}
