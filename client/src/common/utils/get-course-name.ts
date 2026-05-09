export const getCourseName = (courseId: number, courses: any[]) => {
    const course = courses?.find((c) => c.id === courseId);
    return course ? course.name : "-";
};