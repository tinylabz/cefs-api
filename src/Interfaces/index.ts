import { Types } from "mongoose";

export enum NATURE {
  MISSING_MARK = "MISSING MARKS",
  REMARK = "REMARK",
  WRONG_ACADEMIC_YEAR = "WRONG ACADEMIC YEAR",
}

export enum DESIGNATIONS {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  REGISTRAR = "REGISTRAR",
  HOD = "HOD",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum SEMESTER {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

export enum COMPLAINT_STATUSES {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export enum COLLEGES {
  CAES = "CAES",
  COBAMS = "COBAMS",
  COCIS = "COCIS",
  CEES = "CEES",
  CEDAT = "CEDAT",
  CHS = "CHS",
  CHUSS = "CHUSS",
  CONAS = "CONAS",
  COVAB = "COVAB",
  SoL = "SoL",
}

export enum SCHOOLS {
  SCHOOL_OF_AGRICULTURAL_SCIENCES = "School of Agricultural Sciences",
  SCHOOL_OF_FORESTRY_ENVIRONMENTAL_AND_GEOGRAPHICAL_SCIENCES = "School of Forestry, Environmental and Geographical Sciences",
  SCHOOL_OF_FOOD_TECHNOLOGY_NUTRITION_AND_BIOENGINEERING = "School of Food Technology, Nutrition and Bioengineering",
  SCHOOL_OF_ECONOMICS = "School of Economics",
  SCHOOL_OF_BUSINESS = "School of Business",
  SCHOOL_OF_STATISTICS_AND_PLANNING = "School of Statistics and Planning",
  SCHOOL_OF_COMPUTING_AND_INFORMATICS_TECHNOLOGY = "School of Computing and Informatics Technology",
  EAST_AFRICAN_SCHOOL_OF_LIBRARY_AND_INFORMATION_SCIENCE = "East African School of Library and Information Science",
  SCHOOL_OF_EDUCATION = "School of Education",
  SCHOOL_OF_DISTANCE_AND_LIFELONG_LEARNING = "School of Distance and Lifelong Learning",
  INSTITUTE_OF_OPEN_DISTANCE_AND_ELEARNING = "Institute of Open Distance and eLearning",
  EAST_AFRICAN_SCHOOL_OF_HIGHER_EDUCATION_STUDIES_AND_DEVELOPMENT = "East African School of Higher Education Studies and Development",
  SCHOOL_OF_ENGINEERING = "School of Engineering",
  SCHOOL_OF_THE_BUILT_ENVIRONMENT = "School of the Built Environment",
  MARGARET_TROWELL_SCHOOL_OF_INDUSTRIAL_AND_FINE_ART = "Margaret Trowell School of Industrial and Fine Art",
  SCHOOL_OF_MEDICINE = "School of Medicine",
  SCHOOL_OF_PUBLIC_HEALTH = "School of Public Health",
  SCHOOL_OF_BIOMEDICAL_SCIENCES = "School of Biomedical Sciences",
  SCHOOL_OF_HEALTH_SCIENCES = "School of Health Sciences",
  SCHOOL_OF_LIBERAL_AND_PERFORMING_ARTS = "School of Liberal and Performing Arts",
  SCHOOL_OF_WOMEN_AND_GENDER_STUDIES = "School of Women and Gender Studies",
  SCHOOL_OF_LANGUAGES_LITERATURE_AND_COMMUNICATION = "School of Languages, Literature and Communication",
  SCHOOL_OF_PSYCHOLOGY = "School of Psychology",
  SCHOOL_OF_SOCIAL_SCIENCES = "School of Social Sciences",
  SCHOOL_OF_PHYSICAL_SCIENCES = "School of Physical Sciences",
  SCHOOL_OF_BIOSCIENCES = "School of Biosciences",
  SCHOOL_OF_BIOSECURITY_BIOTECHNICAL_AND_LABORATORY_SCIENCES = "School of Biosecurity, Biotechnical and Laboratory Sciences",
  SCHOOL_OF_VETERINARY_AND_ANIMAL_RESOURCES = "School of Veterinary and Animal Resources",
  SCHOOL_OF_LAW = "School of Law",
}

export type UserPayload = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  designation: DESIGNATIONS;
  college: COLLEGES;
};

export enum RESPONSES {
  NO_TEST_ATTENDENCE = "This student may not have attended the test for the specified course unit",
  NO_EXAM_ATTENDENCE = "This student may not have attended the exam for the specified course unit",
  NO_RESULTS = "No results for student in the specified course unit. This mean that the student never sat for any of the C/W, tests or final exam",
}
