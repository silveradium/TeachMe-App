import type { HighestEducationalExperience as HighestEducationalExperienceType } from "@prisma/client";
import { HighestEducationalExperience } from "@prisma/client";
import type { SelectItem } from "~/components/ui";

export const HIGHEST_EDUCATIONAL_EXPERIENCES: SelectItem<HighestEducationalExperienceType>[] = [
  {
    id: 0,
    name: HighestEducationalExperience.LESS_THAN_HIGH_SCHOOL_DIPLOMA,
    title: "Less than high school diploma",
  },
  {
    id: 1,
    name: HighestEducationalExperience.HIGH_SCHOOL_DIPLOMA,
    title: "High school diploma or GED",
  },
  {
    id: 2,
    name: HighestEducationalExperience.SOME_COLLEGE_NO_DEGREE,
    title: "Some college, but no degree",
  },
  {
    id: 3,
    name: HighestEducationalExperience.ASSOCIATES_DEGREE,
    title: "Associate's Degree (for example: AA, AS)",
  },
  {
    id: 4,
    name: HighestEducationalExperience.BACHELORS_DEGREE,
    title: "Bachelor's Degree (for example: BA, BBA, BS)",
  },
  {
    id: 5,
    name: HighestEducationalExperience.MASTERS_DEGREE,
    title: "Master's Degree (for example: MA, MS, MEng)",
  },
  {
    id: 6,
    name: HighestEducationalExperience.PROFESSIONAL_DEGREE,
    title: "Professional Degree (for example: MD, DDS, JD)",
  },
  {
    id: 7,
    name: HighestEducationalExperience.DOCTORATE,
    title: "Doctorate (for example: PhD, EdD)",
  },
];
