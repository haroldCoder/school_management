export const getStatusBadge = (status: string | null) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-gray-100 text-gray-800";
        case "on_leave":
            return "bg-yellow-100 text-yellow-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};