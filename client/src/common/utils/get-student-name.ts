export const getStudentName = (studentId: number, students: any[]) => {
    const student = students?.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "-";
};