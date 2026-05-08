import { useState } from "react";

export function useStudentDialog() {
    const [open, setOpen] = useState(false);

    return {
        open,
        setOpen,
    };
}