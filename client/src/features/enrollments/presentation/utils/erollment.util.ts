export const getStudentName = (studentId: number, students: any[]) => {
    const student = students?.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "-";
};

export const getCourseName = (courseId: number, courses: any[]) => {
    const course = courses?.find((c) => c.id === courseId);
    return course ? course.name : "-";
};