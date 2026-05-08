import { CourseFormDTO, QuizFormDTO, QuizQuestionDTO } from "../../application/dtos";

export const initialCourseState: CourseFormDTO = {
  name: "",
  code: "",
  description: "",
  credits: "",
  academicYear: new Date().getFullYear().toString(),
  semester: "1",
  maxStudents: "",
  status: "active",
};

export const defaultQuizQuestion = (): QuizQuestionDTO => ({
  content: "",
  questionType: "short_answer",
  correctAnswer: "",
  points: 1,
});

export const initialQuizState: QuizFormDTO = {
  title: "",
  description: "",
  questions: [defaultQuizQuestion()],
};
