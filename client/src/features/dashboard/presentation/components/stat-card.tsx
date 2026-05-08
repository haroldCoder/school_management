import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
    loading: boolean;
}

export const StatCard = ({
    icon: Icon,
    label,
    value,
    loading,
}: StatCardProps) => (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {label}
            </CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
                <Skeleton className="h-8 w-16" />
            ) : (
                <div className="text-3xl font-bold text-foreground">{value}</div>
            )}
        </CardContent>
    </Card>
);
