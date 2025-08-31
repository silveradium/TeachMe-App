import type { HighestEducationalExperience as HighestEducationalExperienceType } from "@prisma/client";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import type { SelectItem } from "~/components/ui";
import { Button, Input, MultiValueInput, Select } from "~/components/ui";
import { HIGHEST_EDUCATIONAL_EXPERIENCES } from "~/constants/highest-educational-experiences";
import { classNames } from "~/lib/classNames";
import { api } from "~/utils/api";

export default function OnboardingForm() {
  const router = useRouter();
  const { mutate: finishOnboarding, isLoading: finishOnboardingInProgress } =
    api.profile.finishOnboarding.useMutation({
      async onSuccess() {
        await router.push("/dashboard");
      },
      onError() {
        resetFields();
      },
    });
  const [name, setName] = useState("");
  const [highestEducationalExperience, setHighestEducationalExperience] =
    useState<SelectItem<HighestEducationalExperienceType>>();
  const [interestedTopics, setInterestedTopics] = useState<string[]>([]);
  const [interestedTopicsInputFieldValue, setInterestedTopicsInputFieldValue] = useState("");
  const disabled = useMemo(
    () => !name.trim() || !highestEducationalExperience,
    [highestEducationalExperience, name]
  );

  const resetFields = useCallback(() => {
    setName("");
    setHighestEducationalExperience(undefined);
    setInterestedTopics([]);
  }, []);

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  return (
    <div
      className={classNames(
        "relative mx-auto mt-8 w-[42rem] max-w-2xl space-y-6 rounded-3xl bg-white px-12 pb-12 pt-8 shadow-md"
      )}>
      <Input
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="Jane Doe"
        className="text-lg"
        wrapperClassName="space-y-2"
        label="Your full name"
        labelClassName="text-2xl"
      />

      <Select
        state={[highestEducationalExperience, setHighestEducationalExperience]}
        items={HIGHEST_EDUCATIONAL_EXPERIENCES}
        className="text-lg"
        wrapperClassName="space-y-4"
        label="Highest Educational Experience"
        labelClassName="text-2xl"
      />

      <MultiValueInput
        values={interestedTopics}
        setValues={setInterestedTopics}
        valueOnInputField={interestedTopicsInputFieldValue}
        setValueOnInputField={setInterestedTopicsInputFieldValue}
        placeholder="Radiation techniques, Nuclear fusion, Isomorphism"
        label="Interested topics"
        className="text-lg"
        wrapperClassName="space-y-2"
        labelClassName="text-2xl"
      />

      <Button
        size="lg"
        className={classNames("absolute -bottom-6 right-8")}
        onClick={() => {
          if (!highestEducationalExperience) {
            return;
          }
          finishOnboarding({
            name,
            highestEducationalExperience: highestEducationalExperience.name,
            interestedTopics: (() => {
              if (interestedTopics.length === 0) {
                return [interestedTopicsInputFieldValue];
              }
              return interestedTopics;
            })(),
          });
        }}
        loading={finishOnboardingInProgress}
        disabled={disabled}>
        Next
      </Button>
    </div>
  );
}
