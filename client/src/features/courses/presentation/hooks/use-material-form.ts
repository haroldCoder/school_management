import { useState } from "react";
import { MaterialFormDTO } from "../../application/dtos";

export function useMaterialForm() {
    const [materialForm, setMaterialForm] = useState<MaterialFormDTO>({
        title: "",
        description: "",
        file: null,
    });

    return {
        materialForm,
        setMaterialForm
    }
}