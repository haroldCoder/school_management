import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface Props {
    setLocation: (path: string) => void;
}

export const Navigation = ({ setLocation }: Props) => {
    return (
        < nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50" >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-xl text-foreground">EduGest</h1>
                </div>
                <Button onClick={() => setLocation("/auth")}>
                    Acceder
                </Button>
            </div>
        </nav >
    )
}
