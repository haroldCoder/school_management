interface StepIndicatorProps {
    quizStep: 1 | 2;
}

export const StepIndicator = ({ quizStep }: StepIndicatorProps) => {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${quizStep === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                    }`}
            >
                1
            </span>
            <span className={quizStep === 1 ? "font-medium text-foreground" : ""}>Información</span>
            <div className="flex-1 h-px bg-border" />
            <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${quizStep === 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                    }`}
            >
                2
            </span>
            <span className={quizStep === 2 ? "font-medium text-foreground" : ""}>Preguntas</span>
        </div>
    );
};