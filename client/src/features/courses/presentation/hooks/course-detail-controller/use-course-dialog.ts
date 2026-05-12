import { useState } from "react";

export function useCourseDialogs() {
    const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
    const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
    const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
    const [openAnswersListDialog, setOpenAnswersListDialog] = useState(false);

    return {
        openMaterialDialog,
        setOpenMaterialDialog,
        openQuestionDialog,
        setOpenQuestionDialog,
        openAnswerDialog,
        setOpenAnswerDialog,
        openAnswersListDialog,
        setOpenAnswersListDialog,
    };
}